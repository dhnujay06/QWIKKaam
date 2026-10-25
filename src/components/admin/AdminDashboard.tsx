"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { 
  Users, UserPlus, Phone, Star, Zap, LogOut, CheckCircle, 
  ShieldCheck, Package, Clock, MapPin, Calendar, AlertCircle, 
  UserCheck, DollarSign, RefreshCw 
} from "lucide-react";

interface Helper {
  id: string;
  name: string;
  phone: string;
  role: string;
  city: string;
  area: string;
  helperProfile?: {
    id: string;
    hourlyRate: number;
    monthlySalary: number;
    isAvailable: boolean;
    rating: number;
    totalBookings: number;
    serviceIds: string[];
  };
}

interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  type: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  scheduledDate: string;
  timeSlot: string | null;
  durationHours: number | null;
  baseAmount: number;
  serviceFee: number;
  totalAmount: number;
  specialInstructions: string | null;
  createdAt: string;
  customer?: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
  };
  address?: {
    id: string;
    flatNo: string;
    street: string;
    landmark: string | null;
    area: string;
    city: string;
    pincode: string;
    tag: string;
  } | null;
  helper?: {
    id: string;
    user?: {
      name: string;
      phone: string;
    };
  } | null;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'helpers'>('bookings');
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingFilter, setBookingFilter] = useState<string>('ALL');
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([fetchHelpers(), fetchBookings()]);
    setLoading(false);
  };

  const fetchHelpers = async () => {
    try {
      const res = await fetch("/api/admin/helpers");
      const data = await res.json();
      setHelpers(data.helpers || []);
    } catch {
      console.error("Failed to fetch helpers");
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {
      console.error("Failed to fetch bookings");
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin" });
  };

  const toggleAvailability = async (userId: string, current: boolean) => {
    try {
      await fetch("/api/admin/helpers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isAvailable: !current }),
      });
      fetchHelpers();
    } catch {
      console.error("Failed to update availability");
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    setUpdatingBookingId(bookingId);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status }),
      });
      if (res.ok) {
        await fetchBookings();
      }
    } catch {
      console.error("Failed to update booking status");
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const assignHelper = async (bookingId: string, helperId: string) => {
    setUpdatingBookingId(bookingId);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, helperId: helperId || null }),
      });
      if (res.ok) {
        await fetchBookings();
      }
    } catch {
      console.error("Failed to assign helper");
    } finally {
      setUpdatingBookingId(null);
    }
  };

  // Calculations
  const totalBookingsCount = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
  const confirmedCount = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS').length;
  const totalRevenue = bookings
    .filter(b => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const estimatedEarnings = Math.round(totalRevenue * 0.15); // 10% commission + 5% platform fee

  const filteredBookings = bookingFilter === 'ALL'
    ? bookings
    : bookings.filter(b => b.status === bookingFilter);

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'PENDING':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200">⏳ Pending</span>;
      case 'CONFIRMED':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200">✓ Confirmed</span>;
      case 'IN_PROGRESS':
        return <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-full border border-purple-200">🚀 In Progress</span>;
      case 'COMPLETED':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">★ Completed</span>;
      case 'CANCELLED':
        return <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-full border border-rose-200">✕ Cancelled</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      {/* Top Navbar */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2 font-bold text-teal-400 text-xl">
          <Zap className="w-6 h-6 fill-teal-400" />
          <span>Qwikkaam Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={loadAllData}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* KPI Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-teal-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-teal-700" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{totalBookingsCount}</div>
                <div className="text-xs text-slate-500 font-medium">Total Bookings</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{pendingCount}</div>
                <div className="text-xs text-slate-500 font-medium">Pending Action</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">₹{estimatedEarnings}</div>
                <div className="text-xs text-slate-500 font-medium">Platform Earnings (15%)</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-700" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{helpers.length}</div>
                <div className="text-xs text-slate-500 font-medium">Active Helpers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Main Navigation Tabs */}
          <div className="flex bg-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'bookings'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Customer Bookings</span>
              {pendingCount > 0 && (
                <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('helpers')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'helpers'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Registered Helpers ({helpers.length})</span>
            </button>
          </div>

          {/* Quick Helper Registration & Verification Links */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/add-helper"
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Helper</span>
            </Link>
            <Link
              href="/admin/verify"
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Helpers</span>
            </Link>
          </div>
        </div>

        {/* TAB 1: CUSTOMER BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 items-center">
              {['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setBookingFilter(st)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                    bookingFilter === st
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {st === 'ALL' ? 'All Bookings' : st}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200">
                Loading live bookings...
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <div className="text-4xl mb-3">📦</div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">No bookings found</h3>
                <p className="text-slate-500 text-sm">
                  {bookingFilter === 'ALL' 
                    ? 'Jab koi customer website se book karega, wo yahan live aayega.' 
                    : `No bookings matching status ${bookingFilter}.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((b) => (
                  <div 
                    key={b.id} 
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-colors"
                  >
                    {/* Top Row: Service, Status, Date */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center font-bold text-teal-700 text-sm">
                          {b.type === 'INSTANT' ? '⚡' : '📅'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-base">{b.serviceName}</h3>
                            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                              {b.type}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            ID: <span className="font-mono text-slate-600">{b.id}</span> • Booked: {new Date(b.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {getStatusBadge(b.status)}
                        <span className="text-lg font-bold text-slate-900">
                          ₹{b.totalAmount}
                        </span>
                      </div>
                    </div>

                    {/* Middle Grid: Customer, Address, Schedule, Payout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      {/* Customer Details */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Customer</div>
                        <div className="font-bold text-slate-900">{b.customer?.name || 'Customer'}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <a 
                            href={`tel:+91${b.customer?.phone}`}
                            className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call +91 {b.customer?.phone}</span>
                          </a>
                        </div>
                      </div>

                      {/* Schedule & Address */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Schedule & Location</div>
                        <div className="flex items-center gap-1.5 font-medium text-slate-800 mb-1">
                          <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                          <span>{new Date(b.scheduledDate).toLocaleDateString()}</span>
                          {b.timeSlot && <span className="text-slate-500">({b.timeSlot})</span>}
                        </div>
                        <div className="flex items-start gap-1.5 text-xs text-slate-600 mt-1">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <span>
                            {b.address 
                              ? `${b.address.flatNo}, ${b.address.street}, ${b.address.area}, ${b.address.city} - ${b.address.pincode}`
                              : 'Risali Sector, Bhilai (Default)'}
                          </span>
                        </div>
                      </div>

                      {/* Pricing Breakdown & Earnings */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Financial Breakdown</div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between text-slate-600">
                            <span>Service Charge:</span>
                            <span className="font-semibold text-slate-800">₹{b.baseAmount}</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Platform Fee (5%):</span>
                            <span className="font-semibold text-slate-800">₹{b.serviceFee}</span>
                          </div>
                          <div className="flex justify-between text-teal-700 font-bold border-t border-slate-200 pt-1 mt-1">
                            <span>Your Profit (15%):</span>
                            <span>₹{Math.round(b.baseAmount * 0.10 + b.serviceFee)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Special Instructions or Notes */}
                    {b.specialInstructions && (
                      <div className="text-xs bg-amber-50/70 border border-amber-200/60 p-2.5 rounded-xl text-amber-900 mb-4">
                        <span className="font-bold">Notes:</span> {b.specialInstructions}
                      </div>
                    )}

                    {/* Action Bar: Assign Helper & Status Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      {/* Helper Assignment */}
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-xs text-slate-500 font-medium">Assign Helper:</span>
                        <select
                          value={b.helper?.id || ""}
                          onChange={(e) => assignHelper(b.id, e.target.value)}
                          disabled={updatingBookingId === b.id}
                          className="bg-white border border-slate-200 rounded-lg text-xs font-semibold px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="">-- No Helper Assigned --</option>
                          {helpers.map((h) => (
                            <option key={h.id} value={h.helperProfile?.id || h.id}>
                              {h.name} ({h.phone}) {h.helperProfile?.isAvailable ? "• Available" : "• Busy"}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Status Update Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        {b.status === 'PENDING' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'CONFIRMED')}
                            disabled={updatingBookingId === b.id}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                          >
                            Accept & Confirm
                          </button>
                        )}
                        {b.status === 'CONFIRMED' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'IN_PROGRESS')}
                            disabled={updatingBookingId === b.id}
                            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                          >
                            Mark In Progress
                          </button>
                        )}
                        {(b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS') && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'COMPLETED')}
                            disabled={updatingBookingId === b.id}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                          >
                            Mark Completed ✓
                          </button>
                        )}
                        {b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'CANCELLED')}
                            disabled={updatingBookingId === b.id}
                            className="bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REGISTERED HELPERS */}
        {activeTab === 'helpers' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-lg">Registered Helpers ({helpers.length})</h2>
              <button
                onClick={fetchHelpers}
                className="text-teal-600 hover:text-teal-700 text-sm font-medium"
              >
                Refresh ↻
              </button>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400">Loading helpers...</div>
            ) : helpers.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-4xl mb-3">👷</div>
                <p className="text-slate-500">Abhi koi helper registered nahi hai.</p>
                <Link
                  href="/admin/add-helper"
                  className="inline-block mt-4 bg-teal-600 text-white font-semibold px-6 py-2 rounded-xl text-sm"
                >
                  Pehla Helper Add Karo →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {helpers.map((helper) => (
                  <div key={helper.id} className="p-4 flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {helper.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900">{helper.name}</div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          {helper.phone}
                        </span>
                        <span>•</span>
                        <span>{helper.area}, {helper.city}</span>
                        {helper.helperProfile && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              {helper.helperProfile.rating || "New"}
                            </span>
                            <span>•</span>
                            <span>₹{helper.helperProfile.hourlyRate}/hr</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {helper.helperProfile && (
                        <button
                          onClick={() => toggleAvailability(helper.id, helper.helperProfile!.isAvailable)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                            helper.helperProfile.isAvailable
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          {helper.helperProfile.isAvailable ? "✅ Available" : "⏸ Busy"}
                        </button>
                      )}
                      <a
                        href={`tel:+91${helper.phone}`}
                        className="flex items-center gap-1 bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Call
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
