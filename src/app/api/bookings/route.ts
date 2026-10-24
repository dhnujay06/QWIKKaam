import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendBookingNotifications } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

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
    const finalPhone = phone || (session?.user as any)?.phone;

    // If user is not logged in, require a phone number for guest booking
    if (!customerId) {
      if (!finalPhone || finalPhone.replace(/\D/g, '').length < 10) {
        return NextResponse.json({ error: 'Phone number is required for booking' }, { status: 400 });
      }

      const cleanPhone = finalPhone.replace(/\D/g, '').slice(-10);

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

    // Send Real-Time WhatsApp & SMS Notifications
    let notificationInfo = null;
    try {
      const addressString = address 
        ? `${address.houseNo || address.flatNo || ''}, ${address.street || address.area || ''}, ${address.city || 'Bhilai'}`
        : 'Risali Sector, Bhilai';

      notificationInfo = await sendBookingNotifications({
        bookingId: booking.id,
        customerName: customerName || 'Valued Customer',
        customerPhone: finalPhone || '9876543210',
        serviceName,
        scheduledDate: new Date(scheduledDate).toLocaleDateString('en-IN', { dateStyle: 'medium' }),
        timeSlot: timeSlot || undefined,
        totalAmount,
        addressText: addressString,
      });
    } catch (notifError) {
      console.error('Notification dispatch error (non-fatal):', notifError);
    }

    return NextResponse.json({ 
      success: true, 
      booking,
      notification: notificationInfo 
    }, { status: 201 });

  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json({ error: 'Failed to create booking in database' }, { status: 500 });
  }
}
