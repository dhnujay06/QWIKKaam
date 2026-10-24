import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFallbackBookings, updateFallbackBooking } from "@/lib/booking-store";

export const dynamic = 'force-dynamic';

// GET /api/admin/bookings — list all customer bookings for admin
export async function GET(req: NextRequest) {
  try {
    let dbBookings: any[] = [];
    try {
      dbBookings = await prisma.booking.findMany({
        include: {
          customer: {
            select: { id: true, name: true, phone: true, email: true },
          },
          address: true,
          helper: {
            include: {
              user: { select: { id: true, name: true, phone: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      console.warn("Prisma findMany failed, using fallback list:", e);
    }

    const fallbackList = getFallbackBookings();
    
    // Combine and deduplicate by ID
    const combined = [...fallbackList, ...dbBookings];
    const uniqueBookings = Array.from(new Map(combined.map(b => [b.id, b])).values());

    return NextResponse.json({ bookings: uniqueBookings });
  } catch (error) {
    console.error("Admin bookings fetch error:", error);
    return NextResponse.json({ bookings: getFallbackBookings() });
  }
}

// PATCH /api/admin/bookings — update booking status or assign helper
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, status, helperId } = body;

    if (!bookingId) {
      return NextResponse.json({ error: "bookingId required" }, { status: 400 });
    }

    // Update in fallback store
    updateFallbackBooking(bookingId, { 
      status: status || undefined,
      helper: helperId ? { id: helperId, user: { name: "Assigned Helper", phone: "9876543210" } } : null
    });

    // Also update in Prisma if DB available
    try {
      const updateData: Record<string, any> = {};
      if (status) updateData.status = status;
      if (helperId !== undefined) updateData.helperId = helperId || null;

      await prisma.booking.update({
        where: { id: bookingId },
        data: updateData,
      });
    } catch {
      // Ignore if DB record not present
    }

    return NextResponse.json({ success: true, bookingId, status });
  } catch (error) {
    console.error("Admin booking update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
