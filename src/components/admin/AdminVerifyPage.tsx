"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, ShieldCheck, CreditCard, BadgeCheck,
  Syringe, Check, X, ChevronDown, ChevronUp, Zap
} from "lucide-react";

interface Helper {
  id: string;
  name: string;
  phone: string;
  helperProfile?: {
    adminVerified: boolean;
    adminVerifiedAt: string | null;
    aadhaarNumber: string | null;
    aadhaarVerified: string;
    aadhaarVerifiedAt: string | null;
    policeVerified: boolean;
    policeStation: string | null;
    policeCertDate: string | null;
    policeVerifiedAt: string | null;
    vaccinated: boolean;
  };
}

function VerificationLevel({
  icon,
  title,
  description,
  color,
  isVerified,
  onVerify,
  onRevoke,
  extra,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  isVerified: boolean;
  onVerify: (extraData?: Record<string, string>) => void;
  onRevoke: () => void;
  extra?: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`border-2 rounded-xl overflow-hidden transition-colors ${
      isVerified ? `border-${color}-300 bg-${color}-50` : "border-slate-200 bg-white"
    }`}>
      <div className="p-4 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isVerified ? `bg-${color}-200 text-${color}-700` : "bg-slate-100 text-slate-400"
        }`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">{title}</span>
            {isVerified && (
              <span className={`text-xs font-bold px-2 py-0.5 bg-${color}-200 text-${color}-800 rounded-full`}>
                ✓ Verified
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          {isVerified ? (
            <button
              onClick={onRevoke}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              <X className="w-3 h-3" /> Revoke
            </button>
          ) : (
            <button
              onClick={() => extra ? setExpanded(!expanded) : onVerify()}
              className="flex items-center gap-1 text-xs text-white font-bold px-3 py-1.5 bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
            >
              <Check className="w-3 h-3" /> Verify
              {extra && (expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
            </button>
          )}
        </div>
      </div>
      {/* Extra fields for verification */}
      {expanded && extra && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-3">
          {extra}
        </div>
      )}
    </div>
  );
}

export default function AdminVerifyPage() {
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Extra form state for aadhaar & police
  const [aadhaarInputs, setAadhaarInputs] = useState<Record<string, string>>({});
  const [policeInputs, setPoliceInputs] = useState<Record<string, { station: string; date: string }>>({});

  useEffect(() => {
    fetchHelpers();
  }, []);

  const fetchHelpers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/helpers");
      const data = await res.json();
      setHelpers(data.helpers || []);
    } catch { console.error("Failed"); }
    finally { setLoading(false); }
  };

  const updateVerification = async (
    userId: string,
    level: string,
    value: boolean,
    extra?: Record<string, string>
  ) => {
    setUpdating(userId + level);
    try {
      await fetch("/api/admin/verify", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, level, value, extra }),
      });
      await fetchHelpers();
    } catch { console.error("Update failed"); }
    finally { setUpdating(null); }
  };

  const getVerificationScore = (helper: Helper) => {
    const p = helper.helperProfile;
    if (!p) return 0;
    let score = 0;
    if (p.adminVerified) score++;
    if (p.aadhaarVerified === "VERIFIED") score++;
    if (p.policeVerified) score++;
    if (p.vaccinated) score++;
    return score;
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center gap-4">
        <Link href="/admin/dashboard" className="text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2 font-bold">
          <Zap className="w-5 h-5 text-teal-400 fill-teal-400" />
          Helper Verification
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {loading ? (
          <div className="text-center text-slate-400 py-12">Loading helpers...</div>
        ) : helpers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Koi helper registered nahi hai.</p>
            <Link href="/admin/add-helper" className="text-teal-600 font-semibold mt-2 inline-block">
              → Helper Add Karo
            </Link>
          </div>
        ) : (
          helpers.map((helper) => {
            const p = helper.helperProfile;
            const score = getVerificationScore(helper);
            const scoreColors = ["", "text-orange-600", "text-yellow-600", "text-blue-600", "text-green-600"];
            const scoreLabels = ["", "Basic", "Trusted", "Highly Trusted", "⭐ Top Verified"];

            return (
              <div key={helper.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Helper Header */}
                <div className="p-5 border-b border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                    {helper.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900">{helper.name}</div>
                    <div className="text-sm text-slate-500">{helper.phone}</div>
                  </div>
                  {/* Verification Score */}
                  <div className="text-right">
                    <div className={`text-lg font-bold ${scoreColors[score] || "text-slate-400"}`}>
                      {score}/4
                    </div>
                    <div className={`text-xs font-medium ${scoreColors[score] || "text-slate-400"}`}>
                      {score > 0 ? scoreLabels[score] : "Unverified"}
                    </div>
                  </div>
                </div>

                {/* Verification Levels */}
                <div className="p-5 space-y-3">
                  {/* Level 1 — Admin */}
                  <VerificationLevel
                    icon={<ShieldCheck className="w-6 h-6" />}
                    title="Level 1 — Admin Verified"
                    description="Admin ne personally is helper se mila hai aur sab check kiya hai"
                    color="green"
                    isVerified={p?.adminVerified || false}
                    onVerify={() => updateVerification(helper.id, "admin", true)}
                    onRevoke={() => updateVerification(helper.id, "admin", false)}
                  />

                  {/* Level 2 — Aadhaar */}
                  <VerificationLevel
                    icon={<CreditCard className="w-6 h-6" />}
                    title="Level 2 — Aadhaar Verified"
                    description="Helper ka Aadhaar card admin ne check kiya hai"
                    color="blue"
                    isVerified={p?.aadhaarVerified === "VERIFIED"}
                    onVerify={(extraData) => updateVerification(helper.id, "aadhaar", true, extraData)}
                    onRevoke={() => updateVerification(helper.id, "aadhaar", false)}
                    extra={
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-600 block mb-1">Aadhaar Last 4 Digits</label>
                          <input
                            type="text"
                            maxLength={4}
                            placeholder="e.g. 4321"
                            value={aadhaarInputs[helper.id] || ""}
                            onChange={(e) => setAadhaarInputs({ ...aadhaarInputs, [helper.id]: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                          />
                        </div>
                        <button
                          disabled={!aadhaarInputs[helper.id] || aadhaarInputs[helper.id].length < 4}
                          onClick={() => updateVerification(helper.id, "aadhaar", true, { aadhaarNumber: `XXXX-XXXX-${aadhaarInputs[helper.id]}` })}
                          className="w-full bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-2 rounded-lg text-sm transition-colors"
                        >
                          Aadhaar Verify Karo ✓
                        </button>
                      </div>
                    }
                  />

                  {/* Level 3 — Police */}
                  <VerificationLevel
                    icon={<BadgeCheck className="w-6 h-6" />}
                    title="Level 3 — Police Verified"
                    description="Police clearance certificate admin ke paas hai — Sabse safe!"
                    color="purple"
                    isVerified={p?.policeVerified || false}
                    onVerify={() => updateVerification(helper.id, "police", true, {
                      policeStation: policeInputs[helper.id]?.station || "",
                      policeCertDate: policeInputs[helper.id]?.date || new Date().toISOString(),
                    })}
                    onRevoke={() => updateVerification(helper.id, "police", false)}
                    extra={
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-600 block mb-1">Police Station</label>
                          <input
                            type="text"
                            placeholder="e.g. Risali Police Station"
                            value={policeInputs[helper.id]?.station || ""}
                            onChange={(e) => setPoliceInputs({ ...policeInputs, [helper.id]: { ...policeInputs[helper.id], station: e.target.value } })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/40"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-600 block mb-1">Certificate Date</label>
                          <input
                            type="date"
                            value={policeInputs[helper.id]?.date || ""}
                            onChange={(e) => setPoliceInputs({ ...policeInputs, [helper.id]: { ...policeInputs[helper.id], date: e.target.value } })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/40"
                          />
                        </div>
                        <button
                          onClick={() => updateVerification(helper.id, "police", true, {
                            policeStation: policeInputs[helper.id]?.station || "Risali Police Station",
                            policeCertDate: policeInputs[helper.id]?.date || new Date().toISOString(),
                          })}
                          className="w-full bg-purple-600 text-white font-bold py-2 rounded-lg text-sm transition-colors hover:bg-purple-700"
                        >
                          Police Verify Karo ✓
                        </button>
                      </div>
                    }
                  />

                  {/* Vaccinated Bonus */}
                  <VerificationLevel
                    icon={<Syringe className="w-6 h-6" />}
                    title="Bonus — Vaccinated"
                    description="Covid / Hepatitis vaccine laga hua hai"
                    color="teal"
                    isVerified={p?.vaccinated || false}
                    onVerify={() => updateVerification(helper.id, "vaccinated", true)}
                    onRevoke={() => updateVerification(helper.id, "vaccinated", false)}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
