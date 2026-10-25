"use client";

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { helpers } from '@/data/helpers';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { getInitials, formatPrice } from '@/lib/utils';
import ReviewSection from '@/components/reviews/ReviewSection';
import { 
  ChevronLeft, ShieldCheck, MapPin, 
  Languages, Clock, Calendar, CheckCircle2 
} from 'lucide-react';

export default function HelperProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, language } = useLanguage();
  
  const [helper, setHelper] = React.useState<any>(() => helpers.find(h => h.id === id) || null);
  const [loading, setLoading] = React.useState(!helper);

  React.useEffect(() => {
    if (!helper) {
      fetch(`/api/helpers?id=${id}`)
        .then(res => res.json())
        .then(data => {
          if (data?.helper) setHelper(data.helper);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, helper]);

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-slate-500 font-medium">Loading helper profile...</div>
      </div>
    );
  }

  if (!helper) {
    notFound();
  }

  const getInitialsBgColor = (name: string) => {
    const colors = ['bg-blue-500', 'bg-teal-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500'];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-12">
      {/* Header Mobile */}
      <div className="bg-white md:hidden sticky top-0 z-20 border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <Link href="/helpers" className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full">
          <ChevronLeft size={20} />
        </Link>
        <span className="font-semibold text-slate-900 line-clamp-1">{helper.name}</span>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-10 max-w-4xl">
        {/* Back link desktop */}
        <Link href="/helpers" className="hidden md:inline-flex items-center text-sm text-teal-600 hover:underline mb-6 font-medium">
          <ChevronLeft size={16} className="mr-1" />
          {t('Back to search', 'खोज पर वापस जाएं')}
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* Avatar & Badges */}
            <div className="flex flex-col items-center w-full md:w-auto">
              <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center text-white font-bold text-4xl md:text-5xl mb-4 shadow-inner ${getInitialsBgColor(helper.name)}`}>
                {getInitials(helper.name)}
              </div>
              
              <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full font-medium text-sm mb-4 border border-emerald-100">
                <ShieldCheck size={16} />
                <span>QwikVerified</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">{helper.name}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-slate-600 text-sm">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {helper.city}</span>
                    <span>•</span>
                    <span>{helper.age} yrs</span>
                    <span>•</span>
                    <span>{helper.gender}</span>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="text-center">
                    <div className="text-xl font-bold text-slate-900">{helper.rating}</div>
                    <StarRating rating={helper.rating} size="sm" showNumber={false} />
                  </div>
                  <div className="h-10 w-px bg-slate-200"></div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-slate-900">{helper.experience}+</div>
                    <div className="text-xs text-slate-500 uppercase font-medium">{t('Yrs Exp', 'वर्ष अनुभव')}</div>
                  </div>
                </div>
              </div>

              {/* Verified Items */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['Aadhaar', 'Police', 'Vaccinated'].map(badge => (
                  <Badge key={badge} variant="success" className="py-1 px-2.5 bg-emerald-50 text-emerald-700 border-emerald-200">
                    <CheckCircle2 size={12} className="mr-1" /> {badge}
                  </Badge>
                ))}
              </div>

              {/* Bio */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  {t('About', 'के बारे में')}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {language === 'hi' && helper.bioHi ? helper.bioHi : helper.bio}
                </p>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  {t('Top Skills', 'शीर्ष कौशल')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {helper.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="bg-slate-100 text-slate-700 border-transparent text-sm py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-slate-100 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-50/50">
            <div className="p-4 md:p-6 flex items-center gap-3">
              <div className="bg-blue-100 p-2.5 rounded-lg text-blue-600"><Languages size={20} /></div>
              <div>
                <div className="text-xs text-slate-500 font-medium mb-0.5">{t('Languages', 'भाषाएं')}</div>
                <div className="text-sm font-semibold text-slate-900">{helper.languages.join(', ')}</div>
              </div>
            </div>
            <div className="p-4 md:p-6 flex items-center gap-3">
              <div className="bg-amber-100 p-2.5 rounded-lg text-amber-600"><Clock size={20} /></div>
              <div>
                <div className="text-xs text-slate-500 font-medium mb-0.5">{t('Hourly Rate', 'प्रति घंटे दर')}</div>
                <div className="text-sm font-semibold text-slate-900">{formatPrice(helper.hourlyRate)}/hr</div>
              </div>
            </div>
            <div className="p-4 md:p-6 flex items-center gap-3">
              <div className="bg-teal-100 p-2.5 rounded-lg text-teal-600"><Calendar size={20} /></div>
              <div>
                <div className="text-xs text-slate-500 font-medium mb-0.5">{t('Monthly Salary', 'मासिक वेतन')}</div>
                <div className="text-sm font-semibold text-slate-900">{formatPrice(helper.monthlySalary)}/mo</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section — Live from database */}
        <ReviewSection
          helperId={helper.id}
          helperName={helper.name}
          averageRating={helper.rating}
          totalReviews={helper.reviewCount}
        />
      </div>

      {/* Sticky Bottom Actions - Mobile & Desktop */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 md:relative md:bg-transparent md:border-none md:shadow-none md:p-0 md:mt-8 md:container md:mx-auto md:max-w-4xl md:mb-12">
        <div className="flex gap-3 max-w-4xl mx-auto md:bg-slate-900 md:p-2 md:rounded-2xl">
          <button className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-colors shadow-sm md:shadow-none">
            {t('Book Instant', 'तत्काल बुक करें')}
          </button>
          <button className="flex-1 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors shadow-sm md:shadow-none">
            {t('Hire Monthly', 'मासिक नियुक्त करें')}
          </button>
        </div>
      </div>
    </div>
  );
}
