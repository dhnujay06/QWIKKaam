import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — all helpers with their profiles
export async function GET() {
  try {
    const helpers = await prisma.user.findMany({
      where: { role: "HELPER" },
      include: {
        helperProfile: {
          select: {
            hourlyRate: true,
            monthlySalary: true,
            isAvailable: true,
            rating: true,
            totalBookings: true,
            serviceIds: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ helpers });
  } catch (error) {
    console.error("Admin helpers fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch helpers" }, { status: 500 });
  }
}

// PATCH — toggle helper availability
export async function PATCH(req: NextRequest) {
  try {
    const { userId, isAvailable } = await req.json();
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    await prisma.helperProfile.update({
      where: { userId },
      data: { isAvailable },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Toggle availability error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
