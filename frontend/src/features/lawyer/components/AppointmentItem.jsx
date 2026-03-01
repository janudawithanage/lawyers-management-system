/**
 * ══════════════════════════════════════════════════════════════
 * APPOINTMENT ITEM — Lawyer's Daily Schedule Row
 * ══════════════════════════════════════════════════════════════
 *
 * Displays a single appointment in the lawyer's timeline:
 *  • Client name + optional case reference
 *  • Time slot with duration
 *  • Consultation mode (In-Office / Video / Phone)
 *  • Status badge (Confirmed / Pending / Completed / Cancelled)
 *  • Notes preview
 *  • Quick-action button
 */

import { motion } from "framer-motion";
import {
  Video,
  Building2,
  Phone,
  Clock,
  ChevronRight,
  FileText,
} from "lucide-react";
import { formatAppointmentTime } from "../data/mockLawyerData";

const STATUS_CONFIG = {
  confirmed: {
    label: "Confirmed",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  pending: {
    label: "Pending",
    dot: "bg-amber-400 animate-pulse",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  completed: {
    label: "Done",
    dot: "bg-neutral-400",
    text: "text-neutral-400",
    bg: "bg-neutral-500/10",
    border: "border-neutral-500/20",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-red-400",
    text: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
};

const MODE_CONFIG = {
  "in-office": { icon: Building2, label: "In-Office" },
  video: { icon: Video, label: "Video Call" },
  phone: { icon: Phone, label: "Phone" },
};

export default function LawyerAppointmentItem({ appointment, index = 0 }) {
  const status = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.pending;
  const mode = MODE_CONFIG[appointment.mode] || MODE_CONFIG["in-office"];
  const ModeIcon = mode.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.06,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="group flex items-center gap-4 p-4 rounded-xl bg-dark-800/30 border border-white/[0.04] transition-all duration-300 hover:bg-dark-700/40 hover:border-white/[0.08]"
    >
      {/* ── Time Column ──────────────────────────────────── */}
      <div className="flex-shrink-0 w-16 text-center">
        <p className="text-sm font-semibold text-neutral-200">
          {formatAppointmentTime(appointment.dateTime)}
        </p>
        <p className="text-[10px] text-neutral-600 mt-0.5">
          {appointment.duration} min
        </p>
      </div>

      {/* ── Divider Line ─────────────────────────────────── */}
      <div className="flex-shrink-0 w-px h-10 bg-white/[0.06] group-hover:bg-gold-500/20 transition-colors duration-300" />

      {/* ── Mode Icon ────────────────────────────────────── */}
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-dark-700/60 border border-white/[0.06] flex items-center justify-center">
        <ModeIcon className="w-4 h-4 text-neutral-400" />
      </div>

      {/* ── Info ─────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold text-neutral-200 truncate">
            {appointment.clientName}
          </p>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status.bg} ${status.border} ${status.text}`}
          >
            <span className={`w-1 h-1 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        <div className="flex items-center gap-2.5 mt-1">
          <span className="flex items-center gap-1 text-[11px] text-neutral-500">
            <ModeIcon className="w-2.5 h-2.5" />
            {mode.label}
          </span>
          {appointment.caseRef && (
            <span className="flex items-center gap-1 text-[11px] text-neutral-600">
              <FileText className="w-2.5 h-2.5" />
              {appointment.caseRef}
            </span>
          )}
        </div>

        {appointment.notes && (
          <p className="text-[11px] text-neutral-600 mt-1 line-clamp-1">
            {appointment.notes}
          </p>
        )}
      </div>

      {/* ── Action ───────────────────────────────────────── */}
      <button
        className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 bg-dark-700/40 border border-white/[0.06] opacity-0 group-hover:opacity-100 transition-all duration-200 hover:text-gold-400 hover:border-gold-500/20"
        aria-label={`View appointment with ${appointment.clientName}`}
      >
        Details
        <ChevronRight className="w-3 h-3" />
      </button>
    </motion.div>
  );
}
