"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { User, Briefcase, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SERVICES = [
  { id: "cleaning", label: "Cleaning" },
  { id: "cooking", label: "Cooking" },
  { id: "driving", label: "Driving" },
  { id: "babysitting", label: "Babysitting" },
  { id: "eldercare", label: "Elder Care" },
];

const LANGUAGES = [
  { id: "hindi", label: "Hindi" },
  { id: "english", label: "English" },
  { id: "marathi", label: "Marathi" },
  { id: "gujarati", label: "Gujarati" },
];

export default function SignupPage() {
  const { language, t } = useLanguage();
  const [role, setRole] = useState<"customer" | "helper">("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Common Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Customer Fields
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");

  // Helper Fields
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [experience, setExperience] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [monthlySalary, setMonthlySalary] = useState("");
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);

  const toggleService = (id: string) => {
    setServiceIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleLanguage = (id: string) => {
    setLanguages((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const payload = {
        name,
        phone,
        role,
        ...(role === "customer" && { email, city }),
        ...(role === "helper" && {
          gender,
          age: parseInt(age),
          experience: parseInt(experience),
          hourlyRate: parseInt(hourlyRate),
          monthlySalary: parseInt(monthlySalary),
          serviceIds,
          languages,
        }),
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 409) {
        throw new Error("Phone number already registered");
      }

      if (!res.ok) {
        throw new Error(data.error || "Registration failed. Please try again.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border-t-4 border-teal-500 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-teal-500 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration successful!</h2>
            <p className="text-slate-600 mb-6">Please login to continue.</p>
            <Link
              href="/login"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Create an account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border-t-4 border-teal-500">
          <div className="flex justify-center mb-6 space-x-4">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-full transition-colors",
                role === "customer" ? "bg-teal-100 text-teal-700 font-medium" : "text-slate-500 hover:bg-slate-100"
              )}
            >
              <User size={18} />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("helper")}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-full transition-colors",
                role === "helper" ? "bg-teal-100 text-teal-700 font-medium" : "text-slate-500 hover:bg-slate-100"
              )}
            >
              <Briefcase size={18} />
              <span>Helper</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500 p-2.5 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="mt-1 block w-full border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500 p-2.5 border"
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {role === "customer" ? (
                <motion.div
                  key="customer-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Email (Optional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500 p-2.5 border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">City</label>
                    <input
                      type="text"
                      required={role === "customer"}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-1 block w-full border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500 p-2.5 border"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="helper-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Gender</label>
                      <select
                        required={role === "helper"}
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="mt-1 block w-full border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500 p-2.5 border bg-white"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Age</label>
                      <input
                        type="number"
                        required={role === "helper"}
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="mt-1 block w-full border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500 p-2.5 border"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Years of Experience</label>
                      <input
                        type="number"
                        required={role === "helper"}
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="mt-1 block w-full border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500 p-2.5 border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Hourly Rate (₹)</label>
                      <input
                        type="number"
                        required={role === "helper"}
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        className="mt-1 block w-full border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500 p-2.5 border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Monthly Salary (₹)</label>
                      <input
                        type="number"
                        required={role === "helper"}
                        value={monthlySalary}
                        onChange={(e) => setMonthlySalary(e.target.value)}
                        className="mt-1 block w-full border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500 p-2.5 border"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Services Provided</label>
                    <div className="flex flex-wrap gap-2">
                      {SERVICES.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => toggleService(s.id)}
                          className={cn(
                            "px-3 py-1 text-sm rounded-full border transition-colors",
                            serviceIds.includes(s.id)
                              ? "bg-teal-100 border-teal-500 text-teal-700"
                              : "border-slate-300 text-slate-600 hover:border-slate-400"
                          )}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Languages Spoken</label>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.map((l) => (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => toggleLanguage(l.id)}
                          className={cn(
                            "px-3 py-1 text-sm rounded-full border transition-colors",
                            languages.includes(l.id)
                              ? "bg-teal-100 border-teal-500 text-teal-700"
                              : "border-slate-300 text-slate-600 hover:border-slate-400"
                          )}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 mt-6"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign Up"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/login" className="font-medium text-teal-600 hover:text-teal-500">
                Log in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
