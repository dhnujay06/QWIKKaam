import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/bookings — get all bookings for the logged-in user
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const bookings = await prisma.booking.findMany({
    where: { customerId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ bookings });
}

// POST /api/bookings — create a new booking
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const {
      serviceId, serviceName, type, scheduledDate, timeSlot,
      durationHours, addressId, baseAmount, specialInstructions
    } = body;

    // Validate required fields
    if (!serviceId || !serviceName || !type || !scheduledDate || !baseAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const serviceFee = 49;
    const gstAmount = Math.round((baseAmount + serviceFee) * 0.18);
    const totalAmount = baseAmount + serviceFee + gstAmount;

    const booking = await prisma.booking.create({
      data: {
        customerId: session.user.id,
        serviceId,
        serviceName,
        type,
        scheduledDate: new Date(scheduledDate),
        timeSlot,
        durationHours,
        addressId,
        baseAmount,
        serviceFee,
        gstAmount,
        totalAmount,
        specialInstructions,
      },
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });

  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
