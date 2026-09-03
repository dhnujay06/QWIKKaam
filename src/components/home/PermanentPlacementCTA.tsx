"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function PermanentPlacementCTA() {
  const { t } = useLanguage();
  const [bhk, setBhk] = useState(2);

  const getSalaryRange = (bhk: number) => {
    switch(bhk) {
      case 1: return { min: 8000, max: 10000 };
      case 2: return { min: 10000, max: 14000 };
      case 3: return { min: 14000, max: 18000 };
      case 4: return { min: 18000, max: 25000 };
      default: return { min: 10000, max: 14000 };
    }
  };

  const range = getSalaryRange(bhk);

  const features = [
    { en: 'Thorough background checks', hi: 'गहन पृष्ठभूमि की जाँच' },
    { en: 'Unlimited free replacements', hi: 'असीमित मुफ्त प्रतिस्थापन' },
    { en: 'Trained & experienced helpers', hi: 'प्रशिक्षित और अनुभवी हेल्पर्स' },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="grid lg:grid-cols-2 gap-12 p-8 md:p-16 relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('Need a Full-Time Helper?', 'फुल-टाइम हेल्पर चाहिए?')}
              </h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                {t(
                  'Looking for someone permanent? We provide thoroughly vetted, reliable domestic help on a monthly basis. Complete peace of mind guaranteed.',
                  'क्या आप किसी स्थायी व्यक्ति की तलाश में हैं? हम मासिक आधार पर अच्छी तरह से जांची गई, विश्वसनीय घरेलू मदद प्रदान करते हैं। पूर्ण मन की शांति की गारंटी।'
                )}
              </p>
              
              <ul className="space-y-4 mb-10">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-teal-100">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0" />
                    <span>{t(feature.en, feature.hi)}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href="/book/permanent"
                className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-4 px-8 rounded-xl transition-colors"
              >
                {t('Find Permanent Help →', 'स्थायी मदद खोजें →')}
              </Link>
            </div>
            
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-teal-100">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {t('Salary Estimator', 'वेतन अनुमानक')}
              </h3>
              <p className="text-slate-500 mb-8 text-sm">
                {t('Estimate the monthly salary based on your home size.', 'अपने घर के आकार के आधार पर मासिक वेतन का अनुमान लगाएं।')}
              </p>
              
              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-700 mb-4">
                  {t('Select your home size', 'अपने घर का आकार चुनें')}
                </label>
                <div className="grid grid-cols-4 gap-2 md:gap-4">
                  {[1, 2, 3, 4].map((size) => (
                    <button
                      key={size}
                      onClick={() => setBhk(size)}
                      className={`py-3 px-2 rounded-xl border text-center font-medium transition-all ${
                        bhk === size 
                          ? 'border-teal-600 bg-teal-50 text-teal-700' 
                          : 'border-slate-200 text-slate-600 hover:border-teal-200 hover:bg-slate-50'
                      }`}
                    >
                      {size} {t('BHK', 'BHK')}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-6 text-center border border-slate-100">
                <div className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">
                  {t('Estimated Monthly Salary', 'अनुमानित मासिक वेतन')}
                </div>
                <div className="text-3xl font-bold text-slate-900">
                  {formatPrice(range.min)} - {formatPrice(range.max)}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {t('*Prices may vary based on specific requirements and timings.', '*विशिष्ट आवश्यकताओं और समय के आधार पर कीमतें भिन्न हो सकती हैं।')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
