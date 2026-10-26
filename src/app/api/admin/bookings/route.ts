import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { notifyBookingStatusUpdate, notifyHelperAssigned } from "@/lib/notifications";
import { getFallbackBookings, updateFallbackBooking } from "@/lib/booking-store";
import { format } from "date-fns";

export const dynamic = 'force-dynamic';

// GET /api/admin/bookings — list all customer bookings for admin
export async function GET(req: NextRequest) {
  if (!(await isAdminAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
  } catch (error) {
    console.warn("Prisma admin bookings fetch warning:", error);
  }

  const fallbackList = getFallbackBookings();
  const combined = [...fallbackList, ...dbBookings];
  const uniqueBookings = Array.from(new Map(combined.map(b => [b.id, b])).values());

  return NextResponse.json({ bookings: uniqueBookings });
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

    // Always update fallback store
    updateFallbackBooking(bookingId, { 
      status: status || undefined,
      ...(helperId ? { helper: { id: helperId, user: { name: "Assigned Helper", phone: "9876543210" } } } : {})
    });

    const updateData: Record<string, any> = {};
    if (status) updateData.status = status;
    if (helperId !== undefined) updateData.helperId = helperId || null;

    let updatedBooking: any = null;
    try {
      updatedBooking = await prisma.booking.update({
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
    } catch (dbErr) {
      console.warn("Prisma update warning in admin bookings:", dbErr);
    }

    // ── Notifications (non-blocking) ──────────────────────────────
    try {
      const customer = updatedBooking?.customer;
      // 1. Customer — status change notification
      if (status && customer) {
        notifyBookingStatusUpdate({
          customerPhone: customer.phone,
          customerName:  customer.name,
          serviceName:   updatedBooking?.serviceName || 'Service',
          status,
          bookingId:     bookingId,
          helperName:    updatedBooking?.helper?.user?.name,
        }).catch(e => console.error('Status notif error:', e));
      }

      // 2. Helper — newly assigned to booking
      if (helperId && updatedBooking?.helper?.user) {
        const addr = updatedBooking.address;
        const addressStr = addr
          ? `${addr.flatNo}, ${addr.area}, ${addr.city} - ${addr.pincode}`
          : 'Address not available';

        notifyHelperAssigned({
          helperPhone:   updatedBooking.helper.user.phone,
          helperName:    updatedBooking.helper.user.name,
          customerName:  customer?.name || 'Customer',
          serviceName:   updatedBooking.serviceName,
          scheduledDate: format(new Date(updatedBooking.scheduledDate), 'dd MMM yyyy'),
          timeSlot:      updatedBooking.timeSlot || 'TBD',
          address:       addressStr,
          bookingId:     bookingId,
        }).catch(e => console.error('Helper assign notif error:', e));
      }
    } catch (notifErr) {
      console.error('Notification block error (non-fatal):', notifErr);
    }

    return NextResponse.json({ success: true, booking: updatedBooking || { id: bookingId, status, helperId } });
  } catch (error) {
    console.error("Admin booking update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
