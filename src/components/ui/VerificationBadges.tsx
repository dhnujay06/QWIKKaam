import { ShieldCheck, CreditCard, BadgeCheck, Syringe } from "lucide-react";

interface VerificationBadgesProps {
  adminVerified?: boolean;
  aadhaarVerified?: string; // "VERIFIED" | "PENDING" | "REJECTED"
  policeVerified?: boolean;
  vaccinated?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: { icon: "w-3 h-3", text: "text-[10px]", padding: "px-2 py-0.5", gap: "gap-1" },
  md: { icon: "w-4 h-4", text: "text-xs",    padding: "px-3 py-1",   gap: "gap-1.5" },
  lg: { icon: "w-5 h-5", text: "text-sm",    padding: "px-4 py-1.5", gap: "gap-2" },
};

export default function VerificationBadges({
  adminVerified,
  aadhaarVerified,
  policeVerified,
  vaccinated,
  size = "md",
}: VerificationBadgesProps) {
  const s = sizeConfig[size];

  const badges = [
    {
      show: adminVerified,
      icon: <ShieldCheck className={`${s.icon} flex-shrink-0`} />,
      label: "Admin Verified",
      labelHi: "सत्यापित",
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-200",
      tooltip: "Admin ne personally is helper se mila hai",
    },
    {
      show: aadhaarVerified === "VERIFIED",
      icon: <CreditCard className={`${s.icon} flex-shrink-0`} />,
      label: "Aadhaar",
      labelHi: "आधार",
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-200",
      tooltip: "Aadhaar card verified hai",
    },
    {
      show: policeVerified,
      icon: <BadgeCheck className={`${s.icon} flex-shrink-0`} />,
      label: "Police Verified",
      labelHi: "पुलिस सत्यापित",
      bg: "bg-purple-100",
      text: "text-purple-700",
      border: "border-purple-200",
      tooltip: "Police clearance certificate verified hai — Sabse Safe!",
    },
    {
      show: vaccinated,
      icon: <Syringe className={`${s.icon} flex-shrink-0`} />,
      label: "Vaccinated",
      labelHi: "टीकाकृत",
      bg: "bg-teal-100",
      text: "text-teal-700",
      border: "border-teal-200",
      tooltip: "Covid/Hepatitis vaccinated hai",
    },
  ].filter((b) => b.show);

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badge) => (
        <span
          key={badge.label}
          title={badge.tooltip}
          className={`inline-flex items-center ${s.gap} ${s.padding} ${badge.bg} ${badge.text} border ${badge.border} rounded-full font-semibold cursor-help`}
        >
          {badge.icon}
          <span className={s.text}>{badge.label}</span>
        </span>
      ))}
    </div>
  );
}
