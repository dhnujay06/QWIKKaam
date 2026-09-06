"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import ReviewForm from "./ReviewForm";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  customer: { name: string; avatar: string | null };
}

interface ReviewSectionProps {
  helperId: string;
  helperName: string;
  averageRating: number;
  totalReviews: number;
}

function StarDisplay({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${cls} ${
            star <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Aaj";
  if (days === 1) return "Kal";
  if (days < 30) return `${days} din pehle`;
  if (days < 365) return `${Math.floor(days / 30)} mahine pehle`;
  return `${Math.floor(days / 365)} saal pehle`;
}

export default function ReviewSection({
  helperId, helperName, averageRating, totalReviews,
}: ReviewSectionProps) {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Rating distribution
  const [currentAvg, setCurrentAvg] = useState(averageRating);
  const [currentTotal, setCurrentTotal] = useState(totalReviews);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?helperId=${helperId}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch {
      console.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [helperId]);

  const handleReviewSuccess = () => {
    setSubmitted(true);
    setShowForm(false);
    fetchReviews();
    setCurrentTotal((p) => p + 1);
  };

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          {t("Ratings & Reviews", "रेटिंग और समीक्षाएं")}
        </h2>

        <div className="flex gap-8 items-center">
          {/* Big rating number */}
          <div className="text-center flex-shrink-0">
            <div className="text-5xl font-bold text-slate-900">
              {currentAvg > 0 ? currentAvg.toFixed(1) : "—"}
            </div>
            <StarDisplay rating={currentAvg} size="md" />
            <div className="text-sm text-slate-500 mt-1">
              {currentTotal} {t("reviews", "समीक्षाएं")}
            </div>
          </div>

          {/* Bar chart */}
          <div className="flex-1 space-y-1.5">
            {ratingCounts.map(({ star, count }) => {
              const pct = currentTotal > 0 ? (count / currentTotal) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500 w-3">{star}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-slate-400 w-4 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Write review button */}
        {!showForm && !submitted && (
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 w-full flex items-center justify-center gap-2 border-2 border-dashed border-amber-300 hover:border-amber-400 text-amber-600 hover:text-amber-700 font-semibold py-3 rounded-xl transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            {t("Review Likho", "Write a Review")}
          </button>
        )}

        {/* Success message */}
        {submitted && (
          <div className="mt-5 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 flex items-center gap-2 text-sm font-medium">
            <ThumbsUp className="w-4 h-4" />
            {t("Shukriya! Aapka review submit ho gaya.", "Thank you! Your review has been submitted.")}
          </div>
        )}

        {/* Review form */}
        {showForm && (
          <div className="mt-5 pt-5 border-t border-slate-100">
            <ReviewForm
              helperId={helperId}
              helperName={helperName}
              onSuccess={handleReviewSuccess}
            />
            <button
              onClick={() => setShowForm(false)}
              className="mt-3 w-full text-slate-400 hover:text-slate-600 text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center text-slate-400 py-8">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-slate-500 text-sm">
            {t("Abhi tak koi review nahi hai. Pehle review likhein!", "No reviews yet. Be the first to review!")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-start gap-3">
                {/* Customer avatar */}
                <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {review.customer.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="font-semibold text-slate-900 text-sm">
                      {review.customer.name}
                    </span>
                    <span className="text-xs text-slate-400">{timeAgo(review.createdAt)}</span>
                  </div>
                  <StarDisplay rating={review.rating} />
                  {review.comment && (
                    <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                      "{review.comment}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
