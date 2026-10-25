import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notifyBookingCreated, notifyBookingStatusUpdate } from '@/lib/notifications';
import { format } from 'date-fns';

// GET /api/bookings — get all bookings for the logged-in user
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const bookings = await prisma.booking.findMany({
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

  return NextResponse.json({ bookings });
}

// POST /api/bookings — create a new booking (Supports both Logged-in & Guest Flow)
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

    let customerId = session?.user?.id;

    // If user is not logged in, require a phone number for guest booking
    if (!customerId) {
      if (!phone || phone.replace(/\D/g, '').length < 10) {
        return NextResponse.json({ error: 'Phone number is required for booking' }, { status: 400 });
      }

      const cleanPhone = phone.replace(/\D/g, '').slice(-10);

      // Find or create customer account for this phone
      let user = await prisma.user.findUnique({
        where: { phone: cleanPhone },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            phone: cleanPhone,
            name: customerName || 'Guest Customer',
            role: 'CUSTOMER',
            city: address?.city || 'Bhilai',
            area: address?.area || 'Risali Sector',
            pincode: address?.pincode || '490006',
          },
        });
      }
      customerId = user.id;
    }

    // Save Address if address details are passed
    let addressId: string | undefined = undefined;
    if (address && (address.houseNo || address.flatNo)) {
      const newAddress = await prisma.address.create({
        data: {
          userId: customerId,
          flatNo: address.houseNo || address.flatNo || 'N/A',
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

    const booking = await prisma.booking.create({
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

    // ── Send WhatsApp + SMS notifications (non-blocking) ──
    try {
      const customer = await prisma.user.findUnique({
        where: { id: customerId },
        select: { name: true, phone: true },
      });

      if (customer) {
        notifyBookingCreated({
          customerPhone: customer.phone,
          customerName:  customer.name,
          serviceName,
          bookingId:     booking.id,
          scheduledDate: format(new Date(scheduledDate), 'dd MMM yyyy'),
          timeSlot:      timeSlot || 'TBD',
          totalAmount:   totalAmount,
        }).catch(err => console.error('Notification error (non-fatal):', err));
      }
    } catch (notifErr) {
      console.error('Notification fetch error (non-fatal):', notifErr);
    }

    return NextResponse.json({ success: true, booking }, { status: 201 });

  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json({ error: 'Failed to create booking in database' }, { status: 500 });
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

    const booking = await prisma.booking.update({
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

    // Send notification to customer
    if (booking.customer) {
      notifyBookingStatusUpdate({
        customerPhone: booking.customer.phone,
        customerName:  booking.customer.name,
        serviceName:   booking.serviceName,
        status,
        bookingId:     booking.id,
        helperName:    booking.helper?.user?.name,
      }).catch(err => console.error('Status notification error (non-fatal):', err));
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('Booking status update error:', error);
    return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 });
  }
}
