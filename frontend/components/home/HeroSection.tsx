"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Search, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const { t } = useLanguage();
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Risali & Bhilai area pincodes
  const VALID_PINCODES = ['490006', '490009', '490001', '490020', '490021', '490022', '490023', '490024', '490025', '490026'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!pincode || pincode.length < 6) {
      setError(t('Please enter a valid 6-digit pincode', 'कृपया 6 अंकों का पिनकोड दर्ज करें'));
      return;
    }
    if (VALID_PINCODES.includes(pincode)) {
      router.push(`/services`);
    } else {
      setError(t('Sorry! We currently serve only in Bhilai (Risali Sector). Your area is coming soon!', 'माफ करें! हम अभी केवल भिलाई (रिसाली सेक्टर) में सेवा दे रहे हैं। आपका क्षेत्र जल्द आएगा!'));
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-900 to-teal-900 pt-32 pb-24 lg:pt-48 lg:pb-32 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            {t(
              'Trusted House Help, Just a Click Away',
              'भरोसेमंद घरेलू मदद, बस एक क्लिक दूर'
            )}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-teal-50 mb-10"
          >
            {t(
              'Verified helpers for instant booking or permanent placement. 100% background checked for your peace of mind.',
              'तुरंत बुकिंग या स्थायी नियुक्ति के लिए सत्यापित हेल्पर्स। आपकी शांति के लिए 100% पृष्ठभूमि की जाँच की गई।'
            )}
          </motion.p>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row max-w-2xl mx-auto bg-white rounded-2xl sm:rounded-full p-2 shadow-xl shadow-teal-900/20"
          >
            <div className="flex items-center flex-1 px-4 py-3 sm:py-0">
              <MapPin className="text-slate-400 w-6 h-6 mr-3 flex-shrink-0" />
              <input 
                type="text" 
                placeholder={t('Enter Bhilai pincode (e.g. 490006)', 'भिलाई पिनकोड दर्ज करें (उदा. 490006)')}
                value={pincode}
                maxLength={6}
                onChange={(e) => { setPincode(e.target.value); setError(''); }}
                className="w-full text-slate-900 bg-transparent border-none outline-none placeholder:text-slate-400 text-lg"
              />
            </div>
            <button 
              type="submit"
              className="mt-2 sm:mt-0 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-4 px-8 rounded-xl sm:rounded-full transition-colors flex items-center justify-center whitespace-nowrap"
            >
              <Search className="w-5 h-5 mr-2" />
              {t('Find Helpers', 'हेल्पर्स खोजें')}
            </button>
          </motion.form>

          {/* Error / Validation Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-center bg-red-500/20 border border-red-400/40 text-white text-sm rounded-xl px-4 py-3 max-w-2xl mx-auto"
            >
              ⚠️ {error}
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 text-center divide-x divide-white/10 border-t border-white/10 pt-8"
          >
            <div className="px-2">
              <div className="text-2xl font-bold text-amber-400 mb-1">10,000+</div>
              <div className="text-sm text-teal-100">{t('Happy Homes', 'खुशहाल घर')}</div>
            </div>
            <div className="px-2">
              <div className="text-2xl font-bold text-amber-400 mb-1">5,000+</div>
              <div className="text-sm text-teal-100">{t('Verified Helpers', 'सत्यापित हेल्पर्स')}</div>
            </div>
            <div className="px-2">
              <div className="text-2xl font-bold text-amber-400 mb-1">50+</div>
              <div className="text-sm text-teal-100">{t('Cities', 'शहर')}</div>
            </div>
            <div className="px-2">
              <div className="text-2xl font-bold text-amber-400 mb-1">4.8★</div>
              <div className="text-sm text-teal-100">{t('Average Rating', 'औसत रेटिंग')}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
