"use client";

import { useLanguage } from '@/context/LanguageContext';
import { cn, formatPrice } from '@/lib/utils';
import { Service } from '@/types';
import { CheckCircle2 } from 'lucide-react';

interface ServiceSelectorProps {
  services: Service[];
  selected: string | null;
  onSelect: (id: string) => void;
  category?: 'instant' | 'permanent' | 'both';
}

export default function ServiceSelector({ services, selected, onSelect, category }: ServiceSelectorProps) {
  const { t } = useLanguage();

  const filteredServices = category 
    ? services.filter(s => s.category === category || s.category === 'both')
    : services;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredServices.map(service => {
        const isSelected = selected === service.id;
        
        return (
          <div 
            key={service.id}
            onClick={() => onSelect(service.id)}
            className={cn(
              "relative p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col items-center text-center gap-3 bg-white hover:shadow-md",
              isSelected ? "border-teal-600 shadow-sm ring-1 ring-teal-600 bg-teal-50/10" : "border-slate-200"
            )}
          >
            {isSelected && (
              <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-teal-600" />
            )}
            
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-3xl">
              {service.icon}
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900">
                {t(service.title, service.titleHi)}
              </h3>
              <p className="text-sm font-medium text-teal-600 mt-1">
                {t('Starts at ', 'शुरुआती कीमत ')}{formatPrice(service.basePrice)}{service.category === 'instant' || service.category === 'both' ? '/hr' : '/mo'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

