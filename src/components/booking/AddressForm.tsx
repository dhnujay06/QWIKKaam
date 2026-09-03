"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { Home, Briefcase, MapPin } from 'lucide-react';

export interface AddressData {
  houseNo: string;
  area: string;
  landmark: string;
  city: string;
  pincode: string;
  instructions: string;
  tag: 'Home' | 'Work' | 'Other';
}

interface AddressFormProps {
  data: AddressData;
  onChange: (data: AddressData) => void;
  errors?: Partial<Record<keyof AddressData, boolean>>;
}

export default function AddressForm({ data, onChange, errors = {} }: AddressFormProps) {
  const { t } = useLanguage();

  const updateField = (field: keyof AddressData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('Flat / House No.', 'फ्लैट / मकान नंबर')} *</label>
          <input 
            type="text" 
            value={data.houseNo}
            onChange={(e) => updateField('houseNo', e.target.value)}
            className={cn(
              "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white",
              errors.houseNo ? "border-red-500" : "border-slate-200"
            )}
            placeholder="e.g. 101, A Block"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('Street / Area', 'सड़क / क्षेत्र')} *</label>
          <input 
            type="text" 
            value={data.area}
            onChange={(e) => updateField('area', e.target.value)}
            className={cn(
              "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white",
              errors.area ? "border-red-500" : "border-slate-200"
            )}
            placeholder="e.g. MG Road"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('Landmark', 'लैंडमार्क')} ({t('Optional', 'वैकल्पिक')})</label>
        <input 
          type="text" 
          value={data.landmark}
          onChange={(e) => updateField('landmark', e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white"
          placeholder="e.g. Near Metro Station"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('City', 'शहर')} *</label>
          <select 
            value={data.city}
            onChange={(e) => updateField('city', e.target.value)}
            className={cn(
              "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white",
              errors.city ? "border-red-500" : "border-slate-200"
            )}
          >
            <option value="">{t('Select City', 'शहर चुनें')}</option>
            <option value="Bhilai">Bhilai</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('Pincode', 'पिनकोड')} *</label>
          <input 
            type="text" 
            value={data.pincode}
            onChange={(e) => updateField('pincode', e.target.value)}
            maxLength={6}
            className={cn(
              "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white",
              errors.pincode ? "border-red-500" : "border-slate-200"
            )}
            placeholder="e.g. 490006 (Risali)"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('Special Instructions', 'विशेष निर्देश')} ({t('Optional', 'वैकल्पिक')})</label>
        <textarea 
          value={data.instructions}
          onChange={(e) => updateField('instructions', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-white"
          placeholder="e.g. Ring the bell twice"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{t('Save As', 'इस रूप में सहेजें')}</label>
        <div className="flex gap-3">
          {(['Home', 'Work', 'Other'] as const).map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => updateField('tag', tag)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                data.tag === tag 
                  ? "bg-slate-900 border-slate-900 text-white" 
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
              )}
            >
              {tag === 'Home' && <Home className="w-4 h-4" />}
              {tag === 'Work' && <Briefcase className="w-4 h-4" />}
              {tag === 'Other' && <MapPin className="w-4 h-4" />}
              {tag === 'Home' ? t('Home', 'घर') : tag === 'Work' ? t('Work', 'काम') : t('Other', 'अन्य')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
