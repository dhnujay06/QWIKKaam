"use client";

import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/lib/utils';
import { Service } from '@/types';
import { format } from 'date-fns';

interface BookingSummaryProps {
  service: Service;
  date: Date | null;
  time: string | null;
  address: string | null;
  onApplyCoupon?: (code: string) => void;
}

export default function BookingSummary({ service, date, time, address, onApplyCoupon }: BookingSummaryProps) {
  const { t } = useLanguage();
  
  const basePrice = service.basePrice;
  const serviceFee = 49;
  const gst = Math.round((basePrice + serviceFee) * 0.18);
  const total = basePrice + serviceFee + gst;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-5">
      <h3 className="font-bold text-lg text-slate-900 border-b pb-3">{t('Order Summary', 'आदेश सारांश')}</h3>
      
      <div className="flex gap-4 items-center">
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-2xl">
          {service.icon}
        </div>
        <div>
          <h4 className="font-semibold text-slate-900">
            {t(service.title, service.titleHi)}
          </h4>
          <p className="text-sm text-slate-500">
            {date ? format(date, 'MMM dd, yyyy') : ''} {time ? `| ${time}` : ''}
          </p>
        </div>
      </div>

      {address && (
        <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700">
          <span className="font-medium text-slate-900 block mb-1">{t('Service Address', 'सेवा का पता')}</span>
          {address}
        </div>
      )}

      <div className="space-y-2 text-sm text-slate-600 pt-3 border-t">
        <div className="flex justify-between">
          <span>{t('Base Price', 'मूल कीमत')}</span>
          <span>{formatPrice(basePrice)}</span>
        </div>
        <div className="flex justify-between">
          <span>{t('Trust & Safety Fee', 'सुरक्षा शुल्क')}</span>
          <span>{formatPrice(serviceFee)}</span>
        </div>
        <div className="flex justify-between">
          <span>{t('Taxes (GST)', 'कर (GST)')}</span>
          <span>{formatPrice(gst)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder={t('Promo Code', 'प्रोमो कोड')}
          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
          {t('Apply', 'लागू करें')}
        </button>
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <span className="font-bold text-slate-900">{t('Total Amount', 'कुल राशि')}</span>
        <span className="font-bold text-xl text-teal-600">{formatPrice(total)}</span>
      </div>
    </div>
  );
}
