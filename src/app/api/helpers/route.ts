import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/helpers — list available helpers in Bhilai Risali
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get('service');

  const helpers = await prisma.helperProfile.findMany({
    where: {
      isAvailable: true,
      workingAreas: { has: 'Risali Sector' },
      ...(serviceId ? { serviceIds: { has: serviceId } } : {}),
    },
    include: {
      user: {
        select: { name: true, avatar: true, phone: false },
      },
    },
    orderBy: { rating: 'desc' },
  });

  return NextResponse.json({ helpers });
}
