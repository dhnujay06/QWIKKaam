"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const SERVICES = [
  { id: "s1", label: "Cooking / खाना बनाना" },
  { id: "s2", label: "Jhadu-Pocha / झाड़ू-पोछा" },
  { id: "s3", label: "Bartan Dhona / बर्तन धोना" },
  { id: "s4", label: "Baby Sitting / बेबी सिटिंग" },
  { id: "s5", label: "Elderly Care / बुजुर्गों की देखभाल" },
  { id: "s6", label: "House Cleaning / घर की सफाई" },
  { id: "s7", label: "Laundry / कपड़े धोना" },
  { id: "s8", label: "All-Rounder / ऑल-राउंडर" },
];

export default function AdminAddHelperPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "FEMALE",
    age: "",
    experience: "",
    hourlyRate: "149",
    monthlySalary: "8000",
    languages: ["Hindi"],
    serviceIds: [] as string[],
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("qwikkaam_admin")) {
      router.push("/admin");
    }
  }, []);

  const toggleService = (id: string) => {
    setForm((prev) => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(id)
        ? prev.serviceIds.filter((s) => s !== id)
        : [...prev.serviceIds, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || form.phone.length !== 10) {
      setError("Naam aur 10-digit phone number zaroori hai.");
      return;
    }
    if (form.serviceIds.length === 0) {
      setError("Kam se kam ek service select karein.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/add-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          role: "HELPER",
          city: "Bhilai",
          area: "Risali Sector",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Kuch gadbad hui. Dobara try karein.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-10 text-center max-w-sm shadow-lg border border-slate-200">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Helper Add Ho Gaya!</h2>
          <p className="text-slate-500 text-sm mb-6">
            <strong>{form.name}</strong> ka profile successfully create ho gaya hai. Customers ab unhe dekh aur call kar sakte hain.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => { setForm({ name: "", phone: "", gender: "FEMALE", age: "", experience: "", hourlyRate: "149", monthlySalary: "8000", languages: ["Hindi"], serviceIds: [], notes: "" }); setSuccess(false); }}
              className="flex-1 bg-teal-600 text-white font-semibold py-3 rounded-xl text-sm hover:bg-teal-700 transition-colors"
            >
              + Aur Helper Add Karo
            </button>
            <Link
              href="/admin/dashboard"
              className="flex-1 bg-slate-100 text-slate-700 font-semibold py-3 rounded-xl text-sm hover:bg-slate-200 transition-colors text-center"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center gap-4">
        <Link href="/admin/dashboard" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2 font-bold">
          <UserPlus className="w-5 h-5 text-teal-400" />
          <span>Naya Helper Add Karo</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-teal-50 border-b border-teal-100 px-6 py-4">
            <p className="text-teal-800 text-sm font-medium">
              📱 Yeh form un helpers ke liye hai jinka smartphone nahi hai. Admin unki taraf se yahan register kare — customers unhe call kar sakenge!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Helper ka Naam <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="जैसे: Priya Sahu"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/40 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  <Phone className="w-3.5 h-3.5 inline mr-1" />
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="flex items-center px-3 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-sm text-slate-500">+91</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    placeholder="9876543210"
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-teal-500/40 text-sm"
                    required
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">Yeh number customer ke paas show hoga</p>
              </div>
            </div>

            {/* Gender + Age + Experience */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/40 text-sm bg-white"
                >
                  <option value="FEMALE">Female / महिला</option>
                  <option value="MALE">Male / पुरुष</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Umar (Saal)</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  placeholder="28"
                  min="18" max="65"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/40 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Anubhav (Saal)</label>
                <input
                  type="number"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  placeholder="3"
                  min="0" max="40"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/40 text-sm"
                />
              </div>
            </div>

            {/* Rates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hourly Rate (₹)</label>
                <input
                  type="number"
                  value={form.hourlyRate}
                  onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
                  placeholder="149"
                  min="50"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/40 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Monthly Salary (₹)</label>
                <input
                  type="number"
                  value={form.monthlySalary}
                  onChange={(e) => setForm({ ...form, monthlySalary: e.target.value })}
                  placeholder="8000"
                  min="3000"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/40 text-sm"
                />
              </div>
            </div>

            {/* Services */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Kya kaam kar sakti/sakta hai? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SERVICES.map((svc) => (
                  <label
                    key={svc.id}
                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors text-sm ${
                      form.serviceIds.includes(svc.id)
                        ? "border-teal-500 bg-teal-50 text-teal-800"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.serviceIds.includes(svc.id)}
                      onChange={() => toggleService(svc.id)}
                      className="accent-teal-600"
                    />
                    {svc.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Extra Notes (Optional)
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                placeholder="Koi khaas baat jaise: 'subah 7 baje se available hai' ya 'live-in bhi kar sakti hai'"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/40 text-sm resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Register ho raha hai...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Helper Register Karo
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
