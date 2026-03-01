/**
 * ══════════════════════════════════════════════════════════════
 * APPOINTMENT ITEM — Upcoming / Past Appointment Row
 * ══════════════════════════════════════════════════════════════
 *
 * Displays a single appointment with:
 *  • Status badge (Scheduled / Completed / Cancelled)
 *  • Formatted date/time
 *  • Lawyer info with specialization
 *  • Consultation type indicator
 *  • View Details action
 */

import { motion } from "framer-motion";
import {
  Video,
  Building2,
  Phone,
  Clock,
  ChevronRight,
} from "lucide-react";
import { formatAppointmentDate } from "../data/mockClientData";

const STATUS_CONFIG = {
  scheduled: {
    label: "Scheduled",
    dot: "bg-gold-400",
    text: "text-gold-400",
    bg: "bg-gold-500/10",
    border: "border-gold-500/20",
  },
  completed: {
    label: "Completed",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-red-400",
    text: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
};

const TYPE_ICONS = {
  video: Video,
  "in-office": Building2,
  phone: Phone,
};

export default function AppointmentItem({ appointment, index = 0 }) {
  const status = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.scheduled;
  const TypeIcon = TYPE_ICONS[appointment.type] || Clock;

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
      {/* Type Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-dark-700/60 border border-white/[0.06] flex items-center justify-center">
        <TypeIcon className="w-4 h-4 text-neutral-400" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold text-neutral-200 truncate">
            {appointment.lawyerName}
          </p>
          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status.bg} ${status.border} ${status.text}`}
            role="status"
            aria-label={`Status: ${status.label}`}
          >
            <span className={`w-1 h-1 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        <p className="text-xs text-neutral-500">
          {appointment.lawyerSpecialization}
        </p>

        <div className="flex items-center gap-3 mt-1.5">
          <span className="flex items-center gap-1 text-xs text-neutral-400">
            <Clock className="w-3 h-3" />
            {formatAppointmentDate(appointment.dateTime)}
          </span>
          <span className="text-xs text-neutral-600">
            {appointment.duration} min
          </span>
        </div>
      </div>

      {/* Action */}
      <button
        className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 bg-dark-700/40 border border-white/[0.06] opacity-0 group-hover:opacity-100 transition-all duration-200 hover:text-gold-400 hover:border-gold-500/20"
        aria-label={`View details for appointment with ${appointment.lawyerName}`}
      >
        Details
        <ChevronRight className="w-3 h-3" />
      </button>
    </motion.div>
  );
}
