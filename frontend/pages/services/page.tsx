"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { services } from '@/data/services';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'instant' | 'permanent';

export default function ServicesPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('instant');

  const filteredServices = services.filter(service => 
    service.category === activeTab || service.category === 'both'
  );

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
          {t('Our Services', 'हमारी सेवाएं')}
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          {t(
            'Professional, verified, and reliable house help tailored to your specific needs.',
            'आपकी विशिष्ट आवश्यकताओं के अनुरूप पेशेवर, सत्यापित और विश्वसनीय घरेलू सहायता।'
          )}
        </p>
      </div>

      <div className="flex justify-center mb-10">
        <div className="bg-slate-100 p-1 rounded-xl flex w-full max-w-md">
          <button
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'instant'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => setActiveTab('instant')}
          >
            {t('Instant Booking', 'त्वरित बुकिंग')}
          </button>
          <button
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'permanent'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => setActiveTab('permanent')}
          >
            {t('Permanent Placement', 'स्थायी प्लेसमेंट')}
          </button>
        </div>
      </div>

      <div className="mb-10 text-center max-w-3xl mx-auto">
        {activeTab === 'instant' ? (
          <p className="text-slate-600 bg-amber-50 p-4 rounded-lg border border-amber-100">
            {t(
              'Need immediate help? Book a verified professional for a few hours. Transparent hourly pricing, no long-term commitment.',
              'तत्काल मदद चाहिए? कुछ घंटों के लिए एक सत्यापित पेशेवर बुक करें। पारदर्शी प्रति घंटा मूल्य निर्धारण, कोई दीर्घकालिक प्रतिबद्धता नहीं।'
            )}
          </p>
        ) : (
          <p className="text-slate-600 bg-teal-50 p-4 rounded-lg border border-teal-100">
            {t(
              'Looking for regular assistance? Hire dedicated help on a monthly basis. Complete background checks and smooth replacements if needed.',
              'नियमित सहायता खोज रहे हैं? मासिक आधार पर समर्पित मदद किराए पर लें। पूरी पृष्ठभूमि की जांच और जरूरत पड़ने पर आसान प्रतिस्थापन।'
            )}
          </p>
        )}
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredServices.map(service => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
