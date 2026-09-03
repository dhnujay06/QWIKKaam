"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, UserCheck, RefreshCw, BadgeIndianRupee } from 'lucide-react';

export default function TrustSection() {
  const { t } = useLanguage();

  const badges = [
    {
      icon: <ShieldCheck className="w-10 h-10 text-teal-600" />,
      titleEn: '100% Verified',
      titleHi: '100% सत्यापित',
      descEn: 'Aadhaar & full background checks performed on all helpers.',
      descHi: 'सभी हेल्पर्स पर आधार और पूर्ण पृष्ठभूमि की जाँच की गई है।',
    },
    {
      icon: <UserCheck className="w-10 h-10 text-teal-600" />,
      titleEn: 'Police Cleared',
      titleHi: 'पुलिस क्लीयर्ड',
      descEn: 'Every professional undergoes strict police verification.',
      descHi: 'प्रत्येक पेशेवर का सख्त पुलिस सत्यापन होता है।',
    },
    {
      icon: <RefreshCw className="w-10 h-10 text-teal-600" />,
      titleEn: 'Free Replacement',
      titleHi: 'मुफ्त प्रतिस्थापन',
      descEn: 'Not satisfied? Get a free replacement with no questions asked.',
      descHi: 'संतुष्ट नहीं हैं? बिना किसी सवाल के मुफ्त प्रतिस्थापन प्राप्त करें।',
    },
    {
      icon: <BadgeIndianRupee className="w-10 h-10 text-teal-600" />,
      titleEn: 'Transparent Pricing',
      titleHi: 'पारदर्शी मूल्य निर्धारण',
      descEn: 'No hidden charges or surprise fees. What you see is what you pay.',
      descHi: 'कोई छिपा हुआ शुल्क या आश्चर्यजनक फीस नहीं। जो आप देखते हैं वही आप भुगतान करते हैं।',
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {t('Your Safety is Our Priority', 'आपकी सुरक्षा हमारी प्राथमिकता है')}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            {t('We go the extra mile to ensure the people entering your home are trustworthy and professional.', 'हम यह सुनिश्चित करने के लिए अतिरिक्त प्रयास करते हैं कि आपके घर में प्रवेश करने वाले लोग भरोसेमंद और पेशेवर हों।')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, idx) => (
            <div key={idx} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex flex-col items-center text-center hover:bg-teal-50 hover:border-teal-100 transition-colors">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                {badge.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                {t(badge.titleEn, badge.titleHi)}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {t(badge.descEn, badge.descHi)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
