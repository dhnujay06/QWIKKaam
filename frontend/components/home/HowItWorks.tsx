"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Search, UserCheck, Sparkles } from 'lucide-react';

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: <Search className="w-8 h-8 text-teal-600" />,
      titleEn: 'Choose Your Service',
      titleHi: 'अपनी सेवा चुनें',
      descEn: 'Select whether you need instant help for a few hours or permanent help on a monthly basis.',
      descHi: 'चुनें कि क्या आपको कुछ घंटों के लिए तत्काल मदद चाहिए या मासिक आधार पर स्थायी मदद।',
    },
    {
      icon: <UserCheck className="w-8 h-8 text-teal-600" />,
      titleEn: 'Get Matched',
      titleHi: 'मैच प्राप्त करें',
      descEn: 'We instantly match you with highly rated, background-verified helpers in your area.',
      descHi: 'हम तुरंत आपको आपके क्षेत्र में उच्च श्रेणी के, पृष्ठभूमि-सत्यापित हेल्पर्स के साथ मिलाते हैं।',
    },
    {
      icon: <Sparkles className="w-8 h-8 text-teal-600" />,
      titleEn: 'Enjoy Service',
      titleHi: 'सेवा का आनंद लें',
      descEn: 'Sit back and relax while our professionals handle the work. Pay securely online or in cash.',
      descHi: 'आराम से बैठें जबकि हमारे पेशेवर काम संभालते हैं। ऑनलाइन या नकद में सुरक्षित रूप से भुगतान करें।',
    }
  ];

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {t('How It Works', 'यह कैसे काम करता है')}
          </h2>
          <p className="text-slate-600 text-lg">
            {t('Get reliable house help in three simple steps.', 'तीन सरल चरणों में विश्वसनीय घरेलू मदद पाएं।')}
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-teal-100 z-0"></div>
          
          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-slate-50 mb-6 relative">
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 font-bold border-2 border-white shadow-sm">
                    {idx + 1}
                  </div>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {t(step.titleEn, step.titleHi)}
                </h3>
                <p className="text-slate-500">
                  {t(step.descEn, step.descHi)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
