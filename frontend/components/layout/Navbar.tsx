"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { Zap, MapPin, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const cities = ["Bhilai (Risali)", "Delhi (Coming Soon)", "Mumbai (Coming Soon)"];

export default function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Bhilai (Risali)");

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  const navLinks = [
    { href: "/", label: t("Home", "होम") },
    { href: "/services", label: t("Services", "सेवाएं") },
    { href: "/nearby", label: t("📍 Near Me", "📍 मेरे पास") },
    { href: "/book/instant", label: t("Instant Booking", "तुरंत बुकिंग") },
    { href: "/book/permanent", label: t("Permanent Booking", "स्थायी बुकिंग") },
    { href: "/pricing", label: t("Pricing", "मूल्य निर्धारण") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Location */}
          <div className="flex items-center gap-6">
            <Link href="/" className="group flex flex-col justify-center">
              <div className="flex items-center gap-1 text-2xl font-bold text-slate-900">
                <Zap className="h-6 w-6 text-amber-500 fill-amber-500" />
                Qwikaam
              </div>
              <span className="text-[10px] text-teal-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity -mt-1 ml-7">
                क्विकाम
              </span>
            </Link>

            {/* Location Selector (Desktop) */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 font-medium py-2 px-3 rounded-md hover:bg-slate-50 transition-colors"
              >
                <MapPin className="h-4 w-4 text-teal-600" />
                {selectedCity}
                <ChevronDown className="h-4 w-4" />
              </button>

              <AnimatePresence>
                {isCityDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-2 z-50"
                  >
                    {cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCity(city);
                          setIsCityDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors",
                          selectedCity === city ? "text-teal-600 font-semibold bg-teal-50/50" : "text-slate-700"
                        )}
                      >
                        {city}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium px-3.5 py-2 rounded-xl transition-all duration-200",
                    isActive
                      ? "text-teal-700 bg-teal-50 font-semibold border border-teal-200/80 shadow-xs"
                      : "text-slate-600 hover:text-teal-600 hover:bg-slate-50"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="text-sm font-semibold text-slate-700 px-3 py-1.5 rounded-full border border-slate-200 hover:border-teal-600 hover:text-teal-600 transition-colors"
            >
              {language === "en" ? "हिं" : "EN"}
            </button>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-700 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                {t("Login", "लॉगिन")}
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                {t("Register", "रजिस्टर")}
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={toggleLanguage}
              className="text-xs font-semibold text-slate-700 px-2.5 py-1 rounded-full border border-slate-200"
            >
              {language === "en" ? "हिं" : "EN"}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/50 z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl z-50 flex flex-col md:hidden overflow-y-auto"
            >
              <div className="p-4 flex justify-between items-center border-b border-slate-100">
                <div className="flex items-center gap-1 text-xl font-bold text-slate-900">
                  <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
                  Qwikaam
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:bg-slate-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4">
                <div className="mb-6">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                    {t("Location", "स्थान")}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {cities.slice(0, 4).map((city) => (
                      <button
                        key={city}
                        onClick={() => setSelectedCity(city)}
                        className={cn(
                          "px-3 py-1.5 text-sm rounded-full border transition-colors",
                          selectedCity === city
                            ? "bg-teal-50 border-teal-200 text-teal-700 font-medium"
                            : "border-slate-200 text-slate-600"
                        )}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                <nav className="flex flex-col gap-1.5 mb-8">
                  {navLinks.map((link) => {
                    const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "px-4 py-3 font-medium rounded-xl transition-colors flex items-center justify-between",
                          isActive
                            ? "bg-teal-50 text-teal-700 font-semibold border border-teal-200/80"
                            : "text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        <span>{link.label}</span>
                        {isActive && <span className="w-2 h-2 rounded-full bg-teal-600" />}
                      </Link>
                    );
                  })}
                </nav>

                <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center font-semibold text-slate-700 px-4 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    {t("Login", "लॉगिन")}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center font-semibold text-white bg-amber-500 hover:bg-amber-600 px-4 py-3 rounded-lg transition-colors"
                  >
                    {t("Register", "रजिस्टर")}
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
