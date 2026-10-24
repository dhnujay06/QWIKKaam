"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Calendar, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Service, Helper } from '@/types';
import { format } from 'date-fns';

interface BookingConfirmationProps {
  service: Service;
  date: Date;
  time: string;
  address: string;
  helper?: Helper;
  bookingId?: string;
}

export default function BookingConfirmation({ service, date, time, address, helper, bookingId: propBookingId }: BookingConfirmationProps) {
  const { t } = useLanguage();
  const [bookingId, setBookingId] = useState(propBookingId || '');

  useEffect(() => {
    if (propBookingId) {
      setBookingId(propBookingId);
    } else if (!bookingId) {
      setBookingId(`QW${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [propBookingId]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 flex flex-col items-center">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-6"
      >
        <div className="w-14 h-14 bg-teal-500 rounded-full flex items-center justify-center shadow-lg">
          <Check className="w-8 h-8 text-white" strokeWidth={3} />
        </div>
      </motion.div>

      <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">
        {t('Booking Confirmed!', 'बुकिंग पक्की हो गई!')}
      </h1>
      <p className="text-slate-500 mb-8 text-center">
        {t('Your booking ID is', 'आपकी बुकिंग आईडी है')} <span className="font-bold text-slate-900">{bookingId}</span>
      </p>

      <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-4">
          <div className="text-3xl">{service.icon}</div>
          <div>
            <h3 className="font-bold text-slate-900">
              {t(service.title, service.titleHi)}
            </h3>
            <p className="text-sm text-slate-500">{t('Instant Service', 'तुरंत सेवा')}</p>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900">{format(date, 'EEEE, MMMM dd, yyyy')}</p>
              <p className="text-xs text-slate-500">{t('Date', 'तारीख')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900">{time}</p>
              <p className="text-xs text-slate-500">{t('Time', 'समय')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900">{address}</p>
              <p className="text-xs text-slate-500">{t('Address', 'पता')}</p>
            </div>
          </div>
        </div>
      </div>

      {helper && (
        <div className="w-full bg-white rounded-2xl border border-teal-100 p-6 mb-8 flex items-center gap-4 shadow-sm">
          <img src={helper.photo || "/api/placeholder/64/64"} alt={helper.name} className="w-16 h-16 rounded-full object-cover" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">
              {t('Assigned Professional', 'सौंपा गया पेशेवर')}
            </p>
            <h4 className="font-bold text-slate-900">{helper.name}</h4>
            <p className="text-sm text-slate-500">⭐ {helper.rating} • {helper.experience} {t('exp', 'अनुभव')}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Link href="/bookings" className="flex-1">
          <button className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-colors">
            {t('Track Booking', 'बुकिंग ट्रैक करें')}
          </button>
        </Link>
        <Link href="/" className="flex-1">
          <button className="w-full py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 rounded-xl font-medium transition-colors">
            {t('Back to Home', 'होम पर वापस जाएं')}
          </button>
        </Link>
      </div>
    </div>
  );
}
