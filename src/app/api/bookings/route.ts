import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notifyBookingCreated, notifyBookingStatusUpdate } from '@/lib/notifications';
import { addFallbackBooking, getFallbackBookings, updateFallbackBooking, StoredBooking } from '@/lib/booking-store';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

// GET /api/bookings — get all bookings for the logged-in user
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let dbBookings: any[] = [];
  try {
    dbBookings = await prisma.booking.findMany({
      where: { customerId: session.user.id },
      include: {
        address: true,
        helper: {
          include: {
            user: { select: { name: true, phone: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.warn('Prisma query warning in GET /api/bookings:', err);
  }

  const fallbackList = getFallbackBookings().filter(b => 
    b.customer?.id === session.user.id || 
    (session.user.phone && b.customer?.phone === session.user.phone)
  );

  const combined = [...fallbackList, ...dbBookings];
  const uniqueBookings = Array.from(new Map(combined.map(b => [b.id, b])).values());

  return NextResponse.json({ bookings: uniqueBookings });
}

// POST /api/bookings — create a new booking (Supports both Logged-in & Guest Flow with zero-fail resilience)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const {
      serviceId, serviceName, type, scheduledDate, timeSlot,
      durationHours, baseAmount, specialInstructions,
      phone, customerName, address, shortlistedHelpers, requirements
    } = body;

    // Validate required booking fields
    if (!serviceId || !serviceName || !type || !scheduledDate || baseAmount === undefined) {
      return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 });
    }

    const cleanPhone = phone 
      ? phone.replace(/\D/g, '').slice(-10) 
      : (session?.user?.phone || '9876543210');
    const finalCustomerName = customerName || session?.user?.name || 'Customer';

    let customerId = session?.user?.id;

    const base = Number(baseAmount);
    const serviceFee = Math.round(base * 0.05); // 5% Platform Fee
    const gstAmount = 0; // GST disabled
    const totalAmount = base + serviceFee;

    // Commission: 10% cut from service charge, 90% goes to helper
    const platformCommission = Math.round(base * 0.10);
    const helperPayout = base - platformCommission;

    // Build consolidated instructions / notes
    const notesParts: string[] = [];
    if (specialInstructions) notesParts.push(`Instructions: ${specialInstructions}`);
    notesParts.push(`Commission: ₹${platformCommission} (10%) | Platform Fee: ₹${serviceFee} (5%) | Helper Payout: ₹${helperPayout}`);
    if (shortlistedHelpers && shortlistedHelpers.length > 0) {
      notesParts.push(`Shortlisted Helpers: ${shortlistedHelpers.join(', ')}`);
    }
    if (requirements) {
      notesParts.push(`Requirements: ${JSON.stringify(requirements)}`);
    }
    const fullInstructions = notesParts.length > 0 ? notesParts.join(' | ') : null;

    let savedBooking: any = null;

    // 1. Attempt Prisma Save (Supabase / Postgres)
    try {
      if (!customerId) {
        let user = await prisma.user.findUnique({
          where: { phone: cleanPhone },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              phone: cleanPhone,
              name: finalCustomerName,
              role: 'CUSTOMER',
              city: address?.city || 'Bhilai',
              area: address?.area || 'Risali Sector',
              pincode: address?.pincode || '490006',
            },
          });
        }
        customerId = user.id;
      }

      let addressId: string | undefined = undefined;
      if (address && (address.houseNo || address.flatNo || address.area)) {
        const newAddress = await prisma.address.create({
          data: {
            userId: customerId,
            flatNo: address.houseNo || address.flatNo || '101',
            street: address.street || address.area || 'Risali Sector',
            landmark: address.landmark || null,
            area: address.area || 'Risali Sector',
            city: address.city || 'Bhilai',
            pincode: address.pincode || '490006',
            tag: address.tag || 'Home',
          },
        });
        addressId = newAddress.id;
      }

      savedBooking = await prisma.booking.create({
        data: {
          customerId,
          serviceId,
          serviceName,
          type: type === 'MONTHLY' ? 'MONTHLY' : type === 'INSTANT' ? 'INSTANT' : type,
          scheduledDate: new Date(scheduledDate),
          timeSlot: timeSlot || null,
          durationHours: durationHours ? Number(durationHours) : (type === 'INSTANT' ? 2 : null),
          addressId: addressId || undefined,
          baseAmount: Number(baseAmount),
          serviceFee,
          gstAmount,
          totalAmount,
          specialInstructions: fullInstructions,
        },
      });
    } catch (dbError) {
      console.warn('Prisma DB unavailable, using resilient fallback store:', dbError);
    }

    // 2. Resilient Fallback Store if DB unreachable / offline
    if (!savedBooking) {
      const generatedId = `QWK${Math.floor(100000 + Math.random() * 900000)}`;
      const fallbackData: StoredBooking = {
        id: generatedId,
        serviceId,
        serviceName,
        type: type === 'MONTHLY' ? 'MONTHLY' : 'INSTANT',
        status: 'CONFIRMED',
        scheduledDate: new Date(scheduledDate).toISOString(),
        timeSlot: timeSlot || '09:00 AM - 11:00 AM',
        durationHours: durationHours ? Number(durationHours) : 2,
        baseAmount,
        serviceFee,
        gstAmount,
        totalAmount,
        specialInstructions: fullInstructions || undefined,
        createdAt: new Date().toISOString(),
        customer: {
          id: customerId,
          name: finalCustomerName,
          phone: cleanPhone,
        },
        address: address ? {
          flatNo: address.houseNo || address.flatNo || '101',
          street: address.street || address.area || 'Risali Sector',
          landmark: address.landmark || '',
          area: address.area || 'Risali Sector',
          city: address.city || 'Bhilai',
          pincode: address.pincode || '490006',
        } : undefined,
      };

      addFallbackBooking(fallbackData);
      savedBooking = fallbackData;
    }

    // 3. Send WhatsApp + SMS notifications (non-blocking)
    try {
      notifyBookingCreated({
        customerPhone: cleanPhone,
        customerName:  finalCustomerName,
        serviceName,
        bookingId:     savedBooking.id,
        scheduledDate: format(new Date(scheduledDate), 'dd MMM yyyy'),
        timeSlot:      timeSlot || 'TBD',
        totalAmount:   totalAmount,
      }).catch(err => console.error('Notification error (non-fatal):', err));
    } catch (notifErr) {
      console.error('Notification trigger error (non-fatal):', notifErr);
    }

    return NextResponse.json({ success: true, booking: savedBooking }, { status: 201 });

  } catch (error: any) {
    console.error('Fatal booking creation error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to process booking' }, { status: 500 });
  }
}

