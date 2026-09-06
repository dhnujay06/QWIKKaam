"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{t("Contact Us", "हमसे संपर्क करें")}</h1>
          <p className="text-slate-600 text-lg">We'd love to hear from you. Please fill out the form below.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Contact Form */}
          <div className="flex-1 p-8 md:p-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send a Message</h2>
            {submitted ? (
              <div className="bg-teal-50 border border-teal-200 text-teal-800 p-6 rounded-lg text-center">
                <p className="font-semibold text-lg mb-2">Message Sent!</p>
                <p>We will get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-teal-600 underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                    <input type="tel" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <select required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 outline-none">
                    <option value="">Select a subject...</option>
                    <option value="general">General Inquiry</option>
                    <option value="booking">Booking Issue</option>
                    <option value="complaint">Helper Complaint</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                  <textarea rows={5} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 outline-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-teal-600 text-white font-semibold py-3 rounded-lg hover:bg-teal-700 flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" /> Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="flex-1 bg-slate-900 text-white p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-8 text-teal-400">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-teal-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Phone</h3>
                  <p className="text-slate-300">+91 1800-123-4567</p>
                  <p className="text-slate-400 text-sm">Mon-Sat, 9AM to 6PM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-teal-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p className="text-slate-300">support@qwikaam.com</p>
                  <p className="text-slate-400 text-sm">Online support 24/7</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-teal-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Office Address</h3>
                  <p className="text-slate-300">
                    Qwikaam HQ, 4th Floor, Tech Park,<br />
                    Andheri East, Mumbai, 400069<br />
                    Maharashtra, India
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <div className="w-full h-48 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 border border-slate-700">
                [ Map Placeholder ]
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
