import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { notifyBookingStatusUpdate, notifyHelperAssigned } from "@/lib/notifications";
import { getFallbackBookings, updateFallbackBooking } from "@/lib/booking-store";
import { helpers as seedHelpers } from "@/data/helpers";
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

    // Resolve helper name and phone if helper assigned
    let helperName = "Assigned Helper";
    let helperPhone = "9876543210";
    if (helperId) {
      const foundSeed = seedHelpers.find(h => h.id === helperId);
      if (foundSeed) {
        helperName = foundSeed.name;
        const idx = seedHelpers.findIndex(h => h.id === foundSeed.id);
        helperPhone = `987654321${idx + 1}`;
      }
    }

    // Always update fallback store
    updateFallbackBooking(bookingId, { 
      status: status || undefined,
      ...(helperId !== undefined ? { 
        helper: helperId ? { id: helperId, user: { name: helperName, phone: helperPhone } } : null 
      } : {})
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

    // Active booking data (from DB or fallback store)
    const activeBooking = updatedBooking || getFallbackBookings().find(b => b.id === bookingId);

    // ── Notifications (non-blocking) ──────────────────────────────
    try {
      const customer = activeBooking?.customer;
      const assignedHelper = activeBooking?.helper;

      // 1. Customer — status change notification
      if (status && customer?.phone) {
        notifyBookingStatusUpdate({
          customerPhone: customer.phone,
          customerName:  customer.name || 'Customer',
          serviceName:   activeBooking?.serviceName || 'Service',
          status,
          bookingId:     bookingId,
          helperName:    assignedHelper?.user?.name || helperName,
        }).catch(e => console.error('Status notif error:', e));
      }

      // 2. Helper — newly assigned to booking
      if (helperId && (assignedHelper?.user?.phone || helperPhone)) {
        const addr = activeBooking?.address;
        const addressStr = addr
          ? `${addr.flatNo || ''}, ${addr.street || addr.area || ''}, ${addr.city || 'Bhilai'}`
          : 'Bhilai, Chhattisgarh';

        notifyHelperAssigned({
          helperPhone:   assignedHelper?.user?.phone || helperPhone,
          helperName:    assignedHelper?.user?.name || helperName,
          customerName:  customer?.name || 'Customer',
          serviceName:   activeBooking?.serviceName || 'Service',
          scheduledDate: activeBooking?.scheduledDate 
            ? format(new Date(activeBooking.scheduledDate), 'dd MMM yyyy') 
            : 'Today',
          timeSlot:      activeBooking?.timeSlot || '09:00 AM - 11:00 AM',
          address:       addressStr,
          bookingId:     bookingId,
        }).catch(e => console.error('Helper assign notif error:', e));
      }
    } catch (notifErr) {
      console.error('Notification block error (non-fatal):', notifErr);
    }

    return NextResponse.json({ 
      success: true, 
      booking: activeBooking || { id: bookingId, status, helperId } 
    });
  } catch (error) {
    console.error("Admin booking update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
