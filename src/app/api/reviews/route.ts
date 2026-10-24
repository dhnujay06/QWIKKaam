import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET — fetch all reviews for a helper
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const helperId = searchParams.get("helperId");

  if (!helperId) {
    return NextResponse.json({ error: "helperId required" }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { helperId },
      include: {
        customer: {
          select: { name: true, avatar: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST — submit a new review
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { helperId, bookingId, rating, comment } = body;

    // Validate inputs
    if (!helperId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Valid helperId and rating (1-5) required" }, { status: 400 });
    }

    // If logged in, use session userId; else use guest review (no bookingId required)
    const customerId = session?.user?.id;

    if (!customerId) {
      return NextResponse.json({ error: "Login karein review dene ke liye" }, { status: 401 });
    }

    // If bookingId provided, check it belongs to this customer + helper
    if (bookingId) {
      const booking = await prisma.booking.findFirst({
        where: { id: bookingId, customerId },
      });
      if (!booking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      }
      // Check if review already exists for this booking
      const existing = await prisma.review.findUnique({ where: { bookingId } });
      if (existing) {
        return NextResponse.json({ error: "Aap is booking ke liye pehle se review de chuke hain" }, { status: 409 });
      }
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        helperId,
        customerId,
        bookingId: bookingId || null,
        rating: Number(rating),
        comment: comment || null,
      },
    });

    // Recalculate helper's average rating
    const allReviews = await prisma.review.findMany({ where: { helperId } });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.helperProfile.update({
      where: { id: helperId },
      data: {
        rating: Math.round(avgRating * 10) / 10, // round to 1 decimal
        totalBookings: { increment: bookingId ? 1 : 0 },
      },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error("Review submit error:", error);
    return NextResponse.json({ error: "Review submit failed" }, { status: 500 });
  }
}
