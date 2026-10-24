"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { services } from '@/data/services';
import { helpers } from '@/data/helpers';
import StepIndicator from '@/components/booking/StepIndicator';
import ServiceSelector from '@/components/booking/ServiceSelector';
import RequirementsForm, { RequirementsData } from '@/components/booking/RequirementsForm';
import HelperShortlist from '@/components/booking/HelperShortlist';
import { ChevronLeft, ChevronRight, CalendarCheck } from 'lucide-react';
import Link from 'next/link';

const steps = [
  { id: 'service', title: { en: 'Service', hi: 'सेवा' } },
  { id: 'requirements', title: { en: 'Requirements', hi: 'जरूरतें' } },
  { id: 'shortlist', title: { en: 'Shortlist', hi: 'शॉर्टलिस्ट' } },
  { id: 'schedule', title: { en: 'Schedule', hi: 'शेड्यूल' } },
];

export default function PermanentBookingPage() {
  const { t } = useLanguage();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  // State
  const [availableHelpers, setAvailableHelpers] = useState<any[]>(helpers);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [requirements, setRequirements] = useState<RequirementsData>({
    bhk: '', familySize: 0, diet: '', timing: '', languages: [], notes: ''
  });
  const [shortlistedHelpers, setShortlistedHelpers] = useState<string[]>([]);
  const [scheduleData, setScheduleData] = useState({ date: '', time: '', phone: '' });

  useEffect(() => {
    fetch('/api/helpers')
      .then(res => res.json())
      .then(data => {
        if (data?.helpers?.length) setAvailableHelpers(data.helpers);
      })
      .catch(() => {});
  }, []);

  const canGoNext = () => {
    if (currentStep === 0) return !!selectedServiceId;
    if (currentStep === 1) return !!requirements.bhk && !!requirements.diet && !!requirements.timing;
    if (currentStep === 2) return shortlistedHelpers.length > 0;
    if (currentStep === 3) return !!scheduleData.date && !!scheduleData.time && scheduleData.phone.length >= 10;
    return true;
  };

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError]   = useState('');

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Last step — call booking API
      if (!selectedServiceId) return;
      setBookingLoading(true);
      setBookingError('');
      const selectedService = services.find(s => s.id === selectedServiceId);
      try {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceId:    selectedServiceId,
            serviceName:  selectedService?.title || 'Permanent Service',
            type:         'MONTHLY',
            scheduledDate: scheduleData.date ? new Date(scheduleData.date).toISOString() : new Date().toISOString(),
            timeSlot:     scheduleData.time,
            baseAmount:   selectedService?.basePrice || 8000,
            phone:        scheduleData.phone,
            shortlistedHelpers,
            requirements,
            specialInstructions: requirements.notes,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setBookingError(data.error || 'Booking failed. Please try again.');
        } else {
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

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-6"
        >
          <div className="w-14 h-14 bg-teal-500 rounded-full flex items-center justify-center shadow-lg">
            <CalendarCheck className="w-7 h-7 text-white" />
          </div>
        </motion.div>

        <h1 className="text-3xl font-bold text-slate-900 mb-4 text-center">
          {t('Interviews Scheduled!', 'इंटरव्यू शेड्यूल हो गए!')}
        </h1>
        <p className="text-slate-500 mb-8 text-center max-w-md">
          {t('We have received your request. Our team will contact you shortly to confirm the interview timings with your shortlisted candidates.', 'हमें आपका अनुरोध मिल गया है। हमारी टीम आपके शॉर्टलिस्ट किए गए उम्मीदवारों के साथ इंटरव्यू का समय पक्का करने के लिए जल्द ही आपसे संपर्क करेगी।')}
        </p>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 w-full max-w-md space-y-4 mb-8">
          <h3 className="font-semibold text-slate-900">{t('Next Steps:', 'अगले कदम:')}</h3>
          <ul className="text-sm text-slate-600 space-y-3">
            <li className="flex gap-2">
              <span className="text-teal-600 font-bold">1.</span> 
              {t('Our executive will call you on ', 'हमारा कार्यकारी आपको कॉल करेगा')} <span className="font-medium text-slate-900">{scheduleData.phone}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-teal-600 font-bold">2.</span> 
              {t('Conduct interviews on your preferred date: ', 'अपनी पसंदीदा तारीख पर इंटरव्यू लें: ')} <span className="font-medium text-slate-900">{scheduleData.date}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-teal-600 font-bold">3.</span> 
              {t('Select a candidate and start the 3-day paid trial', 'एक उम्मीदवार चुनें और 3 दिन का पेड ट्रायल शुरू करें')}
            </li>
          </ul>
        </div>

        <Link href="/">
          <button className="py-3 px-8 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-colors">
            {t('Back to Home', 'होम पर वापस जाएं')}
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-24">
      <div className="max-w-4xl mx-auto px-4">
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{t('Hire Permanent Staff', 'स्थायी कर्मचारी नियुक्त करें')}</h1>
        <p className="text-slate-500 mb-6">{t('Find verified, reliable professionals for your daily needs', 'अपनी दैनिक जरूरतों के लिए सत्यापित, विश्वसनीय पेशेवर खोजें')}</p>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        <div className="bg-transparent min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              
              {currentStep === 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">{t('What role are you hiring for?', 'आप किस भूमिका के लिए काम पर रख रहे हैं?')}</h2>
                  <ServiceSelector 
                    services={services} 
                    category="permanent" 
                    selected={selectedServiceId} 
                    onSelect={setSelectedServiceId} 
                  />
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-6 px-1">{t('Tell us your requirements', 'हमें अपनी आवश्यकताएं बताएं')}</h2>
                  <RequirementsForm 
                    data={requirements}
                    onChange={setRequirements}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <HelperShortlist 
                    helpers={availableHelpers}
                    selectedIds={shortlistedHelpers}
                    onSelect={setShortlistedHelpers}
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 max-w-xl mx-auto">
                  <h2 className="text-xl font-bold text-slate-900 mb-2">{t('Schedule Interviews', 'इंटरव्यू शेड्यूल करें')}</h2>
                  <p className="text-slate-500 mb-6 text-sm">{t('When would you like to speak with the shortlisted candidates?', 'आप शॉर्टलिस्ट किए गए उम्मीदवारों से कब बात करना चाहेंगे?')}</p>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t('Preferred Date', 'पसंदीदा तारीख')} *</label>
                      <input 
                        type="date"
                        value={scheduleData.date}
                        onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t('Preferred Time', 'पसंदीदा समय')} *</label>
                      <input 
                        type="time"
                        value={scheduleData.time}
                        onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t('Your Phone Number', 'आपका फोन नंबर')} *</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 text-slate-500 sm:text-sm">
                          +91
                        </span>
                        <input 
                          type="tel"
                          maxLength={10}
                          value={scheduleData.phone}
                          onChange={(e) => setScheduleData({...scheduleData, phone: e.target.value})}
                          className="flex-1 w-full px-4 py-2 border border-slate-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                          placeholder="9876543210"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 sm:relative sm:bg-transparent sm:border-0 sm:mt-6">
          {bookingError && (
            <div className="px-4 pt-3 text-center text-sm text-red-600 bg-red-50 border-b border-red-100">
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
                {t('Submitting...', 'भेज रहे हैं...')}
              </>
            ) : (
              <>
                {currentStep === steps.length - 1 ? t('Submit Request', 'अनुरोध भेजें') : t('Next', 'आगे')}
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
