import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendBookingNotifications } from '@/lib/notifications';
import { addFallbackBooking, StoredBooking } from '@/lib/booking-store';

export const dynamic = 'force-dynamic';

// GET /api/bookings — get all bookings for the user
export async function GET(req: NextRequest) {
  try {
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
  } catch (error) {
    console.warn('GET /api/bookings DB error, returning empty list');
    return NextResponse.json({ bookings: [] });
  }
}

// POST /api/bookings — create a new booking
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

    const finalPhone = (phone || (session?.user as any)?.phone || '9876543210').replace(/\D/g, '').slice(-10);
    const finalCustomerName = customerName || (session?.user as any)?.name || 'Valued Customer';

    const base = Number(baseAmount);
    const serviceFee = Math.round(base * 0.05); // 5% Platform Fee
    const gstAmount = 0; // GST disabled
    const totalAmount = base + serviceFee;

    const platformCommission = Math.round(base * 0.10);
    const helperPayout = base - platformCommission;

    const notesParts: string[] = [];
    if (specialInstructions) notesParts.push(`Instructions: ${specialInstructions}`);
    notesParts.push(`Commission: ₹${platformCommission} (10%) | Platform Fee: ₹${serviceFee} (5%) | Helper Payout: ₹${helperPayout}`);
    if (shortlistedHelpers && shortlistedHelpers.length > 0) {
      notesParts.push(`Shortlisted Helpers: ${shortlistedHelpers.join(', ')}`);
    }
    if (requirements) {
      notesParts.push(`Requirements: ${JSON.stringify(requirements)}`);
    }
    const fullInstructions = notesParts.length > 0 ? notesParts.join(' | ') : undefined;

    let savedBooking: any = null;

    // 1. Attempt Prisma PostgreSQL Save
    try {
      let customerId = session?.user?.id;
      if (!customerId) {
        let user = await prisma.user.findUnique({ where: { phone: finalPhone } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              phone: finalPhone,
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
          specialInstructions: fullInstructions || null,
        },
      });
    } catch (dbError) {
      console.warn('Prisma DB connection unavailable, using fallback store:', dbError);
    }

    // 2. If DB was down or unreachable, use resilient in-memory store
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
        specialInstructions: fullInstructions,
        createdAt: new Date().toISOString(),
        customer: {
          name: finalCustomerName,
          phone: finalPhone,
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

    // 3. Trigger WhatsApp & SMS Notification
    let notificationInfo = null;
    try {
      const addressString = address 
        ? `${address.houseNo || address.flatNo || ''}, ${address.street || address.area || ''}, ${address.city || 'Bhilai'}`
        : 'Risali Sector, Bhilai';

      notificationInfo = await sendBookingNotifications({
        bookingId: savedBooking.id,
        customerName: finalCustomerName,
        customerPhone: finalPhone,
        serviceName,
        scheduledDate: new Date(scheduledDate).toLocaleDateString('en-IN', { dateStyle: 'medium' }),
        timeSlot: timeSlot || undefined,
        totalAmount,
        addressText: addressString,
      });
    } catch (notifError) {
      console.warn('Notification non-fatal error:', notifError);
    }

    return NextResponse.json({ 
      success: true, 
      booking: savedBooking,
      notification: notificationInfo 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Fatal booking handler error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to process booking' }, { status: 500 });
  }
}
