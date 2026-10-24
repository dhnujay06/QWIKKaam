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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {filteredServices.map(service => {
        const isSelected = selected === service.id;
        
        return (
          <div 
            key={service.id}
            onClick={() => onSelect(service.id)}
            className={cn(
              "group relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col bg-white hover:shadow-lg hover:-translate-y-0.5",
              isSelected 
                ? "border-teal-600 ring-2 ring-teal-600 shadow-md bg-teal-50/10" 
                : "border-slate-200"
            )}
          >
            {/* Real Work Photo */}
            <div className="relative h-40 w-full overflow-hidden bg-slate-100">
              <img 
                src={service.image} 
                alt={service.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Selection Checkmark */}
              {isSelected && (
                <div className="absolute top-3 right-3 bg-teal-600 text-white rounded-full p-1 shadow-lg ring-2 ring-white">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              )}

              {/* Price Pill */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                <span className="text-xs font-bold text-teal-700">
                  {formatPrice(service.basePrice)}{service.category === 'instant' || service.category === 'both' ? '/hr' : '/mo'}
                </span>
              </div>
            </div>
            
            {/* Title & Description */}
            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-1">
                  {t(service.title, service.titleHi)}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {t(service.description, service.descriptionHi)}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>⏱ {service.duration || 'Flexible hours'}</span>
                <span className={cn(
                  "font-semibold text-xs transition-colors",
                  isSelected ? "text-teal-600" : "text-slate-400 group-hover:text-teal-600"
                )}>
                  {isSelected ? t('Selected ✓', 'चुना गया ✓') : t('Select →', 'चुनें →')}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
