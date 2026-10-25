import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { notifyBookingStatusUpdate, notifyHelperAssigned } from "@/lib/notifications";
import { format } from "date-fns";

// GET /api/admin/bookings — list all customer bookings for admin
export async function GET(req: NextRequest) {
  if (!(await isAdminAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bookings = await prisma.booking.findMany({
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

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Admin bookings fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

// PATCH /api/admin/bookings — update booking status or assign helper
export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { bookingId, status, helperId } = body;

    if (!bookingId) {
      return NextResponse.json({ error: "bookingId required" }, { status: 400 });
    }

    const updateData: Record<string, any> = {};
    if (status) updateData.status = status;
    if (helperId !== undefined) updateData.helperId = helperId || null;

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      include: {
        customer: { select: { name: true, phone: true } },
        address: true,
        helper: {
          include: {
            user: { select: { name: true, phone: true } },
          },
        },
      },
    });
    // ── Notifications (non-blocking) ──────────────────────────────
    try {
      // 1. Customer — status change notification
      if (status && updatedBooking.customer) {
        notifyBookingStatusUpdate({
          customerPhone: updatedBooking.customer.phone,
          customerName:  updatedBooking.customer.name,
          serviceName:   updatedBooking.serviceName,
          status,
          bookingId:     updatedBooking.id,
          helperName:    updatedBooking.helper?.user?.name,
        }).catch(e => console.error('Status notif error:', e));
      }

      // 2. Helper — newly assigned to booking
      if (helperId && updatedBooking.helper?.user) {
        const addr = updatedBooking.address;
        const addressStr = addr
          ? `${addr.flatNo}, ${addr.area}, ${addr.city} - ${addr.pincode}`
          : 'Address not available';

        notifyHelperAssigned({
          helperPhone:   updatedBooking.helper.user.phone,
          helperName:    updatedBooking.helper.user.name,
          customerName:  updatedBooking.customer?.name || 'Customer',
          serviceName:   updatedBooking.serviceName,
          scheduledDate: format(new Date(updatedBooking.scheduledDate), 'dd MMM yyyy'),
          timeSlot:      updatedBooking.timeSlot || 'TBD',
          address:       addressStr,
          bookingId:     updatedBooking.id,
        }).catch(e => console.error('Helper assign notif error:', e));
      }
    } catch (notifErr) {
      console.error('Notification block error (non-fatal):', notifErr);
    }

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error("Admin booking update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
