/**
 * ══════════════════════════════════════════════════════════════
 * ACTIVITY ITEM — Timeline Feed Entry
 * ══════════════════════════════════════════════════════════════
 *
 * Minimal timeline entry with:
 *  • Gold accent dot on the timeline rail
 *  • Type-based icon
 *  • Relative timestamp
 *  • Clean spacing for scanning
 */

import { motion } from "framer-motion";
import {
  FileText,
  CalendarDays,
  Scale,
  MessageSquare,
  CreditCard,
} from "lucide-react";
import { formatRelativeTime } from "../data/mockClientData";

const TYPE_CONFIG = {
  document: {
    icon: FileText,
    color: "text-blue-400",
    dotColor: "bg-blue-400",
    bg: "bg-blue-500/10",
  },
  appointment: {
    icon: CalendarDays,
    color: "text-gold-400",
    dotColor: "bg-gold-400",
    bg: "bg-gold-500/10",
  },
  case: {
    icon: Scale,
    color: "text-emerald-400",
    dotColor: "bg-emerald-400",
    bg: "bg-emerald-500/10",
  },
  message: {
    icon: MessageSquare,
    color: "text-purple-400",
    dotColor: "bg-purple-400",
    bg: "bg-purple-500/10",
  },
  payment: {
    icon: CreditCard,
    color: "text-amber-400",
    dotColor: "bg-amber-400",
    bg: "bg-amber-500/10",
  },
};

export default function ActivityItem({ activity, index = 0, isLast = false }) {
  const config = TYPE_CONFIG[activity.type] || TYPE_CONFIG.document;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="relative flex gap-4 group"
    >
      {/* Timeline Rail */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Dot */}
        <div className={`w-2 h-2 rounded-full mt-2 ring-[3px] ring-dark-900 ${config.dotColor}`} />
        {/* Line */}
        {!isLast && (
          <div className="w-px flex-1 bg-white/[0.04] mt-1" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-6 ${isLast ? "pb-0" : ""}`}>
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${config.bg}`}>
            <Icon className={`w-3.5 h-3.5 ${config.color}`} />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-neutral-200">
                {activity.title}
              </p>
              <span className="flex-shrink-0 text-[11px] text-neutral-600">
                {formatRelativeTime(activity.timestamp)}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">
              {activity.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
