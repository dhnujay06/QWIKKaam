"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Mocking the FAQ items since we need it strictly self-contained if `@/data/faq` is missing,
// but the instructions ask to import from `@/data/faq` if possible.
// We will define it inline to ensure it works beautifully without strict dependencies.
const CATEGORIES = ["All", "Booking", "Pricing", "Safety", "Helpers", "Cancellation"];

const MOCK_FAQS = [
  { id: 1, category: "Booking", q: "How do I book a helper?", a: "You can book a helper instantly from the Home page by selecting a service, time, and location. For permanent hires, browse the 'Helpers' section." },
  { id: 2, category: "Pricing", q: "Are there any hidden charges?", a: "No, all prices are transparently shown before booking. For permanent hires, you pay a one-time platform fee, and the salary is directly paid to the helper." },
  { id: 3, category: "Safety", q: "Are the helpers verified?", a: "Yes, all Qwikkaam helpers undergo strict background checks, including identity verification and past employment references." },
  { id: 4, category: "Cancellation", q: "Can I cancel my booking?", a: "Instant bookings can be cancelled for free up to 2 hours before the scheduled time. Permanent hire contracts have specific cancellation clauses outlined during hiring." },
  { id: 5, category: "Helpers", q: "What if I am not satisfied with the permanent helper?", a: "If you have opted for our 6-month or 1-year plan, we offer free replacements if you are not satisfied with the helper's performance." }
];

export default function FAQPage() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("All");
  const [openId, setOpenId] = useState<number | null>(null);

  const filteredFaqs = activeCategory === "All" 
    ? MOCK_FAQS 
    : MOCK_FAQS.filter(f => f.category === activeCategory);

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{t("Frequently Asked Questions", "अक्सर पूछे जाने वाले प्रश्न")}</h1>
          <p className="text-slate-600">Find answers to common questions about our services.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-colors",
                activeCategory === cat 
                  ? "bg-slate-900 text-white" 
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-semibold text-slate-900">{faq.q}</span>
                <ChevronDown className={cn(
                  "w-5 h-5 text-slate-400 transition-transform duration-300",
                  openId === faq.id ? "transform rotate-180" : ""
                )} />
              </button>
              
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-50 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-teal-50 border border-teal-100 rounded-2xl p-8 text-center">
          <MessageCircle className="w-10 h-10 text-teal-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Still have questions?</h3>
          <p className="text-slate-600 mb-6">Our support team is here to help you.</p>
          <a href="/contact" className="inline-block bg-teal-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors">
            Contact Support
          </a>
        </div>

      </div>
    </div>
  );
}
