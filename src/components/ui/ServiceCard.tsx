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
    const cat = category.toLowerCase();
    switch (cat) {
      case 'instant':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Instant</Badge>;
      case 'permanent':
        return <Badge className="bg-teal-100 text-teal-800 border-teal-200">Permanent</Badge>;
      case 'both':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Both</Badge>;
      default:
        return null;
    }
  };

  return (
    <Link href={`/services/${service.slug}`} className="block h-full group">
      <div className="h-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex flex-col">
        {/* Service Work Photo */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
          <img 
            src={service.image} 
            alt={service.title} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute top-3 right-3 shadow-sm">
            {getCategoryBadge(service.category)}
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
            {language === 'hi' && service.titleHi ? service.titleHi : service.title}
          </h3>
          
          <p className="text-slate-500 text-sm mb-6 flex-grow line-clamp-2">
            {language === 'hi' && service.descriptionHi ? service.descriptionHi : service.description}
          </p>
          
          <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
            <div className="text-sm">
              <span className="text-slate-500 mr-1">{language === 'hi' ? 'शुरुआती कीमत' : 'Starts at'}</span>
              <span className="font-bold text-teal-600">{formatPrice(service.basePrice)}</span>
              <span className="text-slate-500">{service.category === 'permanent' ? '/mo' : '/hr'}</span>
            </div>
            <span className="text-teal-600 font-medium text-sm group-hover:underline">
              {language === 'hi' ? 'विवरण देखें' : 'View Details'} &rarr;
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
