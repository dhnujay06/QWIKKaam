import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/register — register a new customer or helper
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, role, gender, age, experience, hourlyRate, monthlySalary, serviceIds, languages } = body;

    if (!name || !phone || !role) {
      return NextResponse.json({ error: 'Name, phone, and role are required' }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      return NextResponse.json({ error: 'Phone number already registered' }, { status: 409 });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        phone,
        role: role.toUpperCase(),
        city: 'Bhilai',
        area: 'Risali Sector',
        pincode: '490006',
      },
    });

    // If helper, create helper profile too
    if (role.toUpperCase() === 'HELPER') {
      await prisma.helperProfile.create({
        data: {
          userId: user.id,
          gender: gender?.toUpperCase() ?? 'OTHER',
          age: parseInt(age) || 25,
          experience: parseInt(experience) || 0,
          hourlyRate: parseInt(hourlyRate) || 149,
          monthlySalary: parseInt(monthlySalary) || 8000,
          serviceIds: serviceIds ?? [],
          languages: languages ?? ['Hindi'],
          workingAreas: ['Risali Sector'],
        },
      });
    }

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
