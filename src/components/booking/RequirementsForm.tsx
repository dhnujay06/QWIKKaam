"use client";

import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

export interface RequirementsData {
  bhk: string;
  familySize: number;
  diet: string;
  timing: string;
  languages: string[];
  notes: string;
}

interface RequirementsFormProps {
  data: RequirementsData;
  onChange: (data: RequirementsData) => void;
}

export default function RequirementsForm({ data, onChange }: RequirementsFormProps) {
  const { t } = useLanguage();

  const updateField = (field: keyof RequirementsData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const toggleLanguage = (lang: string) => {
    if (data.languages.includes(lang)) {
      updateField('languages', data.languages.filter(l => l !== lang));
    } else {
      updateField('languages', [...data.languages, lang]);
    }
  };

  return (
    <div className="space-y-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      
      {/* BHK Size */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">{t('House Size', 'घर का आकार')}</h3>
        <div className="flex flex-wrap gap-3">
          {['1BHK', '2BHK', '3BHK', '4BHK+', 'Villa'].map(size => (
            <button
              key={size}
              type="button"
              onClick={() => updateField('bhk', size)}
              className={cn(
                "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                data.bhk === size
                  ? "bg-teal-600 border-teal-600 text-white"
                  : "bg-white border-slate-200 text-slate-700 hover:border-teal-300"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Family Size */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">{t('Family Size', 'परिवार का आकार')}</h3>
          <input
            type="number"
            min="1"
            max="20"
            value={data.familySize || ''}
            onChange={(e) => updateField('familySize', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            placeholder="e.g. 4"
          />
        </div>

        {/* Diet */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">{t('Diet Preference', 'आहार प्राथमिकता')}</h3>
          <div className="flex gap-3">
            {['Veg', 'Non-Veg', 'Both'].map(diet => (
              <button
                key={diet}
                type="button"
                onClick={() => updateField('diet', diet)}
                className={cn(
                  "flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all text-center",
                  data.diet === diet
                    ? "bg-amber-500 border-amber-500 text-white"
                    : "bg-white border-slate-200 text-slate-700 hover:border-amber-300"
                )}
              >
                {diet === 'Veg' ? t('Veg', 'शाकाहारी') : diet === 'Non-Veg' ? t('Non-Veg', 'मांसाहारी') : t('Both', 'दोनों')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timing */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">{t('Preferred Timing', 'पसंदीदा समय')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { id: 'Morning', label: 'Morning (7-9 AM)' },
            { id: 'Day', label: 'Day (9AM-6PM)' },
            { id: 'Evening', label: 'Evening (6-8 PM)' },
            { id: 'Full Day', label: 'Full Day (8-12 hrs)' },
            { id: 'Live-in', label: 'Live-in (24 hrs)' }
          ].map(timing => (
            <button
              key={timing.id}
              type="button"
              onClick={() => updateField('timing', timing.id)}
              className={cn(
                "px-3 py-2 rounded-lg border text-sm font-medium transition-all text-left",
                data.timing === timing.id
                  ? "bg-slate-900 border-slate-900 text-white"
                  : "bg-white border-slate-200 text-slate-700 hover:border-slate-400"
              )}
            >
              {timing.label}
            </button>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">{t('Preferred Languages', 'पसंदीदा भाषाएं')}</h3>
        <div className="flex flex-wrap gap-2">
          {['Hindi', 'English', 'Kannada', 'Tamil', 'Telugu', 'Marathi', 'Bengali'].map(lang => (
            <label key={lang} className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={data.languages.includes(lang)}
                onChange={() => toggleLanguage(lang)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-slate-700">{lang}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">{t('Additional Requirements', 'अतिरिक्त आवश्यकताएं')}</h3>
        <textarea
          value={data.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none"
          placeholder={t('Any specific instructions or requirements...', 'कोई विशिष्ट निर्देश या आवश्यकताएं...')}
        />
      </div>

    </div>
  );
}
