"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { services } from '@/data/services';
import StepIndicator from '@/components/booking/StepIndicator';
import ServiceSelector from '@/components/booking/ServiceSelector';
import TimeSlotPicker from '@/components/booking/TimeSlotPicker';
import AddressForm, { AddressData } from '@/components/booking/AddressForm';
import BookingSummary from '@/components/booking/BookingSummary';
import BookingConfirmation from '@/components/booking/BookingConfirmation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const steps = [
  { id: 'service', title: { en: 'Service', hi: 'सेवा' } },
  { id: 'time', title: { en: 'Date & Time', hi: 'तारीख व समय' } },
  { id: 'address', title: { en: 'Address', hi: 'पता' } },
  { id: 'review', title: { en: 'Review', hi: 'समीक्षा' } },
];

function InstantBookingContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  // State
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [addressData, setAddressData] = useState<AddressData>({
    houseNo: '', area: '', landmark: '', city: '', pincode: '', instructions: '', tag: 'Home'
  });

  useEffect(() => {
    const serviceSlug = searchParams.get('service');
    if (serviceSlug) {
      const s = services.find(s => s.id === serviceSlug || s.slug === serviceSlug);
      if (s) setSelectedServiceId(s.id);
    }
  }, [searchParams]);

  const selectedService = services.find(s => s.id === selectedServiceId);

  const canGoNext = () => {
    if (currentStep === 0) return !!selectedServiceId;
    if (currentStep === 1) return !!selectedDate && !!selectedTime;
    if (currentStep === 2) return !!addressData.houseNo && !!addressData.area && !!addressData.city && !!addressData.pincode;
    return true;
  };

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError]   = useState('');
  const [bookingId, setBookingId]         = useState<string | null>(null);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Last step — call booking API
      if (!selectedService || !selectedDate || !selectedTime) return;
      setBookingLoading(true);
      setBookingError('');
      try {
        const baseAmount = selectedService.basePrice * 2; // 2-hour default
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceId:   selectedService.id,
            serviceName: selectedService.title,
            type:        'INSTANT',
            scheduledDate: selectedDate.toISOString(),
            timeSlot:    selectedTime,
            durationHours: 2,
            baseAmount,
            specialInstructions: addressData.instructions,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          // If unauthenticated, still show confirmation (guest flow)
          if (res.status === 401) {
            setIsConfirmed(true);
          } else {
            setBookingError(data.error || 'Booking failed. Please try again.');
          }
        } else {
          setBookingId(data.booking?.id || null);
          setIsConfirmed(true);
        }
      } catch {
        setBookingError('Network error. Please try again.');
      } finally {
        setBookingLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isConfirmed && selectedService && selectedDate && selectedTime) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-12">
        <BookingConfirmation 
          service={selectedService}
          date={selectedDate}
          time={selectedTime}
          address={`${addressData.houseNo}, ${addressData.area}, ${addressData.city}`}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-4">
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{t('Instant Booking', 'तुरंत बुकिंग')}</h1>
        <p className="text-slate-500 mb-6">{t('Book a trusted professional for immediate help', 'तत्काल मदद के लिए एक भरोसेमंद पेशेवर बुक करें')}</p>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              
              {currentStep === 0 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-6">{t('Select a Service', 'सेवा चुनें')}</h2>
                  <ServiceSelector 
                    services={services} 
                    category="instant" 
                    selected={selectedServiceId} 
                    onSelect={setSelectedServiceId} 
                  />
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-6">{t('When do you need it?', 'आपको इसकी आवश्यकता कब है?')}</h2>
                  <TimeSlotPicker 
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    selectedTime={selectedTime}
                    onSelectTime={setSelectedTime}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-6">{t('Where should we come?', 'हमें कहां आना चाहिए?')}</h2>
                  <AddressForm 
                    data={addressData}
                    onChange={setAddressData}
                  />
                </div>
              )}

              {currentStep === 3 && selectedService && selectedDate && selectedTime && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-6">{t('Review your booking', 'अपनी बुकिंग की समीक्षा करें')}</h2>
                  <BookingSummary 
                    service={selectedService}
                    date={selectedDate}
                    time={selectedTime}
                    address={`${addressData.houseNo}, ${addressData.area}, ${addressData.city} - ${addressData.pincode}`}
                  />
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 sm:relative sm:bg-transparent sm:border-0 sm:mt-6">
          {/* Error message */}
          {bookingError && (
            <div className="px-4 pt-3 text-center text-sm text-red-600 bg-red-50 border-b border-red-100 sm:rounded-xl sm:mb-3 sm:border">
              ⚠️ {bookingError}
            </div>
          )}
          <div className="p-4 flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
              currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            {t('Back', 'पीछे')}
          </button>
          
          <button
            onClick={handleNext}
            disabled={!canGoNext() || bookingLoading}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-colors ${
              canGoNext() && !bookingLoading
                ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-md' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {bookingLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                {t('Confirming...', 'पक्का हो रहा है...')}
              </>
            ) : (
              <>
                {currentStep === steps.length - 1 ? t('Confirm Booking', 'बुकिंग पक्की करें') : t('Next', 'आगे')}
                {currentStep < steps.length - 1 && <ChevronRight className="w-5 h-5" />}
              </>
            )}
          </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function InstantBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 pt-24 text-center text-slate-500">Loading booking...</div>}>
      <InstantBookingContent />
    </Suspense>
  );
}

