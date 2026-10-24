import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

// POST — Admin registers a helper on their behalf (no OTP needed)
export async function POST(req: NextRequest) {
  if (!(await isAdminAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name, phone, gender, age, experience,
      hourlyRate, monthlySalary, serviceIds,
      languages, notes, city, area,
    } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    // Check if phone already registered
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      return NextResponse.json(
        { error: "Is phone number se pehle se register hai. Doosra number use karein." },
        { status: 409 }
      );
    }

    // Create user + helper profile in one transaction
    const user = await prisma.user.create({
      data: {
        name,
        phone,
        role: "HELPER",
        city: city || "Bhilai",
        area: area || "Risali Sector",
        pincode: "490006",
        helperProfile: {
          create: {
            gender: gender || "FEMALE",
            age: parseInt(age) || 25,
            experience: parseInt(experience) || 0,
            hourlyRate: parseInt(hourlyRate) || 149,
            monthlySalary: parseInt(monthlySalary) || 8000,
            serviceIds: serviceIds || [],
            languages: languages || ["Hindi"],
            workingAreas: ["Risali Sector"],
            isAvailable: true,
            bio: notes || "",
          },
        },
      },
      include: { helperProfile: true },
    });

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 });
  } catch (error) {
    console.error("Admin add helper error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
