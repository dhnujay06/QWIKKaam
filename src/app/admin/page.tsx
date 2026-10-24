"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lock, Zap } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("admin", {
        password,
        redirect: false,
      });

      if (!result?.ok) {
        setError("Invalid admin password.");
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-3xl font-bold text-teal-400 mb-2">
            <Zap className="w-8 h-8 fill-teal-400" />
            Qwikkaam
          </div>
          <p className="text-slate-400 text-sm">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
          <div className="flex items-center justify-center w-12 h-12 bg-teal-500/20 rounded-xl mb-6 mx-auto">
            <Lock className="w-6 h-6 text-teal-400" />
          </div>
          <h1 className="text-xl font-bold text-white text-center mb-6">
            Admin Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Admin password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">⚠️ {error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-teal-600 hover:bg-teal-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
            >
              {loading ? "Checking..." : "Login →"}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Only authorized admin can access this panel.
        </p>
      </div>
    </div>
  );
}
