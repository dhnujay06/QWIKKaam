"use client";

import { useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';

interface TimeSlotPickerProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

export default function TimeSlotPicker({ selectedDate, onSelectDate, selectedTime, onSelectTime }: TimeSlotPickerProps) {
  const { t } = useLanguage();

  const dates = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => addDays(new Date(), i));
  }, []);

  const timeSlots = {
    morning: ['07:00 AM - 09:00 AM', '09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM'],
    afternoon: ['01:00 PM - 03:00 PM', '03:00 PM - 05:00 PM'],
    evening: ['05:00 PM - 07:00 PM', '07:00 PM - 09:00 PM']
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">{t('Select Date', 'तारीख चुनें')}</h3>
        <div className="flex overflow-x-auto pb-2 gap-3 no-scrollbar">
          {dates.map((date, i) => {
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const isToday = i === 0;
            const isTomorrow = i === 1;
            
            return (
              <button
                key={i}
                type="button"
                onClick={() => onSelectDate(date)}
                className={cn(
                  "flex flex-col items-center min-w-[80px] p-3 rounded-xl border transition-colors shrink-0",
                  isSelected 
                    ? "bg-teal-600 border-teal-600 text-white shadow-sm" 
                    : "bg-white border-slate-200 text-slate-700 hover:border-teal-300"
                )}
              >
                <span className="text-xs mb-1">
                  {isToday ? t('Today', 'आज') : isTomorrow ? t('Tomorrow', 'कल') : format(date, 'EEE')}
                </span>
                <span className="font-bold text-lg">{format(date, 'dd')}</span>
                <span className="text-xs">{format(date, 'MMM')}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">{t('Select Time', 'समय चुनें')}</h3>
        <div className="space-y-4">
          
          <div>
            <div className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">{t('Morning', 'सुबह')}</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {timeSlots.morning.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onSelectTime(slot)}
                  className={cn(
                    "p-2 text-sm rounded-lg border transition-all",
                    selectedTime === slot
                      ? "bg-teal-600 border-teal-600 text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-700 hover:border-teal-300"
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <div className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">{t('Afternoon', 'दोपहर')}</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {timeSlots.afternoon.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onSelectTime(slot)}
                  className={cn(
                    "p-2 text-sm rounded-lg border transition-all",
                    selectedTime === slot
                      ? "bg-teal-600 border-teal-600 text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-700 hover:border-teal-300"
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">{t('Evening', 'शाम')}</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {timeSlots.evening.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onSelectTime(slot)}
                  className={cn(
                    "p-2 text-sm rounded-lg border transition-all",
                    selectedTime === slot
                      ? "bg-teal-600 border-teal-600 text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-700 hover:border-teal-300"
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
