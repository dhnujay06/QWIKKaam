"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_TESTIMONIALS = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Delhi',
    rating: 5,
    textEn: 'Qwikaam made finding a reliable maid so easy. The background check feature gives me complete peace of mind. Highly recommended!',
    textHi: 'क्विकाम ने एक विश्वसनीय नौकरानी खोजना बहुत आसान बना दिया। पृष्ठभूमि जाँच सुविधा मुझे पूरी मानसिक शांति देती है। अत्यधिक अनुशंसित!',
  },
  {
    id: 2,
    name: 'Rahul Verma',
    location: 'Mumbai',
    rating: 5,
    textEn: 'Booked a deep cleaning service instantly. The professional was on time, well-behaved, and did an excellent job.',
    textHi: 'तुरंत एक गहरी सफाई सेवा बुक की। पेशेवर समय पर था, अच्छी तरह से व्यवहार किया, और बहुत अच्छा काम किया।',
  },
  {
    id: 3,
    name: 'Anjali Desai',
    location: 'Pune',
    rating: 4,
    textEn: 'Found a full-time nanny through Qwikaam. The replacement guarantee is what sold me, though we haven\'t needed it!',
    textHi: 'क्विकाम के माध्यम से एक फुल-टाइम नैनी मिली। प्रतिस्थापन गारंटी ही मुख्य कारण था, हालांकि हमें इसकी आवश्यकता नहीं हुई!',
  }
];

export default function TestimonialsSection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {t('What Our Customers Say', 'हमारे ग्राहक क्या कहते हैं')}
          </h2>
          <p className="text-slate-600 text-lg">
            {t('Don\'t just take our word for it. Hear from thousands of happy households.', 'सिर्फ हमारी बात पर विश्वास न करें। हजारों खुशहाल घरों से सुनें।')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {MOCK_TESTIMONIALS.map((testimonial, idx) => (
            <motion.div 
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-slate-100 rotate-180" />
              
              <div className="flex text-amber-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'fill-current' : 'text-slate-200'}`} />
                ))}
              </div>
              
              <p className="text-slate-700 italic mb-8 relative z-10 leading-relaxed min-h-[100px]">
                "{t(testimonial.textEn, testimonial.textHi)}"
              </p>
              
              <div className="flex items-center mt-auto">
                <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-lg mr-4">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
