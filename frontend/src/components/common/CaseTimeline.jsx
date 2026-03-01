/**
 * ══════════════════════════════════════════════════════════════
 * CASE TIMELINE — Premium Visual Timeline for Case Lifecycle
 * ══════════════════════════════════════════════════════════════
 *
 * Renders a vertical timeline showing case progression events.
 * Supports glassmorphism cards, animated entry, and status icons.
 */

import { motion } from "framer-motion";
import {
  FileText,
  MessageSquare,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Clock,
  Briefcase,
  Upload,
  Scale,
  XCircle,
  Gavel,
} from "lucide-react";

const EVENT_ICONS = {
  created: Briefcase,
  payment: CreditCard,
  document: Upload,
  message: MessageSquare,
  hearing: Gavel,
  status_change: Scale,
  completed: CheckCircle,
  warning: AlertTriangle,
  deadline: Clock,
  note: FileText,
  closed: XCircle,
};

const EVENT_COLORS = {
  created: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  payment: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  document: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  message: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  hearing: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  status_change: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  completed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  warning: "text-red-400 bg-red-500/10 border-red-500/20",
  deadline: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  note: "text-neutral-400 bg-neutral-500/10 border-neutral-500/20",
  closed: "text-neutral-500 bg-neutral-500/10 border-neutral-500/20",
};

function formatTimelineDate(timestamp) {
  const d = new Date(timestamp);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-LK", { month: "short", day: "numeric", year: "numeric" });
}

export default function CaseTimeline({ events = [], maxItems = 20, className = "" }) {
  const sortedEvents = [...events]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, maxItems);

  if (sortedEvents.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <Clock className="w-10 h-10 text-neutral-600 mb-3" />
        <p className="text-sm text-neutral-500">No activity yet</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-gold-500/30 via-neutral-700/30 to-transparent" />

      <div className="space-y-1">
        {sortedEvents.map((event, index) => {
          const Icon = EVENT_ICONS[event.type] || FileText;
          const colorClass = EVENT_COLORS[event.type] || EVENT_COLORS.note;
          const [textColor, bgColor, borderColor] = colorClass.split(" ");

          return (
            <motion.div
              key={event.id || index}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="relative flex items-start gap-4 pl-1"
            >
              {/* Icon node */}
              <div
                className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-xl border ${bgColor} ${borderColor} shrink-0`}
              >
                <Icon className={`w-4 h-4 ${textColor}`} />
              </div>

              {/* Content card */}
              <div className="flex-1 pb-4">
                <div className="bg-dark-800/40 backdrop-blur-sm border border-white/[0.04] rounded-xl p-3.5 hover:border-white/[0.08] transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-200 leading-snug">
                        {event.title}
                      </p>
                      {event.description && (
                        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <span className="text-[11px] text-neutral-600 whitespace-nowrap shrink-0">
                      {formatTimelineDate(event.timestamp)}
                    </span>
                  </div>

                  {/* Optional metadata */}
                  {event.metadata && (
                    <div className="flex flex-wrap gap-2 mt-2.5 pt-2.5 border-t border-white/[0.04]">
                      {Object.entries(event.metadata).map(([key, val]) => (
                        <span
                          key={key}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.03] text-[10px] text-neutral-500"
                        >
                          <span className="text-neutral-600">{key}:</span>
                          <span className="text-neutral-400">{val}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
