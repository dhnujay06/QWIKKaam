"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { helpers as initialHelpers } from '@/data/helpers';
import { services } from '@/data/services';
import { HelperCard } from '@/components/ui/HelperCard';
import { Filter, X, Search, SlidersHorizontal } from 'lucide-react';
import { Helper } from '@/types';

export default function HelpersPage() {
  const { t } = useLanguage();
  const [helpersList, setHelpersList] = useState<Helper[]>(initialHelpers);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetch('/api/helpers')
      .then(res => res.json())
      .then(data => {
        if (data?.helpers && Array.isArray(data.helpers) && data.helpers.length > 0) {
          setHelpersList(data.helpers);
        }
      })
      .catch(err => console.error('Failed to fetch dynamic helpers:', err));
  }, []);

  // Filters state
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('relevance');

  const allCities = Array.from(new Set(helpersList.map(h => h.city)));
  const [selectedCity, setSelectedCity] = useState<string>('All');

  // Filter logic
  const filteredHelpers = useMemo(() => {
    let result = [...helpersList];

    if (searchQuery) {
      result = result.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (selectedServices.length > 0) {
      result = result.filter(h => h.skills.some(skill => selectedServices.includes(skill)));
    }

    if (selectedGender !== 'All') {
      result = result.filter(h => h.gender === selectedGender);
    }

    if (minRating > 0) {
      result = result.filter(h => h.rating >= minRating);
    }

    if (selectedCity !== 'All') {
      result = result.filter(h => h.city === selectedCity);
    }

    // Sort logic
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        result.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case 'experience':
        result.sort((a, b) => b.experience - a.experience);
        break;
      default:
        // relevance - original order
        break;
    }

    return result;
  }, [searchQuery, selectedServices, selectedGender, minRating, selectedCity, sortBy]);

  const toggleService = (title: string) => {
    setSelectedServices(prev => 
      prev.includes(title) ? prev.filter(s => s !== title) : [...prev, title]
    );
  };

  const clearFilters = () => {
    setSelectedServices([]);
    setSelectedGender('All');
    setMinRating(0);
    setSelectedCity('All');
    setSearchQuery('');
  };

  const activeFilterCount = selectedServices.length + (selectedGender !== 'All' ? 1 : 0) + (minRating > 0 ? 1 : 0) + (selectedCity !== 'All' ? 1 : 0);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-slate-900">
              {t('Find Verified House Help', 'सत्यापित घरेलू मदद खोजें')}
            </h1>
            
            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder={t('Search by name...', 'नाम से खोजें...')} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-sm"
                />
              </div>
              <button 
                className="md:hidden flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg text-slate-700 font-medium text-sm"
                onClick={() => setShowMobileFilters(true)}
              >
                <Filter size={18} />
                {activeFilterCount > 0 && (
                  <span className="bg-teal-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className={`
          fixed inset-0 z-30 bg-white md:bg-transparent md:static md:w-64 shrink-0 flex flex-col
          transition-transform duration-300 ${showMobileFilters ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="flex items-center justify-between p-4 md:p-0 border-b border-slate-100 md:border-none md:mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <SlidersHorizontal size={18} /> {t('Filters', 'फ़िल्टर')}
            </h2>
            <button className="md:hidden p-2 text-slate-500" onClick={() => setShowMobileFilters(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="p-4 md:p-0 overflow-y-auto flex-1 space-y-6">
            {/* Services Filter */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">{t('Services', 'सेवाएं')}</h3>
              <div className="space-y-2">
                {services.map(s => (
                  <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded text-teal-600 focus:ring-teal-500"
                      checked={selectedServices.includes(s.title)}
                      onChange={() => toggleService(s.title)}
                    />
                    <span className="text-sm text-slate-700">{s.title}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">{t('Minimum Rating', 'न्यूनतम रेटिंग')}</h3>
              <div className="flex flex-wrap gap-2">
                {[0, 4, 4.5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`px-3 py-1 rounded-full text-sm border ${
                      minRating === rating 
                        ? 'bg-amber-100 border-amber-300 text-amber-800 font-medium' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {rating === 0 ? 'Any' : `${rating}+ Stars`}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Filter */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">{t('Gender', 'लिंग')}</h3>
              <div className="flex gap-2">
                {['All', 'Female', 'Male'].map(gender => (
                  <button
                    key={gender}
                    onClick={() => setSelectedGender(gender)}
                    className={`flex-1 py-1.5 rounded-lg text-sm border ${
                      selectedGender === gender
                        ? 'bg-teal-50 border-teal-200 text-teal-700 font-medium'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t(gender, gender === 'All' ? 'सभी' : gender === 'Male' ? 'पुरुष' : 'महिला')}
                  </button>
                ))}
              </div>
            </div>

            {/* City Filter */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">{t('City', 'शहर')}</h3>
              <select 
                className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 outline-none"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="All">{t('All Cities', 'सभी शहर')}</option>
                {allCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 md:p-0 md:mt-6 border-t border-slate-100 md:border-none">
            <button 
              onClick={clearFilters}
              className="w-full py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200"
            >
              {t('Clear All Filters', 'सभी फ़िल्टर साफ़ करें')}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="text-slate-600 text-sm">
              {t(`Showing ${filteredHelpers.length} verified helpers`, `${filteredHelpers.length} सत्यापित सहायक दिखा रहे हैं`)}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">{t('Sort by:', 'क्रमबद्ध करें:')}</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-none bg-transparent text-sm font-medium text-slate-900 focus:ring-0 cursor-pointer"
              >
                <option value="relevance">{t('Relevance', 'प्रासंगिकता')}</option>
                <option value="rating">{t('Rating (High to Low)', 'रेटिंग (उच्च से निम्न)')}</option>
                <option value="price-low">{t('Price (Low to High)', 'कीमत (निम्न से उच्च)')}</option>
                <option value="experience">{t('Experience', 'अनुभव')}</option>
              </select>
            </div>
          </div>

          {/* Active Filters Chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedServices.map(s => (
                <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs border border-teal-100">
                  {s} <X size={12} className="cursor-pointer hover:text-teal-900" onClick={() => toggleService(s)} />
                </span>
              ))}
              {selectedGender !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs border border-teal-100">
                  {selectedGender} <X size={12} className="cursor-pointer hover:text-teal-900" onClick={() => setSelectedGender('All')} />
                </span>
              )}
            </div>
          )}

          {filteredHelpers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredHelpers.map(helper => (
                <HelperCard key={helper.id} helper={helper} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{t('No helpers found', 'कोई सहायक नहीं मिला')}</h3>
              <p className="text-slate-500 mb-4">{t('Try adjusting your filters or search query.', 'अपने फ़िल्टर या खोज क्वेरी को समायोजित करने का प्रयास करें।')}</p>
              <button 
                onClick={clearFilters}
                className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg font-medium text-sm hover:bg-teal-100"
              >
                {t('Clear Filters', 'फ़िल्टर साफ़ करें')}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Overlay */}
      {showMobileFilters && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 md:hidden"
          onClick={() => setShowMobileFilters(false)}
        />
      )}
    </div>
  );
}
