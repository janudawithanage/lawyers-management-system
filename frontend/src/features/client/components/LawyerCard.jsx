/**
 * ══════════════════════════════════════════════════════════════
 * LAWYER CARD — Search Results Tile
 * ══════════════════════════════════════════════════════════════
 *
 * Enterprise-grade lawyer card with:
 *  • Avatar with initials fallback
 *  • Verified badge with gold accent
 *  • Star rating display
 *  • Specialization & district info
 *  • Experience & cases won stats
 *  • Consultation fee display
 *  • Book Appointment CTA
 *  • Hover elevation with gold glow
 *  • Staggered entrance animation
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  BadgeCheck,
  Briefcase,
  Trophy,
  Clock,
  Globe,
  ArrowRight,
} from "lucide-react";

const getInitials = (name) => {
  return name
    .replace(/^Atty\.\s*/, "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export default function LawyerCard({ lawyer, index = 0, onBook }) {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Don't navigate if clicking the Book button
    if (e.target.closest("[data-book-btn]")) return;
    navigate(`/dashboard/client/find-lawyer/${lawyer.lawyer_id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
        ease: [0.4, 0, 0.2, 1],
      }}
      onClick={handleCardClick}
      className="group relative flex flex-col p-6 rounded-2xl bg-dark-800/50 border border-white/[0.06] backdrop-blur-sm cursor-pointer transition-all duration-300 hover:bg-dark-700/50 hover:border-gold-500/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35),0_0_0_1px_rgba(198,167,94,0.1)] hover:-translate-y-0.5"
    >
      {/* Gold accent line */}
      <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-gold-500/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Top Section: Avatar + Info */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-gold-500/20 to-gold-600/10 border border-gold-500/20 flex items-center justify-center overflow-hidden">
            {lawyer.profile_picture ? (
              <img
                src={lawyer.profile_picture}
                alt={lawyer.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="text-lg font-bold text-gold-400">
                {getInitials(lawyer.name)}
              </span>
            )}
          </div>
          {lawyer.verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-dark-800 border border-gold-500/30 flex items-center justify-center">
              <BadgeCheck className="w-3.5 h-3.5 text-gold-400" />
            </div>
          )}
          {!lawyer.available && (
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-neutral-500 border-2 border-dark-800" />
          )}
        </div>

        {/* Name & Specialization */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-base font-semibold text-neutral-100 truncate group-hover:text-gold-300 transition-colors duration-200">
              {lawyer.name}
            </h3>
          </div>
          <p className="text-sm text-gold-500/80 font-medium mb-1">
            {lawyer.specialization}
          </p>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-neutral-500" />
            <span className="text-xs text-neutral-400">{lawyer.district}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.floor(lawyer.rating)
                  ? "text-gold-400 fill-gold-400"
                  : i < lawyer.rating
                  ? "text-gold-400 fill-gold-400/50"
                  : "text-dark-400"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-semibold text-neutral-200">
          {lawyer.rating}
        </span>
        <span className="text-[11px] text-neutral-500">
          ({lawyer.cases_won} cases)
        </span>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-xl bg-dark-900/50 border border-white/[0.03]">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Clock className="w-3 h-3 text-neutral-500" />
          </div>
          <p className="text-sm font-bold text-neutral-200">{lawyer.experience}</p>
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Years</p>
        </div>
        <div className="text-center border-x border-white/[0.04]">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Trophy className="w-3 h-3 text-neutral-500" />
          </div>
          <p className="text-sm font-bold text-neutral-200">{lawyer.cases_won}</p>
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Won</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Globe className="w-3 h-3 text-neutral-500" />
          </div>
          <p className="text-sm font-bold text-neutral-200">{lawyer.languages.length}</p>
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Lang</p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-xs text-neutral-500 leading-relaxed mb-4 line-clamp-2">
        {lawyer.bio}
      </p>

      {/* Footer: Fee + CTA */}
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/[0.04]">
        <div>
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Consultation</p>
          <p className="text-base font-bold text-neutral-100">
            LKR {lawyer.consultationFee?.toLocaleString()}
          </p>
        </div>

        <button
          data-book-btn
          onClick={() => onBook?.(lawyer)}
          disabled={!lawyer.available}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            lawyer.available
              ? "gradient-gold-btn text-dark-950 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/35 hover:brightness-110 cursor-pointer"
              : "bg-dark-600 text-neutral-500 border border-white/[0.06] cursor-not-allowed"
          }`}
        >
          {lawyer.available ? "Book Now" : "Unavailable"}
          {lawyer.available && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </div>
    </motion.div>
  );
}
