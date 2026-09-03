"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Helper } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { getInitials, formatPrice } from '@/lib/utils';
import { ShieldCheck, MapPin, Phone } from 'lucide-react';

interface HelperCardProps {
  helper: Helper;
}

export function HelperCard({ helper }: HelperCardProps) {
  const { t, language } = useLanguage();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-emerald-500';
      case 'busy': return 'bg-yellow-500';
      case 'unavailable': return 'bg-red-500';
      default: return 'bg-slate-300';
    }
  };

  const getInitialsBgColor = (name: string) => {
    const colors = ['bg-blue-500', 'bg-teal-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500'];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md h-full sm:h-auto">
      {/* Avatar & Status */}
      <div className="flex sm:flex-col items-center gap-4 sm:gap-2 shrink-0">
        <div className="relative">
          <div className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-3xl ${getInitialsBgColor(helper.name)}`}>
            {getInitials(helper.name)}
          </div>
          <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(helper.availability)}`} title={`Status: ${helper.availability}`}></div>
        </div>
        
        <div className="flex flex-col items-start sm:items-center">
          <div className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full font-medium">
            <ShieldCheck size={14} />
            <span>Verified</span>
          </div>
          <div className="mt-1 hidden sm:flex items-center gap-1 text-slate-500 text-xs">
            <MapPin size={12} />
            <span>{helper.city}</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{helper.name}</h3>
            <div className="text-sm text-slate-500">
              {helper.age} yrs • {helper.experience} yrs exp
            </div>
          </div>
          <StarRating rating={helper.rating} size="sm" />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {helper.skills.slice(0, 3).map((skill, idx) => (
            <Badge key={idx} variant="secondary" className="text-[10px] sm:text-xs">
              {skill}
            </Badge>
          ))}
          {helper.skills.length > 3 && (
            <Badge variant="secondary" className="text-[10px] sm:text-xs">+{helper.skills.length - 3}</Badge>
          )}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 text-sm pt-4 border-t border-slate-100">
          <div>
            <div className="text-slate-500 text-xs">{language === 'hi' ? 'घंटे का रेट' : 'Hourly'}</div>
            <div className="font-semibold text-slate-900">{formatPrice(helper.hourlyRate)}/hr</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs">{language === 'hi' ? 'मासिक वेतन' : 'Monthly'}</div>
            <div className="font-semibold text-slate-900">{formatPrice(helper.monthlySalary)}/mo</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <Link href={`/helpers/${helper.id}`} className="w-full">
            <button className="w-full py-2 px-3 rounded-lg border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors">
              {t('View Profile', 'प्रोफ़ाइल देखें')}
            </button>
          </Link>
          {/* If helper has a phone number — show Call Now, else Book Now */}
          {(helper as any).phone ? (
            <a
              href={`tel:+91${(helper as any).phone}`}
              className="w-full py-2 px-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium text-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              {t('Call Now', 'कॉल करें')}
            </a>
          ) : (
            <Link href={`/book/instant?helper=${helper.id}`} className="w-full">
              <button className="w-full py-2 px-3 rounded-lg bg-teal-600 text-white font-medium text-sm hover:bg-teal-700 transition-colors">
                {t('Book Now', 'अभी बुक करें')}
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
