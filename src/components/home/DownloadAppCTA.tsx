"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Smartphone, Mail } from 'lucide-react';

export default function DownloadAppCTA() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-16">
            <div className="text-white">
              <div className="inline-flex items-center bg-teal-900/50 rounded-full px-4 py-2 text-sm font-medium mb-6 text-teal-100 border border-teal-500/30">
                <Smartphone className="w-4 h-4 mr-2" />
                {t('Coming Soon on Android & iOS', 'जल्द ही Android और iOS पर आ रहा है')}
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                {t('Download Qwikkaam App', 'क्विक्काम ऐप डाउनलोड करें')}
              </h2>
              
              <p className="text-teal-100 text-lg mb-10 max-w-md leading-relaxed">
                {t(
                  'Book helpers, manage payments, and track your service directly from your phone. Get notified when we launch!',
                  'हेल्पर्स बुक करें, भुगतान प्रबंधित करें, और सीधे अपने फोन से अपनी सेवा को ट्रैक करें। जब हम लॉन्च करें तो सूचित करें!'
                )}
              </p>
              
              <form className="flex flex-col sm:flex-row gap-3 max-w-md">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" 
                    placeholder={t('Enter your email', 'अपना ईमेल दर्ज करें')}
                    className="w-full pl-12 pr-4 py-4 rounded-xl text-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-4 px-8 rounded-xl transition-colors whitespace-nowrap"
                >
                  {t('Notify Me', 'मुझे सूचित करें')}
                </button>
              </form>
            </div>
            
            <div className="hidden md:flex justify-center relative">
              <div className="w-64 h-[500px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl relative overflow-hidden flex items-center justify-center">
                <div className="absolute top-0 w-32 h-6 bg-slate-800 rounded-b-3xl z-10"></div>
                <div className="text-center p-6 text-slate-500">
                  <div className="w-20 h-20 bg-slate-800 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl font-bold text-teal-500">Q</span>
                  </div>
                  <p className="font-medium">{t('App Preview Coming Soon', 'ऐप पूर्वावलोकन जल्द आ रहा है')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
