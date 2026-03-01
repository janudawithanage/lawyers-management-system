/**
 * ══════════════════════════════════════════════════════════════
 * LAWYER INFO PANEL — Full Profile Sidebar / Section
 * ══════════════════════════════════════════════════════════════
 *
 * Enterprise-grade lawyer profile panel with:
 *  • Large avatar with initials fallback
 *  • Verification badge (gold verified / muted pending)
 *  • Contact info (email, phone, chat)
 *  • Quick stats (experience, cases, success rate)
 *  • Languages spoken
 *  • Office address
 *  • Education
 *  • Bar registration
 *  • Book Appointment CTA
 *  • Smooth entrance animation
 */

import { motion } from "framer-motion";
import {
  BadgeCheck,
  ShieldAlert,
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  Clock,
  Trophy,
  Target,
  Globe,
  GraduationCap,
  Scale,
  Building2,
  ArrowRight,
} from "lucide-react";
import RatingStars from "./RatingStars";

// ── Info Row ─────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, className = "" }) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="w-8 h-8 rounded-lg bg-dark-700/60 border border-white/[0.04] flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-neutral-500" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-neutral-200 break-words">{value}</p>
      </div>
    </div>
  );
}

// ── Stat Card ────────────────────────────────────────────────
function StatCard({ icon: Icon, value, label, accent = false }) {
  return (
    <div className="flex flex-col items-center p-3 rounded-xl bg-dark-900/40 border border-white/[0.04]">
      <Icon className={`w-4 h-4 mb-1.5 ${accent ? "text-gold-400" : "text-neutral-500"}`} />
      <p className={`text-lg font-bold ${accent ? "text-gold-300" : "text-neutral-200"}`}>
        {value}
      </p>
      <p className="text-[9px] text-neutral-500 uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

export default function LawyerInfoPanel({ lawyer, onBook, onChat }) {
  if (!lawyer) return null;

  const getInitials = (name) =>
    name
      .replace(/^Atty\.\s*/, "")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const successRate =
    lawyer.cases_total > 0
      ? Math.round((lawyer.cases_won / lawyer.cases_total) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-6"
    >
      {/* ── Hero Section ── */}
      <div className="relative p-6 rounded-2xl bg-dark-800/50 border border-white/[0.06] overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-gold-500/[0.04] to-transparent pointer-events-none" />

        <div className="relative flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-gold-500/25 to-gold-600/10 border-2 border-gold-500/20 flex items-center justify-center shadow-[0_8px_32px_rgba(198,167,94,0.15)]">
              {lawyer.profile_picture ? (
                <img
                  src={lawyer.profile_picture}
                  alt={lawyer.name}
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-gold-400">
                  {getInitials(lawyer.name)}
                </span>
              )}
            </div>
            {/* Verification badge */}
            <div
              className={`absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                lawyer.verified
                  ? "bg-gold-500/20 border-gold-500/40"
                  : "bg-dark-600 border-neutral-600/40"
              }`}
            >
              {lawyer.verified ? (
                <BadgeCheck className="w-4 h-4 text-gold-400" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-neutral-500" />
              )}
            </div>
          </div>

          {/* Name & Spec */}
          <h2 className="text-xl font-bold text-neutral-100">{lawyer.name}</h2>
          <p className="text-sm text-gold-500/80 font-medium mt-0.5">{lawyer.specialization}</p>

          {/* Verification label */}
          <span
            className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
              lawyer.verified
                ? "bg-gold-500/10 text-gold-400 border border-gold-500/20"
                : "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20"
            }`}
          >
            {lawyer.verified ? (
              <>
                <BadgeCheck className="w-3 h-3" />
                BASL Verified
              </>
            ) : (
              <>
                <ShieldAlert className="w-3 h-3" />
                Pending Verification
              </>
            )}
          </span>

          {/* Rating */}
          <div className="mt-3">
            <RatingStars
              rating={lawyer.rating}
              size="md"
              reviewCount={lawyer.reviews?.length || 0}
            />
          </div>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard icon={Clock} value={`${lawyer.experience}y`} label="Experience" accent />
        <StatCard icon={Trophy} value={lawyer.cases_won} label="Cases Won" />
        <StatCard icon={Target} value={`${successRate}%`} label="Success" />
      </div>

      {/* ── Contact & Details ── */}
      <div className="p-5 rounded-2xl bg-dark-800/40 border border-white/[0.06] space-y-4">
        <h3 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
          Contact & Details
        </h3>
        <InfoRow icon={MapPin} label="District" value={lawyer.district} />
        {lawyer.office_address && (
          <InfoRow icon={Building2} label="Office" value={lawyer.office_address} />
        )}
        {lawyer.email && <InfoRow icon={Mail} label="Email" value={lawyer.email} />}
        {lawyer.phone && <InfoRow icon={Phone} label="Phone" value={lawyer.phone} />}
        {lawyer.education && (
          <InfoRow icon={GraduationCap} label="Education" value={lawyer.education} />
        )}
        {lawyer.bar_registration_number && (
          <InfoRow icon={Scale} label="Bar Registration" value={lawyer.bar_registration_number} />
        )}
      </div>

      {/* ── Languages ── */}
      <div className="p-5 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
        <h3 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-3">
          Languages
        </h3>
        <div className="flex flex-wrap gap-2">
          {lawyer.languages.map((lang) => (
            <span
              key={lang}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-dark-700/50 text-neutral-300 border border-white/[0.04]"
            >
              <Globe className="w-3 h-3 text-gold-400" />
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* ── Consultation Fee ── */}
      <div className="p-5 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider">
              Consultation Fee
            </p>
            <p className="text-2xl font-bold text-neutral-100 mt-0.5">
              LKR {lawyer.consultationFee?.toLocaleString()}
            </p>
          </div>
          <span className="text-[10px] text-neutral-500">per session</span>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="space-y-2">
        <button
          onClick={() => onBook?.(lawyer)}
          disabled={!lawyer.available}
          className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            lawyer.available
              ? "gradient-gold-btn text-dark-950 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/35 hover:brightness-110 cursor-pointer"
              : "bg-dark-600 text-neutral-500 border border-white/[0.06] cursor-not-allowed"
          }`}
        >
          {lawyer.available ? (
            <>
              Book Appointment
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            "Currently Unavailable"
          )}
        </button>

        <button
          onClick={() => onChat?.(lawyer)}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium bg-dark-700/50 text-neutral-300 border border-white/[0.06] hover:bg-dark-600/50 hover:border-white/[0.1] transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          Send Message
        </button>
      </div>
    </motion.div>
  );
}
