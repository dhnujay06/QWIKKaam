"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Service } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { language } = useLanguage();

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Instant':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">Instant</Badge>;
      case 'Permanent':
        return <Badge className="bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-100">Permanent</Badge>;
      case 'Both':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100">Both</Badge>;
      default:
        return null;
    }
  };

  return (
    <Link href={`/services/${service.slug}`} className="block h-full">
      <div className="h-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="text-4xl">{service.icon}</div>
          {getCategoryBadge(service.category)}
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          {language === 'hi' && service.titleHi ? service.titleHi : service.title}
        </h3>
        
        <p className="text-slate-500 text-sm mb-6 flex-grow line-clamp-3">
          {language === 'hi' && service.descriptionHi ? service.descriptionHi : service.description}
        </p>
        
        <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
          <div className="text-sm">
            <span className="text-slate-500 mr-1">{language === 'hi' ? 'शुरुआती कीमत' : 'Starts at'}</span>
            <span className="font-bold text-slate-900">{formatPrice(service.basePrice)}</span>
            <span className="text-slate-500">{service.category === 'permanent' ? '/mo' : '/hr'}</span>
          </div>
          <span className="text-teal-600 font-medium text-sm hover:underline">
            {language === 'hi' ? 'विवरण देखें' : 'View Details'} &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
