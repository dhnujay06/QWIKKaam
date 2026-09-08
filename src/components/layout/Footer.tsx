"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Zap, Globe, MessageCircle, Share2, Users, Mail, Smartphone } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 pt-16 pb-8 sm:pb-8 md:pb-8 lg:pb-8">
      {/* 
        Add extra padding to bottom for mobile to ensure the fixed 
        bottom nav doesn't cover footer content
      */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Company */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-1 text-2xl font-bold text-white mb-2">
              <Zap className="h-6 w-6 text-amber-500 fill-amber-500" />
              Qwikkaam
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              {t(
                "Connecting you with trusted, verified house help for all your domestic needs. Fast, secure, and reliable.",
                "आपकी सभी घरेलू जरूरतों के लिए विश्वसनीय, सत्यापित हाउस हेल्प के साथ आपको जोड़ना। तेज़, सुरक्षित और विश्वसनीय।"
              )}
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <Globe className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <MessageCircle className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <Share2 className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <Users className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">{t("Services", "सेवाएं")}</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/services/cooking" className="text-slate-400 hover:text-amber-500 transition-colors text-sm">
                  {t("Cooking", "खाना बनाना")}
                </Link>
              </li>
              <li>
                <Link href="/services/cleaning" className="text-slate-400 hover:text-amber-500 transition-colors text-sm">
                  {t("Cleaning", "सफाई")}
                </Link>
              </li>
              <li>
                <Link href="/services/babysitting" className="text-slate-400 hover:text-amber-500 transition-colors text-sm">
                  {t("Babysitting", "बेबीसिटिंग")}
                </Link>
              </li>
              <li>
                <Link href="/services/elderly-care" className="text-slate-400 hover:text-amber-500 transition-colors text-sm">
                  {t("Elderly Care", "बुजुर्गों की देखभाल")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">{t("Support", "समर्थन")}</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/help" className="text-slate-400 hover:text-teal-400 transition-colors text-sm">
                  {t("Help Center", "सहायता केंद्र")}
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-slate-400 hover:text-teal-400 transition-colors text-sm">
                  {t("Safety Center", "सुरक्षा केंद्र")}
                </Link>
              </li>
              <li>
                <Link href="/cancellation" className="text-slate-400 hover:text-teal-400 transition-colors text-sm">
                  {t("Cancellation Policy", "रद्द करने की नीति")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-teal-400 transition-colors text-sm">
                  {t("Terms of Service", "सेवा की शर्तें")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Apps */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">{t("Stay Updated", "अपडेट रहें")}</h3>
            <div className="mb-8">
              <div className="flex mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="email"
                  placeholder={t("Email address", "ईमेल पता")}
                  className="w-full bg-slate-800 border-slate-700 text-white rounded-l-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                />
                <button className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-r-lg text-sm font-medium transition-colors">
                  {t("Subscribe", "सब्सक्राइब")}
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-slate-300 font-medium text-sm mb-3 flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                {t("Get the App (Coming Soon)", "ऐप प्राप्त करें (जल्द आ रहा है)")}
              </h4>
              <div className="flex gap-3">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-2 flex items-center gap-2 opacity-70 cursor-not-allowed">
                  <div className="text-xs text-left">
                    <div className="text-slate-400 text-[10px]">GET IT ON</div>
                    <div className="text-white font-semibold">Google Play</div>
                  </div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-2 flex items-center gap-2 opacity-70 cursor-not-allowed">
                  <div className="text-xs text-left">
                    <div className="text-slate-400 text-[10px]">Download on the</div>
                    <div className="text-white font-semibold">App Store</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Qwikkaam. {t("All rights reserved.", "सर्वाधिकार सुरक्षित।")}
          </p>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            {t("Made with", "भारत में")} <span className="text-red-500">❤️</span> {t("in India", "बनाया गया")}
          </p>
        </div>
      </div>
    </footer>
  );
}
