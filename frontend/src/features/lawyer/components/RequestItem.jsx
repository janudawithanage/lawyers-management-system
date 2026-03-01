/**
 * ══════════════════════════════════════════════════════════════
 * REQUEST ITEM — Client Consultation Request Card
 * ══════════════════════════════════════════════════════════════
 *
 * Displays a pending consultation request from a client:
 *  • Client name + location
 *  • Case type tag
 *  • Message preview (truncated)
 *  • Urgency indicator
 *  • Relative timestamp
 *  • Accept / Decline action buttons
 */

import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Clock,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { formatRelativeTime } from "../data/mockLawyerData";

const URGENCY_CONFIG = {
  urgent: {
    label: "Urgent",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    icon: AlertCircle,
  },
  normal: {
    label: "Normal",
    color: "text-neutral-400",
    bg: "bg-neutral-500/10",
    border: "border-neutral-500/20",
    icon: null,
  },
};

export default function RequestItem({ request, index = 0 }) {
  const urgency = URGENCY_CONFIG[request.urgency] || URGENCY_CONFIG.normal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="group p-4 rounded-xl bg-dark-800/40 border border-white/[0.06] transition-all duration-300 hover:bg-dark-700/40 hover:border-white/[0.1]"
    >
      {/* ── Header Row ───────────────────────────────────── */}
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          {/* Avatar placeholder */}
          <div className="w-9 h-9 rounded-full bg-dark-700/60 border border-white/[0.06] flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-neutral-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-200">
              {request.clientName}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-[11px] text-neutral-500">
                <MapPin className="w-2.5 h-2.5" />
                {request.location}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-neutral-600">
                <Clock className="w-2.5 h-2.5" />
                {formatRelativeTime(request.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Urgency + Case Type */}
        <div className="flex items-center gap-1.5">
          {request.urgency === "urgent" && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${urgency.bg} ${urgency.border} ${urgency.color}`}
            >
              <AlertCircle className="w-2.5 h-2.5" />
              {urgency.label}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-neutral-400 bg-dark-700/60 border border-white/[0.06]">
            {request.caseType}
          </span>
        </div>
      </div>

      {/* ── Message Preview ──────────────────────────────── */}
      <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 mb-4 pl-[46px]">
        "{request.messagePreview}"
      </p>

      {/* ── Actions ──────────────────────────────────────── */}
      <div className="flex items-center gap-2 pl-[46px]">
        <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-dark-950 bg-gold-500 hover:bg-gold-400 transition-colors duration-200 shadow-[0_2px_8px_rgba(198,167,94,0.2)]">
          <Check className="w-3 h-3" />
          Accept
        </button>
        <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-neutral-400 bg-dark-700/60 border border-white/[0.06] hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/10 transition-colors duration-200">
          <X className="w-3 h-3" />
          Decline
        </button>
      </div>
    </motion.div>
  );
}
