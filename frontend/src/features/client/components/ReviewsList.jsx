/**
 * ══════════════════════════════════════════════════════════════
 * REVIEWS LIST — Lawyer Reviews Feed
 * ══════════════════════════════════════════════════════════════
 *
 * Premium review list component with:
 *  • Client avatar (initials fallback)
 *  • Star rating per review
 *  • Relative date display
 *  • Staggered entrance animation
 *  • Empty state
 *  • Rating summary bar
 *  • Show more / less toggle
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import RatingStars from "./RatingStars";

// ── Rating Distribution Bar ──────────────────────────────────
function RatingBar({ stars, count, total }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-neutral-400 w-3 text-right">{stars}</span>
      <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
      <div className="flex-1 h-1.5 rounded-full bg-dark-600/60 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: (5 - stars) * 0.08, ease: [0.4, 0, 0.2, 1] }}
          className="h-full rounded-full bg-linear-to-r from-gold-600 to-gold-400"
        />
      </div>
      <span className="text-[10px] text-neutral-500 w-6 text-right">{count}</span>
    </div>
  );
}

// ── Single Review Card ───────────────────────────────────────
function ReviewCard({ review, index }) {
  const initials = review.client_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / 86400000);
    if (diffDays < 1) return "Today";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString("en-LK", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.06,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="flex gap-3 p-4 rounded-xl bg-dark-900/30 border border-white/[0.04] hover:border-white/[0.06] transition-colors"
    >
      {/* Client Avatar */}
      <div className="w-9 h-9 rounded-xl bg-dark-600/60 border border-white/[0.06] flex items-center justify-center flex-shrink-0">
        <span className="text-[10px] font-bold text-neutral-400">{initials}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-200">{review.client_name}</span>
            <RatingStars rating={review.rating} size="sm" showValue={false} />
          </div>
          <span className="text-[10px] text-neutral-600 flex-shrink-0">
            {formatDate(review.date)}
          </span>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">{review.comment}</p>
      </div>
    </motion.div>
  );
}

export default function ReviewsList({ reviews = [], rating = 0 }) {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 3;
  const displayedReviews = showAll ? reviews : reviews.slice(0, INITIAL_COUNT);

  // ── Rating Distribution ────────────────────────────────────
  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => Math.round(r.rating) === stars).length,
  }));

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <div className="w-14 h-14 rounded-2xl bg-dark-700/50 border border-white/[0.06] flex items-center justify-center mb-3">
          <MessageSquare className="w-6 h-6 text-neutral-600" />
        </div>
        <h4 className="text-sm font-semibold text-neutral-400 mb-1">No reviews yet</h4>
        <p className="text-xs text-neutral-500 text-center max-w-xs">
          Be the first to leave a review after your consultation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Rating Summary */}
      <div className="flex flex-col sm:flex-row gap-6 p-5 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
        {/* Aggregate Score */}
        <div className="flex flex-col items-center justify-center sm:min-w-[120px]">
          <p className="text-4xl font-bold text-neutral-100">{rating.toFixed(1)}</p>
          <RatingStars rating={rating} size="sm" showValue={false} className="mt-1" />
          <p className="text-[11px] text-neutral-500 mt-1">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Distribution Bars */}
        <div className="flex-1 space-y-1.5">
          {ratingCounts.map(({ stars, count }) => (
            <RatingBar key={stars} stars={stars} count={count} total={reviews.length} />
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {displayedReviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* Show More / Less */}
      {reviews.length > INITIAL_COUNT && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium text-neutral-400 bg-dark-800/30 border border-white/[0.04] hover:text-neutral-200 hover:border-white/[0.08] transition-all"
        >
          {showAll ? (
            <>
              Show less <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Show all {reviews.length} reviews <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
