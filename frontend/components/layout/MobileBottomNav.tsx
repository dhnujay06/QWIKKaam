"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { Home, Grid3X3, PlusCircle, Calendar, User } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: "/", label: t("Home", "होम"), icon: Home },
    { href: "/services", label: t("Services", "सेवाएं"), icon: Grid3X3 },
    { href: "/book", label: t("Book", "बुक करें"), icon: PlusCircle, isPrimary: true },
    { href: "/bookings", label: t("Bookings", "बुकिंग"), icon: Calendar },
    { href: "/profile", label: t("Profile", "प्रोफ़ाइल"), icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-slate-200 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");

          if (item.isPrimary) {
            return (
              <div key={item.href} className="flex items-center justify-center -mt-6">
                <Link
                  href={item.href}
                  className="flex items-center justify-center w-14 h-14 bg-amber-500 rounded-full shadow-lg hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  <Icon className="w-6 h-6 text-white" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex flex-col items-center justify-center hover:bg-slate-50 transition-colors group"
            >
              <div
                className={cn(
                  "flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all",
                  isActive ? "bg-teal-50 text-teal-700" : ""
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 mb-0.5 transition-colors",
                    isActive ? "text-teal-600" : "text-slate-400 group-hover:text-teal-600"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] transition-colors",
                    isActive ? "text-teal-700 font-bold" : "text-slate-500 group-hover:text-teal-600"
                  )}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
