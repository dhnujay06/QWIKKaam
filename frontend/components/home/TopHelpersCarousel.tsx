"use client";

import React, { useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

const MOCK_HELPERS = [
  { id: '1', name: 'Sunita D.', rating: 4.9, jobs: 120, exp: '5 yrs', rate: 120, skills: ['Cooking', 'Cleaning', 'Baby Care'] },
  { id: '2', name: 'Ramesh K.', rating: 4.8, jobs: 95, exp: '3 yrs', rate: 100, skills: ['Cleaning', 'Driving', 'Errands'] },
  { id: '3', name: 'Geeta M.', rating: 4.9, jobs: 210, exp: '7 yrs', rate: 150, skills: ['Elderly Care', 'Cooking'] },
  { id: '4', name: 'Pooja S.', rating: 4.7, jobs: 60, exp: '2 yrs', rate: 90, skills: ['Baby Care', 'Cleaning'] },
  { id: '5', name: 'Anita B.', rating: 5.0, jobs: 150, exp: '6 yrs', rate: 130, skills: ['Cooking', 'Baking'] },
];

export default function TopHelpersCarousel() {
  const { t } = useLanguage();
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('Top Rated Helpers', 'सर्वश्रेष्ठ हेल्पर्स')}
            </h2>
            <p className="text-slate-400 text-lg">
              {t('Meet some of our highly rated professionals ready to assist you.', 'हमारे कुछ उच्च श्रेणी के पेशेवरों से मिलें जो आपकी सहायता के लिए तैयार हैं।')}
            </p>
          </div>
          <div className="hidden md:flex gap-4">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div 
          ref={carouselRef}
          className="flex overflow-x-auto gap-6 pb-8 -mx-4 px-4 md:mx-0 md:px-0 snap-x hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {MOCK_HELPERS.map((helper) => (
            <div 
              key={helper.id} 
              className="min-w-[300px] md:min-w-[350px] bg-slate-800 rounded-2xl p-6 border border-slate-700 snap-start hover:border-teal-500/50 transition-colors flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-teal-600 text-white flex items-center justify-center text-xl font-bold mr-4">
                    {helper.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{helper.name}</h3>
                    <div className="flex items-center text-amber-400 text-sm font-medium mt-1">
                      <Star className="w-4 h-4 fill-current mr-1" />
                      {helper.rating} <span className="text-slate-400 ml-1 font-normal">({helper.jobs} {t('jobs', 'नौकरियां')})</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {helper.skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-700 text-teal-100 text-xs font-medium rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
              
              <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-700">
                <div>
                  <div className="text-sm text-slate-400">{t('Experience', 'अनुभव')}</div>
                  <div className="font-semibold">{helper.exp}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400">{t('Rate', 'दर')}</div>
                  <div className="font-semibold text-teal-400">{formatPrice(helper.rate)}/hr</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/helpers" className="inline-block text-teal-400 font-medium pb-1 border-b border-teal-400/30">
            {t('View All Helpers →', 'सभी हेल्पर्स देखें →')}
          </Link>
        </div>
      </div>
    </section>
  );
}
