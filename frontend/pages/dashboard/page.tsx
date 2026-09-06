"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { 
  CalendarCheck, Users, User, MapPin, CreditCard, 
  Menu, X, MapPin as PinIcon, Clock
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

type Tab = "bookings" | "helpers" | "profile" | "addresses" | "payments";
type BookingStatus = "active" | "completed" | "cancelled";

const mockBookings = [
  { id: "BK102", service: "Deep Cleaning", helper: "Anita Sharma", date: "Oct 12, 2023 - 10:00 AM", amount: 1500, status: "active" },
  { id: "BK089", service: "Cooking (Lunch)", helper: "Sunita Devi", date: "Oct 10, 2023 - 12:00 PM", amount: 400, status: "completed" },
  { id: "BK045", service: "Babysitting", helper: "Pooja Verma", date: "Sep 25, 2023 - 09:00 AM", amount: 800, status: "cancelled" },
];

const mockHelpers = [
  { id: "H1", name: "Laxmi Bai", service: "Full-time Maid", salary: 15000, since: "Jan 2023" }
];

export default function DashboardPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("bookings");
  const [bookingFilter, setBookingFilter] = useState<BookingStatus>("active");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "bookings", label: t("My Bookings", "मेरी बुकिंग"), icon: CalendarCheck },
    { id: "helpers", label: t("My Helpers", "मेरे सहायक"), icon: Users },
    { id: "profile", label: t("Profile", "प्रोफ़ाइल"), icon: User },
    { id: "addresses", label: t("Addresses", "पते"), icon: MapPin },
    { id: "payments", label: t("Payments", "भुगतान"), icon: CreditCard },
  ];

  const filteredBookings = mockBookings.filter(b => b.status === bookingFilter);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-20">
        <h2 className="text-xl font-bold text-teal-400">Dashboard</h2>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "bg-white w-full md:w-64 border-r border-slate-200 md:min-h-screen p-4 flex-shrink-0 transition-all z-10",
        mobileMenuOpen ? "block" : "hidden md:block"
      )}>
        <nav className="space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as Tab); setMobileMenuOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left",
                  activeTab === tab.id 
                    ? "bg-teal-50 text-teal-700" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className={cn("w-5 h-5", activeTab === tab.id ? "text-teal-600" : "text-slate-400")} />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          
          {activeTab === "bookings" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-slate-900">{t("My Bookings", "मेरी बुकिंग")}</h1>
              
              <div className="flex gap-2 border-b border-slate-200 pb-1">
                {(["active", "completed", "cancelled"] as BookingStatus[]).map(status => (
                  <button
                    key={status}
                    onClick={() => setBookingFilter(status)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium capitalize rounded-t-lg transition-colors",
                      bookingFilter === status 
                        ? "text-teal-600 border-b-2 border-teal-600 bg-teal-50/50" 
                        : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="grid gap-4">
                {filteredBookings.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-100 shadow-sm">
                    {t("No bookings found.", "कोई बुकिंग नहीं मिली।")}
                  </div>
                ) : (
                  filteredBookings.map(booking => (
                    <div key={booking.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900">{booking.service}</h3>
                          <span className={cn(
                            "px-2 py-0.5 text-xs rounded-full font-medium capitalize",
                            booking.status === "active" ? "bg-amber-100 text-amber-800" :
                            booking.status === "completed" ? "bg-green-100 text-green-800" :
                            "bg-red-100 text-red-800"
                          )}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 flex items-center gap-1 mb-1">
                          <User className="w-4 h-4" /> {booking.helper}
                        </p>
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {booking.date}
                        </p>
                      </div>
                      
                      <div className="flex md:flex-col items-center md:items-end justify-between gap-3">
                        <span className="font-bold text-slate-900">{formatPrice(booking.amount)}</span>
                        {booking.status === "active" && (
                          <div className="flex gap-2">
                            <button className="px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50">Cancel</button>
                            <button className="px-3 py-1.5 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700">Track</button>
                          </div>
                        )}
                        {booking.status === "completed" && (
                          <div className="flex gap-2">
                            <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">Rate</button>
                            <button className="px-3 py-1.5 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600">Rebook</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "helpers" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-slate-900">{t("My Helpers", "मेरे सहायक")}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockHelpers.map(h => (
                  <div key={h.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{h.name}</h3>
                        <p className="text-teal-600 font-medium text-sm">{h.service}</p>
                      </div>
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                        <User className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-slate-500">Salary</p>
                        <p className="font-semibold text-slate-900">{formatPrice(h.salary)}/mo</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Since</p>
                        <p className="font-semibold text-slate-900">{h.since}</p>
                      </div>
                    </div>
                    <div className="mt-5 flex gap-2">
                      <button className="flex-1 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">Replace</button>
                      <button className="flex-1 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800">Profile</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm max-w-xl">
              <h2 className="text-xl font-bold mb-6 text-slate-900">{t("Edit Profile", "प्रोफ़ाइल संपादित करें")}</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input type="text" defaultValue="Aditi Rao" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input type="text" defaultValue="9876543210" disabled className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" defaultValue="aditi@example.com" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 outline-none" />
                </div>
                <button className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 mt-4">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Placeholders for Addresses & Payments for brevity */}
          {(activeTab === "addresses" || activeTab === "payments") && (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-100 shadow-sm text-slate-500">
              Content for {activeTab} goes here.
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