// PATCH /api/bookings — update booking status & notify customer
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { bookingId, status, cancellationReason } = body;

    if (!bookingId || !status) {
      return NextResponse.json({ error: 'bookingId and status required' }, { status: 400 });
    }

    const allowedStatuses = ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Always update fallback store
    updateFallbackBooking(bookingId, { status });

    let booking: any = null;
    try {
      booking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status,
          ...(cancellationReason ? { cancellationReason } : {}),
        },
        include: {
          customer: { select: { name: true, phone: true } },
          helper:   { include: { user: { select: { name: true } } } },
        },
      });
    } catch (dbErr) {
      console.warn('Prisma booking status update warning:', dbErr);
    }

    // Send notification to customer
    const customerPhone = booking?.customer?.phone || session.user?.phone;
    const customerName = booking?.customer?.name || session.user?.name || 'Customer';

    if (customerPhone) {
      notifyBookingStatusUpdate({
        customerPhone,
        customerName,
        serviceName:   booking?.serviceName || 'Service',
        status,
        bookingId,
        helperName:    booking?.helper?.user?.name,
      }).catch(err => console.error('Status notification error (non-fatal):', err));
    }

    return NextResponse.json({ success: true, booking: booking || { id: bookingId, status } });
  } catch (error) {
    console.error('Booking status update error:', error);
    return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 });
  }
}
