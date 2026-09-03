"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';

const MOCK_SERVICES = [
  { id: 'cooking', icon: '🍳', nameEn: 'Cooking', nameHi: 'खाना बनाना', price: 149 },
  { id: 'cleaning', icon: '🧹', nameEn: 'Jhadu-Pocha', nameHi: 'झाड़ू-पोछा', price: 99 },
  { id: 'dishes', icon: '🍽️', nameEn: 'Bartan Dhona', nameHi: 'बर्तन धोना', price: 149 },
  { id: 'babysitter', icon: '👶', nameEn: 'Baby Sitter', nameHi: 'बेबी सिटर', price: 199 },
  { id: 'elderly', icon: '👴', nameEn: 'Elderly Care', nameHi: 'बुजुर्गों की देखभाल', price: 249 },
  { id: 'housework', icon: '🏠', nameEn: 'Full House Work', nameHi: 'पूरे घर का काम', price: 499 },
];

export default function InstantServicesStrip() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {t('Instant Booking — Get Help Within Hours', 'तुरंत बुकिंग — घंटों में मदद पाएं')}
            </h2>
            <p className="text-slate-500 text-lg">
              {t('Professional help delivered to your doorstep quickly.', 'पेशावर मदद आपके घर के दरवाजे पर तेजी से पहुंचाई गई।')}
            </p>
          </div>
          <Link href="/book/instant" className="hidden md:inline-flex text-teal-600 font-medium hover:text-teal-700">
            {t('View All →', 'सभी देखें →')}
          </Link>
        </div>

        <div className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-6 gap-6 pb-6 -mx-4 px-4 md:mx-0 md:px-0 snap-x">
          {MOCK_SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="min-w-[240px] md:min-w-0 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-500/30 transition-all group snap-start flex flex-col h-full"
            >
              <div className="text-4xl mb-4 bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-teal-50 transition-all">
                {service.icon}
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-1">
                {t(service.nameEn, service.nameHi)}
              </h3>
              <p className="text-slate-500 text-sm mb-6">
                {t('Starts at', 'शुरुआत')} <span className="font-medium text-slate-900">{formatPrice(service.price)}</span>
              </p>
              
              <div className="mt-auto pt-4 border-t border-slate-50">
                <Link 
                  href={`/book/instant?service=${service.id}`}
                  className="block text-center w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-xl transition-colors"
                >
                  {t('Book Now', 'अभी बुक करें')}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
