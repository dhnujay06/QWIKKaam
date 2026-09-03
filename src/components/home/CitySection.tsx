"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { MapPin } from 'lucide-react';

const CITIES = [
  { name: 'Bhilai', available: true },
  { name: 'Raipur', available: false },
  { name: 'Delhi NCR', available: false },
  { name: 'Mumbai', available: false },
  { name: 'Bangalore', available: false },
  { name: 'Pune', available: false },
  { name: 'Hyderabad', available: false },
  { name: 'Chennai', available: false },
  { name: 'Kolkata', available: false },
  { name: 'Ahmedabad', available: false },
  { name: 'Jaipur', available: false },
  { name: 'Indore', available: false },
];

export default function CitySection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {t('Currently serving in Bhilai (Risali)', 'वर्तमान में भिलाई (रिसाली) में सेवा दे रहे हैं')}
            </h2>
            <p className="text-slate-600 text-lg">
              {t('We are currently exclusively operating in Risali Sector, Bhilai. Expanding soon!', 'हम वर्तमान में केवल रिसाली सेक्टर, भिलाई में काम कर रहे हैं। जल्द ही विस्तार कर रहे हैं!')}
            </p>
          </div>
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-3 px-6 rounded-xl transition-colors whitespace-nowrap">
            {t('Request Your City', 'अपने शहर का अनुरोध करें')}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {CITIES.map((city, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-xl border flex items-center justify-center text-center ${
                city.available 
                  ? 'border-teal-200 bg-teal-50 text-teal-900' 
                  : 'border-slate-200 bg-slate-50 text-slate-400'
              }`}
            >
              <div className="flex flex-col items-center">
                <MapPin className={`w-5 h-5 mb-2 ${city.available ? 'text-teal-600' : 'text-slate-300'}`} />
                <span className="font-medium text-sm">{city.name}</span>
                {!city.available && (
                  <span className="text-[10px] uppercase tracking-wider font-bold mt-1 bg-slate-200 px-2 py-0.5 rounded-full text-slate-500">
                    {t('Coming Soon', 'जल्द आ रहा है')}
                  </span>
                )}
                {city.available && (
                  <span className="text-[10px] uppercase tracking-wider font-bold mt-1 bg-teal-200 px-2 py-0.5 rounded-full text-teal-800">
                    {t('Live Now', 'लाइव')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
