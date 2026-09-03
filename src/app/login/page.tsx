"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Smartphone, ShieldCheck, User, Briefcase, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [role, setRole] = useState<"customer" | "helper">("customer");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devOtp, setDevOtp] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }
      
      if (data.devOtp) {
        setDevOtp(data.devOtp);
        // Autofill for convenience
        setOtp(data.devOtp.toString().split(""));
      }
      
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const result = await signIn("credentials", {
        phone,
        otp: otpValue,
        redirect: false,
      });
      
      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          {language === "hi" ? "लॉग इन करें" : "Sign in to your account"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border-t-4 border-teal-500">
          <div className="flex justify-center mb-6 space-x-4">
            <button
              onClick={() => !otpSent && setRole("customer")}
              disabled={otpSent}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-full transition-colors",
                role === "customer" ? "bg-teal-100 text-teal-700 font-medium" : "text-slate-500 hover:bg-slate-100"
              )}
            >
              <User size={18} />
              <span>Customer</span>
            </button>
            <button
              onClick={() => !otpSent && setRole("helper")}
              disabled={otpSent}
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

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Smartphone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="block w-full pl-10 sm:text-sm border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500 p-2.5 border"
                    placeholder="Enter 10 digit number"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length < 10}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Send OTP"}
              </button>
            </form>
          ) : (
            <motion.form 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleVerifyOtp} 
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 text-center mb-4">
                  Enter 6-digit code sent to {phone}
                </label>
                <div className="flex justify-between items-center max-w-xs mx-auto">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      required
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-10 h-12 text-center text-lg border border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    />
                  ))}
                </div>
                {devOtp && (
                  <p className="mt-2 text-xs text-center text-slate-500 font-mono">
                    Dev OTP: {devOtp}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || otp.join("").length < 6}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Verify & Login"}
              </button>
              
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-sm text-teal-600 hover:text-teal-500 text-center"
              >
                Change phone number
              </button>
            </motion.form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Don't have an account?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/signup" className="font-medium text-teal-600 hover:text-teal-500">
                Sign up instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
