"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ShieldCheck, HeartHandshake, Eye, Award } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  const { t } = useLanguage();

  const values = [
    { title: "Trust & Safety", desc: "Background verified professionals you can rely on.", icon: ShieldCheck },
    { title: "Fair Wages", desc: "Empowering workers with transparent and fair compensation.", icon: HeartHandshake },
    { title: "Transparency", desc: "No hidden fees, complete clarity in pricing.", icon: Eye },
    { title: "Quality Service", desc: "Trained professionals delivering excellence.", icon: Award },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-teal-400">
            {t("About Qwikaam", "क्विकाम के बारे में")}
          </h1>
          <p className="text-xl text-slate-300">
            {t("Empowering domestic workers, simplifying home care.", "घरेलू कामगारों को सशक्त बनाना, घर की देखभाल को आसान बनाना।")}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="w-full aspect-square bg-slate-200 rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                [Image Placeholder]
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Qwikaam was founded with a simple vision: to bridge the gap between households seeking reliable help and skilled domestic workers looking for dignified employment.
            </p>
            <p className="text-slate-600 leading-relaxed">
              In India, the unorganized domestic help sector leaves both customers and workers frustrated. Customers struggle with reliability, while workers face exploitation and lack of fair wages. We created Qwikaam to bring structure, trust, and empowerment to this vital industry.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-slate-50 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
                  <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{v.title}</h3>
                  <p className="text-slate-600 text-sm">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-teal-600 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">10k+</div>
            <div className="text-teal-100">Homes Served</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">5k+</div>
            <div className="text-teal-100">Helpers Employed</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">15+</div>
            <div className="text-teal-100">Cities</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">4.8/5</div>
            <div className="text-teal-100">Customer Rating</div>
          </div>
        </div>
      </section>
    </div>
  );
}
