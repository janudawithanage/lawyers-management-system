/**
 * ══════════════════════════════════════════════════════════════
 * RATING STARS — Reusable Star Rating Display
 * ══════════════════════════════════════════════════════════════
 *
 * Enterprise-grade star rating component with:
 *  • Fractional star support (half-star fill)
 *  • Configurable size (sm / md / lg)
 *  • Gold-accent theming
 *  • Optional numeric label
 *  • Optional review count
 *  • Accessible aria-label
 *  • Reduced motion friendly (no animations)
 */

import { Star } from "lucide-react";

const SIZE_MAP = {
  sm: { star: "w-3 h-3", text: "text-xs", gap: "gap-0.5" },
  md: { star: "w-4 h-4", text: "text-sm", gap: "gap-0.5" },
  lg: { star: "w-5 h-5", text: "text-base", gap: "gap-1" },
};

export default function RatingStars({
  rating = 0,
  maxStars = 5,
  size = "md",
  showValue = true,
  reviewCount = null,
  className = "",
}) {
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <div
      className={`inline-flex items-center ${sizeConfig.gap} ${className}`}
      role="img"
      aria-label={`Rating: ${rating} out of ${maxStars} stars`}
    >
      {/* Star icons */}
      <div className={`flex items-center ${sizeConfig.gap}`}>
        {[...Array(maxStars)].map((_, i) => {
          const filled = i < Math.floor(rating);
          const halfFilled = !filled && i < rating;

          return (
            <Star
              key={i}
              className={`${sizeConfig.star} ${
                filled
                  ? "text-gold-400 fill-gold-400"
                  : halfFilled
                  ? "text-gold-400 fill-gold-400/50"
                  : "text-dark-400"
              }`}
            />
          );
        })}
      </div>

      {/* Numeric value */}
      {showValue && (
        <span className={`${sizeConfig.text} font-semibold text-neutral-200 ml-1`}>
          {rating.toFixed(1)}
        </span>
      )}

      {/* Review count */}
      {reviewCount !== null && (
        <span className={`${sizeConfig.text} text-neutral-500 ml-0.5`}>
          ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
        </span>
      )}
    </div>
  );
}
