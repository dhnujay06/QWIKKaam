"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ReviewFormProps {
  helperId: string;
  helperName: string;
  bookingId?: string;
  onSuccess: () => void;
}

export default function ReviewForm({ helperId, helperName, bookingId, onSuccess }: ReviewFormProps) {
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ratingLabels = ["", "Bahut Bura 😞", "Theek Hai 😐", "Acha Tha 🙂", "Bahut Acha 😊", "Excellent! 🌟"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError("Pehle stars select karein"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helperId, bookingId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Review submit nahi hua. Dobara try karein.");
      } else {
        onSuccess();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Star Rating */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          {t(`${helperName} ko rate karein`, `Rate ${helperName}`)}
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="transition-transform hover:scale-110 focus:outline-none"
            >
              <Star
                className={`w-10 h-10 transition-colors ${
                  star <= (hovered || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300"
                }`}
              />
            </button>
          ))}
          {(hovered || rating) > 0 && (
            <span className="text-sm font-medium text-slate-600 ml-2">
              {ratingLabels[hovered || rating]}
            </span>
          )}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {t("Aapka Anubhav (Optional)", "Your Experience (Optional)")}
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={300}
          placeholder={t(
            "Jaise: Bahut mehnat se kaam karti hain, ghar ekdum saaf kiya...",
            "e.g.: Works very hard, cleaned the house perfectly..."
          )}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/40 text-sm resize-none"
        />
        <p className="text-xs text-slate-400 mt-1 text-right">{comment.length}/300</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            {t("Submit ho raha hai...", "Submitting...")}
          </>
        ) : (
          <>
            <Star className="w-4 h-4 fill-white" />
            {t("Review Submit Karo", "Submit Review")}
          </>
        )}
      </button>
    </form>
  );
}
