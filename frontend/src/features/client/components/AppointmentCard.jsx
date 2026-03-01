/**
 * ══════════════════════════════════════════════════════════════
 * APPOINTMENT CARD — Full Appointment Tile
 * ══════════════════════════════════════════════════════════════
 *
 * Enhanced appointment card for My Appointments page:
 *  • Uses shared APPOINTMENT_STATUS_CONFIG from statusEnums
 *  • Consultation type icon
 *  • Date/time formatting
 *  • View / Edit / Cancel actions
 *  • Mobile-responsive layout
 *  • Hover elevation animation
 */

import { motion } from "framer-motion";
import {
  Video,
  Building2,
  Phone,
  Clock,
  MapPin,
  Calendar,
  MoreHorizontal,
  Eye,
  Edit3,
  X,
  StickyNote,
} from "lucide-react";
import { useState } from "react";
import { APPOINTMENT_STATUS_CONFIG, AppointmentStatus } from "@utils/statusEnums";
import StatusBadge from "@components/common/StatusBadge";

const TYPE_CONFIG = {
  video: { icon: Video, label: "Video Call", color: "text-blue-400" },
  "in-office": { icon: Building2, label: "In-Office", color: "text-emerald-400" },
  phone: { icon: Phone, label: "Phone Call", color: "text-purple-400" },
};

export default function AppointmentCard({ appointment, index = 0, onView, onEdit, onCancel }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const statusCfg = APPOINTMENT_STATUS_CONFIG[appointment.status];
  const typeConfig = TYPE_CONFIG[appointment.type || appointment.consultationType] || TYPE_CONFIG.video;
  const TypeIcon = typeConfig.icon;
  const canCancel = [AppointmentStatus.PENDING_APPROVAL, AppointmentStatus.CONFIRMED].includes(appointment.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.07,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="group relative p-5 rounded-2xl bg-dark-800/50 border border-white/[0.06] transition-all duration-300 hover:bg-dark-700/50 hover:border-white/[0.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
    >
      {/* Header: Type Icon + Lawyer + Status + Menu */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dark-700/60 border border-white/[0.06] flex items-center justify-center">
            <TypeIcon className={`w-4.5 h-4.5 ${typeConfig.color}`} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-neutral-100">
              {appointment.lawyerName}
            </h4>
            <p className="text-xs text-neutral-500">{appointment.lawyerSpecialization}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={appointment.status} type="appointment" size="xs" />

          {/* Actions Menu */}
          {canCancel && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 rounded-lg hover:bg-dark-600 transition-colors"
                aria-label="More actions"
              >
                <MoreHorizontal className="w-4 h-4 text-neutral-500" />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    className="absolute right-0 top-full mt-1 z-20 w-40 rounded-xl bg-dark-700 border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden"
                  >
                    <button
                      onClick={() => { onView?.(appointment); setMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-neutral-300 hover:bg-dark-600 hover:text-neutral-100 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Details
                    </button>
                    <button
                      onClick={() => { onEdit?.(appointment); setMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-neutral-300 hover:bg-dark-600 hover:text-neutral-100 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Reschedule
                    </button>
                    <button
                      onClick={() => { onCancel?.(appointment); setMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-xs text-neutral-300">
            {appointment.selectedDate || appointment.dateTime
              ? new Date(appointment.selectedDate || appointment.dateTime).toLocaleDateString("en-LK", { month: "short", day: "numeric" })
              : "—"}
            {appointment.selectedTime && ` • ${appointment.selectedTime}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-xs text-neutral-400">
            {appointment.duration} min
          </span>
        </div>
        <div className="flex items-center gap-2">
          <TypeIcon className={`w-3.5 h-3.5 ${typeConfig.color}`} />
          <span className="text-xs text-neutral-400">{typeConfig.label}</span>
        </div>
        {appointment.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-xs text-neutral-400">{appointment.location}</span>
          </div>
        )}
      </div>

      {/* Notes */}
      {appointment.notes && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-dark-900/40 border border-white/[0.03]">
          <StickyNote className="w-3 h-3 text-neutral-600 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            {appointment.notes}
          </p>
        </div>
      )}
    </motion.div>
  );
}
