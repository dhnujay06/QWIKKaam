import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { helpers as staticHelpers } from '@/data/helpers';
import { Helper } from '@/types';

function formatHelperProfile(profile: any): Helper {
  const user = profile.user || {};
  return {
    id: profile.id,
    name: user.name || 'Helper',
    nameHi: profile.bioHi || user.name || 'सहायक',
    age: profile.age || 28,
    gender: profile.gender === 'MALE' ? 'male' : 'female',
    photo: user.avatar || '',
    bio: profile.bio || 'Verified service professional in Bhilai',
    bioHi: profile.bioHi || 'भिलाई में सत्यापित सेवा पेशेवर',
    experience: profile.experience || 1,
    languages: profile.languages?.length ? profile.languages : ['Hindi'],
    skills: profile.serviceIds?.length ? profile.serviceIds : ['Cleaning'],
    rating: profile.rating || 4.8,
    reviewCount: profile.totalReviews || 0,
    hourlyRate: profile.hourlyRate || 149,
    monthlySalary: profile.monthlySalary || 8000,
    workPreference: ['hourly', 'part-time'],
    availability: profile.isAvailable ? 'available' : 'busy',
    verified: profile.adminVerified,
    policeVerified: profile.policeVerified,
    aadhaarVerified: profile.aadhaarVerified === 'VERIFIED',
    vaccinated: profile.vaccinated,
    city: user.city || 'Bhilai',
    area: user.area || (profile.workingAreas?.[0] || 'Risali Sector'),
    serviceIds: profile.serviceIds || [],
  };
}

// GET /api/helpers — list helpers from PostgreSQL + static catalog
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get('service');
    const helperId = searchParams.get('id');

    // If specific helper ID requested
    if (helperId) {
      // Check static first
      const staticMatch = staticHelpers.find(h => h.id === helperId);
      if (staticMatch) {
        return NextResponse.json({ helper: staticMatch });
      }

      // Check DB
      const dbHelper = await prisma.helperProfile.findFirst({
        where: {
          OR: [
            { id: helperId },
            { userId: helperId },
          ],
        },
        include: { user: true },
      });

      if (dbHelper) {
        return NextResponse.json({ helper: formatHelperProfile(dbHelper) });
      }

      return NextResponse.json({ error: 'Helper not found' }, { status: 404 });
    }

    // Otherwise list all available helpers from DB
    let dbHelpers: any[] = [];
    try {
      dbHelpers = await prisma.helperProfile.findMany({
        where: {
          isAvailable: true,
          ...(serviceId ? { serviceIds: { has: serviceId } } : {}),
        },
        include: {
          user: true,
        },
        orderBy: { rating: 'desc' },
      });
    } catch (dbErr) {
      console.warn('DB helpers query fallback:', dbErr);
    }

    const formattedDbHelpers = dbHelpers.map(formatHelperProfile);

    // Merge DB helpers with static helpers (avoiding duplicates)
    const existingIds = new Set(formattedDbHelpers.map(h => h.id));
    const nonDuplicateStatic = staticHelpers.filter(h => !existingIds.has(h.id));

    let allHelpers = [...formattedDbHelpers, ...nonDuplicateStatic];

    if (serviceId) {
      allHelpers = allHelpers.filter(h => h.serviceIds.includes(serviceId) || h.skills.some(s => s.toLowerCase().includes(serviceId.toLowerCase())));
    }

    return NextResponse.json({ helpers: allHelpers });
  } catch (error) {
    console.error('Error fetching helpers:', error);
    return NextResponse.json({ helpers: staticHelpers });
  }
}
