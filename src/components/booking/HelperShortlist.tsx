"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { cn, formatPrice } from '@/lib/utils';
import { Helper } from '@/types';
import { Star, CheckCircle2 } from 'lucide-react';

interface HelperShortlistProps {
  helpers: Helper[];
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
}

export default function HelperShortlist({ helpers, selectedIds, onSelect }: HelperShortlistProps) {
  const { t } = useLanguage();

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelect(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      if (selectedIds.length < 3) {
        onSelect([...selectedIds, id]);
      } else {
        // Optionally show toast that max is 3
        alert(t('You can shortlist up to 3 helpers', 'आप अधिकतम 3 सहायकों को चुन सकते हैं'));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t('Matched Helpers', 'मिले हुए सहायक')}</h2>
          <p className="text-sm text-slate-500">{t('Select up to 3 for interview', 'इंटरव्यू के लिए अधिकतम 3 चुनें')}</p>
        </div>
        <div className="text-sm font-medium">
          <span className="text-teal-600">{selectedIds.length}</span> / 3 {t('selected', 'चुने गए')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {helpers.map(helper => {
          const isSelected = selectedIds.includes(helper.id);

          return (
            <div 
              key={helper.id}
              onClick={() => toggleSelect(helper.id)}
              className={cn(
                "relative p-4 rounded-xl border bg-white cursor-pointer transition-all flex gap-4 hover:shadow-md",
                isSelected ? "border-teal-500 ring-1 ring-teal-500 bg-teal-50/10" : "border-slate-200"
              )}
            >
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600" />
                </div>
              )}
              
              <img 
                src={helper.photo || "/api/placeholder/80/80"} 
                alt={helper.name} 
                className="w-20 h-20 rounded-full object-cover border border-slate-100"
              />
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-900">{helper.name}</h3>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                    95% MATCH
                  </span>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-slate-600 mb-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-medium text-slate-900">{helper.rating}</span>
                  <span className="mx-1">•</span>
                  <span>{helper.experience} yrs exp</span>
                </div>
                
                <div className="text-sm font-semibold text-teal-700">
                  {formatPrice(helper.monthlySalary || 8000)} / {t('month', 'महीना')}
                </div>
                
                {helper.skills && helper.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {helper.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded-md font-medium">
                        {skill}
                      </span>
                    ))}
                    {helper.skills.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded-md font-medium">
                        +{helper.skills.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
