/**
 * ══════════════════════════════════════════════════════════════
 * SUMMARY HEADER — Lawyer Professional Identity Banner
 * ══════════════════════════════════════════════════════════════
 *
 * Displays the lawyer's professional identity at the top of
 * the dashboard, including:
 *  • BASL verification badge (gold verified / amber pending)
 *  • Specialization tags
 *  • District & court assignment
 *  • Years of experience
 *  • Star rating
 *  • Profile completion progress
 */

import { motion } from "framer-motion";
import {
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Star,
  Award,
  Clock,
  Sparkles,
} from "lucide-react";

const VERIFICATION_CONFIG = {
  verified: {
    icon: ShieldCheck,
    label: "BASL Verified",
    color: "text-gold-400",
    bg: "bg-gold-500/10",
    border: "border-gold-500/20",
    dot: "bg-gold-400",
    glow: "shadow-[0_0_12px_rgba(198,167,94,0.15)]",
  },
  pending: {
    icon: ShieldAlert,
    label: "Verification Pending",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    dot: "bg-amber-400 animate-pulse",
    glow: "",
  },
  rejected: {
    icon: ShieldAlert,
    label: "Not Verified",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-400",
    glow: "",
  },
};

export default function SummaryHeader({ profile, greeting, firstName }) {
  const verification =
    VERIFICATION_CONFIG[profile.verificationStatus] ||
    VERIFICATION_CONFIG.pending;
  const VerifyIcon = verification.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
    >
      {/* ── Layered background ─────────────────────────────── */}
      <div className="absolute inset-0 bg-linear-to-br from-dark-800/80 via-dark-800/40 to-dark-900/60 rounded-2xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(198,167,94,0.06)_0%,transparent_60%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold-500/20 to-transparent" />

      <div className="relative z-10">
        {/* Greeting */}
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span className="text-xs font-medium text-gold-400/80 tracking-wide uppercase">
            {greeting}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-50 tracking-tight mb-2">
          Welcome back, {firstName}
        </h1>

        <p className="text-sm text-neutral-400 max-w-lg leading-relaxed mb-5">
          Here's your legal workspace overview. Stay on top of cases,
          appointments, and client requests.
        </p>

        {/* ── Professional Info Row ────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Verification Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${verification.bg} ${verification.border} ${verification.color} ${verification.glow}`}
          >
            <VerifyIcon className="w-3.5 h-3.5" />
            {verification.label}
          </span>

          {/* District */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-400 bg-dark-700/50 border border-white/[0.06]">
            <MapPin className="w-3 h-3 text-neutral-500" />
            {profile.district}
          </span>

          {/* Experience */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-400 bg-dark-700/50 border border-white/[0.06]">
            <Clock className="w-3 h-3 text-neutral-500" />
            {profile.yearsOfExperience} yrs experience
          </span>

          {/* Rating */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gold-400/80 bg-gold-500/[0.06] border border-gold-500/[0.1]">
            <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
            {profile.rating}
            <span className="text-neutral-500">
              ({profile.totalReviews})
            </span>
          </span>
        </div>

        {/* ── Specializations ─────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Award className="w-3.5 h-3.5 text-neutral-500" />
          {profile.specializations.map((spec) => (
            <span
              key={spec}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-neutral-300 bg-dark-700/60 border border-white/[0.06]"
            >
              {spec}
            </span>
          ))}
        </div>

        {/* ── Profile Completion Bar ──────────────────────── */}
        {profile.profileCompletion < 100 && (
          <div className="mt-5 max-w-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-neutral-500 font-medium">
                Profile Completion
              </span>
              <span className="text-[11px] text-gold-400 font-semibold">
                {profile.profileCompletion}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-dark-600/80 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-linear-to-r from-gold-600 via-gold-500 to-gold-400"
                initial={{ width: 0 }}
                animate={{ width: `${profile.profileCompletion}%` }}
                transition={{
                  duration: 0.8,
                  delay: 0.4,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
            </div>
          </div>
        )}

        {/* Gold divider */}
        <div className="mt-5 h-px w-16 bg-linear-to-r from-gold-500/50 to-transparent rounded-full" />
      </div>
    </motion.div>
  );
}
