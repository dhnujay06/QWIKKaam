"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2, MessageCircle } from "lucide-react";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";

const ContactMap = dynamic(() => import("@/components/ui/ContactMap"), { ssr: false });

export default function ContactPage() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      name:    fd.get("name")    as string,
      phone:   fd.get("phone")   as string,
      email:   fd.get("email")   as string,
      subject: fd.get("subject") as string,
      message: fd.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
        formRef.current?.reset();
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            {t("Contact Us", "हमसे संपर्क करें")}
          </h1>
          <p className="text-slate-600 text-lg">
            {t(
              "We'd love to hear from you. Fill out the form and we'll get back within 24 hours.",
              "हम आपसे सुनना चाहते हैं। फॉर्म भरें और हम 24 घंटे में जवाब देंगे।"
            )}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">

          {/* ── Contact Form ── */}
          <div className="flex-1 p-8 md:p-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {t("Send a Message", "संदेश भेजें")}
            </h2>

            {submitted ? (
              <div className="bg-teal-50 border border-teal-200 text-teal-800 p-8 rounded-xl text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-teal-500 mx-auto" />
                <p className="font-semibold text-lg">
                  {t("Message Sent! 🎉", "संदेश भेज दिया गया! 🎉")}
                </p>
                <p className="text-sm text-teal-700">
                  {t(
                    "We will get back to you within 24 hours. You may also reach us on WhatsApp.",
                    "हम 24 घंटे में आपसे संपर्क करेंगे। आप WhatsApp पर भी हम तक पहुँच सकते हैं।"
                  )}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-teal-600 underline text-sm hover:text-teal-800 transition-colors"
                >
                  {t("Send another message", "एक और संदेश भेजें")}
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {t("Name", "नाम")} *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      required
                      placeholder={t("Your full name", "आपका पूरा नाम")}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {t("Phone", "फ़ोन")} *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t("Email", "ईमेल")} *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t("Subject", "विषय")} *
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow bg-white"
                  >
                    <option value="">{t("Select a subject...", "विषय चुनें...")}</option>
                    <option value="General Inquiry">{t("General Inquiry", "सामान्य पूछताछ")}</option>
                    <option value="Booking Issue">{t("Booking Issue", "बुकिंग समस्या")}</option>
                    <option value="Helper Complaint">{t("Helper Complaint", "हेल्पर शिकायत")}</option>
                    <option value="Partnership">{t("Partnership", "पार्टनरशिप")}</option>
                    <option value="Other">{t("Other", "अन्य")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t("Message", "संदेश")} *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    placeholder={t("Describe your query in detail...", "अपना सवाल विस्तार से लिखें...")}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow resize-none"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                    ⚠️ {error}
                  </div>
                )}

                <button
                  id="contact-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 text-white font-semibold py-3 rounded-lg hover:bg-teal-700 active:scale-95 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> {t("Sending...", "भेज रहे हैं...")}</>
                  ) : (
                    <><Send className="w-5 h-5" /> {t("Send Message", "संदेश भेजें")}</>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* ── Contact Info + Map ── */}
          <div className="flex-1 bg-slate-900 text-white p-8 md:p-12 flex flex-col">
            <h2 className="text-2xl font-bold mb-8 text-teal-400">
              {t("Contact Information", "संपर्क जानकारी")}
            </h2>

            <div className="space-y-6 flex-1">
              <a
                href="tel:+911800123456"
                className="flex items-start gap-4 group"
              >
                <Phone className="w-6 h-6 text-teal-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-semibold text-lg">{t("Phone / WhatsApp", "फ़ोन / WhatsApp")}</h3>
                  <p className="text-slate-300 group-hover:text-teal-300 transition-colors">+91 98765-43210</p>
                  <p className="text-slate-400 text-sm">{t("Mon–Sat, 9 AM to 7 PM", "सोम–शनि, सुबह 9 से शाम 7 बजे")}</p>
                </div>
              </a>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group"
              >
                <MessageCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-semibold text-lg">WhatsApp</h3>
                  <p className="text-slate-300 group-hover:text-green-300 transition-colors">
                    {t("Chat with us directly", "सीधे हमसे बात करें")}
                  </p>
                  <p className="text-slate-400 text-sm">{t("Typically replies in minutes", "आमतौर पर मिनटों में जवाब")}</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-teal-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p className="text-slate-300">support@qwikkaam.com</p>
                  <p className="text-slate-400 text-sm">{t("Online support 24/7", "24/7 ऑनलाइन सहायता")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-teal-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">{t("Office Address", "कार्यालय पता")}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Qwikkaam HQ, Risali Sector,<br />
                    Bhilai, Chhattisgarh — 490006<br />
                    India
                  </p>
                </div>
              </div>
            </div>

            {/* Live Leaflet Map */}
            <div className="mt-8">
              <ContactMap />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
