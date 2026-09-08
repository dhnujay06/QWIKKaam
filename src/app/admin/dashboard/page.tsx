"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, UserPlus, Phone, Star, Zap, LogOut, CheckCircle, ShieldCheck } from "lucide-react";

interface Helper {
  id: string;
  name: string;
  phone: string;
  role: string;
  city: string;
  area: string;
  helperProfile?: {
    hourlyRate: number;
    monthlySalary: number;
    isAvailable: boolean;
    rating: number;
    totalBookings: number;
    serviceIds: string[];
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, available: 0 });

  useEffect(() => {
    // Check admin auth
    if (typeof window !== "undefined") {
      if (!sessionStorage.getItem("qwikkaam_admin")) {
        router.push("/admin");
        return;
      }
    }
    fetchHelpers();
  }, []);

  const fetchHelpers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/helpers");
      const data = await res.json();
      setHelpers(data.helpers || []);
      setStats({
        total: data.helpers?.length || 0,
        available: data.helpers?.filter((h: Helper) => h.helperProfile?.isAvailable).length || 0,
      });
    } catch {
      console.error("Failed to fetch helpers");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("qwikkaam_admin");
    router.push("/admin");
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

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top bar */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-teal-400 text-xl">
          <Zap className="w-6 h-6 fill-teal-400" />
          Qwikkaam Admin
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                <div className="text-xs text-slate-500">Total Helpers</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stats.available}</div>
                <div className="text-xs text-slate-500">Available Now</div>
              </div>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 grid grid-cols-2 gap-4">
            <Link
              href="/admin/add-helper"
              className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-5 px-4 rounded-2xl transition-colors shadow-sm"
            >
              <UserPlus className="w-5 h-5" />
              <span className="text-sm">Helper Add</span>
            </Link>
            <Link
              href="/admin/verify"
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-5 px-4 rounded-2xl transition-colors shadow-sm"
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm">Verification</span>
            </Link>
          </div>
        </div>

        {/* Helpers List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-lg">Registered Helpers</h2>
            <button
              onClick={fetchHelpers}
              className="text-teal-600 hover:text-teal-700 text-sm font-medium"
            >
              Refresh ↻
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading...</div>
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
      </div>
    </div>
  );
}
