/**
 * ══════════════════════════════════════════════════════════════
 * CASE CARD (FULL) — Extended Case Card for My Cases Page
 * ══════════════════════════════════════════════════════════════
 *
 * Full-featured case card with:
 *  • Expandable details & timeline
 *  • Animated progress bar
 *  • Court & filing info
 *  • Case timeline visualization
 *  • Uses shared StatusBadge
 *  • Smooth expand/collapse animation
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  User,
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  ArrowUpRight,
  CheckCircle2,
  Circle,
  CircleDot,
} from "lucide-react";
import StatusBadge from "@components/common/StatusBadge";
import { CASE_STATUS_CONFIG } from "@utils/statusEnums";

function formatRelativeTime(ts) {
  if (!ts) return "—";
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-LK", { month: "short", day: "numeric", year: "numeric" });
}

const TIMELINE_ICON = {
  completed: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  upcoming: <CircleDot className="w-4 h-4 text-gold-400" />,
  pending: <Circle className="w-4 h-4 text-neutral-600" />,
};

export default function CaseCardFull({ caseData, index = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const statusCfg = CASE_STATUS_CONFIG[caseData.status];

  // Progress bar color derived from status
  const barColor = statusCfg?.color?.includes("emerald")
    ? "from-emerald-600 via-emerald-500 to-emerald-400"
    : statusCfg?.color?.includes("red")
    ? "from-red-600 via-red-500 to-red-400"
    : statusCfg?.color?.includes("neutral")
    ? "from-neutral-600 via-neutral-500 to-neutral-400"
    : "from-gold-600 via-gold-500 to-gold-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
        ease: [0.4, 0, 0.2, 1],
      }}
      layout
      className="group relative rounded-2xl bg-dark-800/50 border border-white/[0.06] transition-all duration-300 hover:bg-dark-700/40 hover:border-white/[0.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden"
    >
      <div className="p-5 sm:p-6">
        {/* Header: Case ID + Status */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gold-500/[0.08] border border-gold-500/[0.12] flex items-center justify-center">
              <Scale className="w-4 h-4 text-gold-400" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-neutral-500">
                {caseData.id}
              </span>
              {caseData.filedDate && (
                <p className="text-[10px] text-neutral-600">
                  Filed: {formatDate(caseData.filedDate)}
                </p>
              )}
            </div>
          </div>

          <StatusBadge status={caseData.status} type="case" size="xs" />
        </div>

        {/* Title */}
        <h4 className="text-base font-semibold text-neutral-100 mb-2 group-hover:text-neutral-50 transition-colors">
          {caseData.title}
        </h4>

        {/* Info Row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <User className="w-3 h-3 text-neutral-500" />
            {caseData.lawyerName}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-neutral-500" />
            {caseData.court}
          </div>
          {caseData.nextHearing && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-neutral-500" />
              Next: {formatDate(caseData.nextHearing)}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-neutral-600" />
            {formatRelativeTime(caseData.updatedAt)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-neutral-500 font-medium">
              Case Progress
            </span>
            <span className="text-[11px] text-gold-400 font-semibold">
              {caseData.progress}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-dark-600/80 overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-linear-to-r ${barColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${caseData.progress}%` }}
              transition={{
                duration: 1,
                delay: 0.3 + index * 0.1,
                ease: [0.4, 0, 0.2, 1],
              }}
            />
          </div>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-gold-400 transition-colors"
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse case details" : "Expand case details"}
        >
          <span>{expanded ? "Hide Details" : "View Details"}</span>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.span>
        </button>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-white/[0.04]">
              {/* Description */}
              <p className="text-sm text-neutral-400 leading-relaxed mb-5">
                {caseData.description}
              </p>

              {/* Timeline */}
              {caseData.timeline && caseData.timeline.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-3">
                    Case Timeline
                  </h5>
                  <div className="space-y-0">
                    {caseData.timeline.map((event, i) => (
                      <div key={i} className="flex gap-3 relative">
                        {/* Timeline Rail */}
                        <div className="flex flex-col items-center flex-shrink-0">
                          {TIMELINE_ICON[event.status]}
                          {i < caseData.timeline.length - 1 && (
                            <div className={`w-px flex-1 min-h-[24px] ${
                              event.status === "completed"
                                ? "bg-emerald-500/30"
                                : "bg-white/[0.06]"
                            }`} />
                          )}
                        </div>

                        {/* Content */}
                        <div className="pb-4 flex-1">
                          <p className={`text-sm font-medium ${
                            event.status === "completed"
                              ? "text-neutral-300"
                              : event.status === "upcoming"
                              ? "text-gold-400"
                              : "text-neutral-500"
                          }`}>
                            {event.event}
                          </p>
                          <p className="text-[11px] text-neutral-600">
                            {event.date ? formatDate(event.date) : "TBD"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
