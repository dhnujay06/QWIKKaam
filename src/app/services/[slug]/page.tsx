"use client";

import React, { use } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { services } from '@/data/services';
import { helpers } from '@/data/helpers';
import { HelperCard } from '@/components/ui/HelperCard';
import { formatPrice } from '@/lib/utils';
import { Check, X, ChevronRight, Home } from 'lucide-react';
import { notFound } from 'next/navigation';

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t, language } = useLanguage();
  
  const service = services.find(s => s.slug === slug);
  
  if (!service) {
    notFound();
  }

  const title = language === 'hi' && service.titleHi ? service.titleHi : service.title;
  const description = language === 'hi' && service.descriptionHi ? service.descriptionHi : service.description;
  
  const [relevantHelpers, setRelevantHelpers] = React.useState<any[]>(() =>
    helpers.filter(h => h.skills.includes(service.title) || h.serviceIds?.includes(service.id))
  );

  React.useEffect(() => {
    fetch(`/api/helpers?service=${service.id}`)
      .then(res => res.json())
      .then(data => {
        if (data?.helpers?.length) {
          setRelevantHelpers(data.helpers);
        }
      })
      .catch(() => {});
  }, [service.id]);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-3 flex items-center text-sm text-slate-500">
          <Link href="/" className="hover:text-teal-600 flex items-center">
            <Home size={14} className="mr-1" />
            {t('Home', 'होम')}
          </Link>
          <ChevronRight size={14} className="mx-2" />
          <Link href="/services" className="hover:text-teal-600">
            {t('Services', 'सेवाएं')}
          </Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-slate-900 font-medium">{title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-teal-50 flex items-center justify-center text-5xl md:text-6xl shrink-0">
            {service.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{title}</h1>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
                {service.category}
              </span>
            </div>
            <p className="text-lg text-slate-600 mb-6">{description}</p>
            
            <div className="flex flex-wrap gap-4">
              {(service.category === 'instant' || service.category === 'both') && (
                <button className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors shadow-sm">
                  {t('Book Instant', 'तत्काल बुक करें')} • {formatPrice(service.basePrice)}/hr
                </button>
              )}
              {(service.category === 'permanent' || service.category === 'both') && (
                <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors shadow-sm">
                  {t('Find Permanent Help', 'स्थायी मदद खोजें')}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Details */}
          <div className="md:col-span-2 space-y-8">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">{t("What's Included", "क्या शामिल है")}</h2>
              <ul className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-700">Standard task inclusion {i} for {title}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">{t("What's Not Included", "क्या शामिल नहीं है")}</h2>
              <ul className="space-y-3">
                {[1, 2].map(i => (
                  <li key={i} className="flex items-start gap-3">
                    <X className="text-red-500 shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-700">Out of scope task {i}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Pricing Info */}
          <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">{t('Pricing Guide', 'मूल्य निर्धारण गाइड')}</h3>
              
              <div className="space-y-4">
                {(service.category === 'instant' || service.category === 'both') && (
                  <div className="pb-4 border-b border-slate-700">
                    <div className="text-slate-400 text-sm mb-1">{t('Instant Booking', 'त्वरित बुकिंग')}</div>
                    <div className="text-2xl font-bold text-amber-400">
                      {formatPrice(service.basePrice)} <span className="text-sm font-normal text-slate-400">/ hr</span>
                    </div>
                  </div>
                )}
                
                {(service.category === 'permanent' || service.category === 'both') && (
                  <div>
                    <div className="text-slate-400 text-sm mb-1">{t('Monthly Salary (Est.)', 'मासिक वेतन (अनुमानित)')}</div>
                    <div className="text-2xl font-bold text-teal-400">
                      {formatPrice(service.basePrice * 180)} <span className="text-sm font-normal text-slate-400">/ mo</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Available Helpers */}
        {relevantHelpers.length > 0 && (
          <div>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {t('Available Helpers for this Service', 'इस सेवा के लिए उपलब्ध सहायक')}
              </h2>
              <Link href="/helpers" className="text-teal-600 font-medium hover:underline text-sm">
                {t('View all', 'सभी देखें')}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relevantHelpers.slice(0, 4).map(helper => (
                <HelperCard key={helper.id} helper={helper} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
