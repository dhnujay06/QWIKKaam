import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { notifyHelperVerification } from "@/lib/notifications";

// PATCH — update verification status of a helper
export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { userId, level, value, extra } = body;
    // level: "admin" | "aadhaar" | "police" | "vaccinated"
    // value: boolean or string
    // extra: { aadhaarNumber?, policeStation?, policeCertDate? }

    if (!userId || !level) {
      return NextResponse.json({ error: "userId and level required" }, { status: 400 });
    }

    let updateData: Record<string, unknown> = {};

    if (level === "admin") {
      updateData = {
        adminVerified: value,
        adminVerifiedAt: value ? new Date() : null,
      };
    } else if (level === "aadhaar") {
      updateData = {
        aadhaarVerified: value ? "VERIFIED" : "PENDING",
        aadhaarVerifiedAt: value ? new Date() : null,
        ...(extra?.aadhaarNumber && { aadhaarNumber: extra.aadhaarNumber }),
      };
    } else if (level === "police") {
      updateData = {
        policeVerified: value,
        policeVerifiedAt: value ? new Date() : null,
        ...(extra?.policeStation && { policeStation: extra.policeStation }),
        ...(extra?.policeCertDate && { policeCertDate: new Date(extra.policeCertDate) }),
      };
    } else if (level === "vaccinated") {
      updateData = { vaccinated: value };
    }

    await prisma.helperProfile.update({
      where: { userId },
      data: updateData,
    });

    // Notify helper via WhatsApp + SMS (non-blocking)
    try {
      const helperUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, phone: true },
      });

      if (helperUser) {
        const approved =
          level === 'aadhaar' ? value === true || value === 'VERIFIED'
          : level === 'admin' || level === 'police' || level === 'vaccinated' ? value === true
          : false;

        notifyHelperVerification({
          helperPhone: helperUser.phone,
          helperName:  helperUser.name,
          level:       level as 'admin' | 'aadhaar' | 'police' | 'vaccinated',
          approved,
        }).catch(err => console.error('Verification notification error (non-fatal):', err));
      }
    } catch (notifErr) {
      console.error('Notification fetch error (non-fatal):', notifErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verification update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// GET — get verification details of a helper
export async function GET(req: NextRequest) {
  if (!(await isAdminAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  try {
    const profile = await prisma.helperProfile.findUnique({
      where: { userId },
      select: {
        adminVerified: true,
        adminVerifiedAt: true,
        aadhaarNumber: true,
        aadhaarVerified: true,
        aadhaarVerifiedAt: true,
        policeVerified: true,
        policeStation: true,
        policeCertDate: true,
        policeVerifiedAt: true,
        vaccinated: true,
      },
    });
    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
