/**
 * ══════════════════════════════════════════════════════════════
 * CASE CARD — Active Legal Case Tile
 * ══════════════════════════════════════════════════════════════
 *
 * Displays a single case with:
 *  • Case ID + title
 *  • Assigned lawyer
 *  • Status badge (uses shared CASE_STATUS_CONFIG)
 *  • Animated progress bar with gold fill
 *  • Next hearing date
 *  • Last updated timestamp
 */

import { motion } from "framer-motion";
import {
  Scale,
  User,
  Calendar,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import StatusBadge from "@components/common/StatusBadge";

function formatRelativeTime(ts) {
  if (!ts) return "—";
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function CaseCard({ caseData, index = 0 }) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.09,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="group relative p-5 rounded-2xl bg-dark-800/40 border border-white/[0.06] transition-all duration-300 hover:bg-dark-700/40 hover:border-white/[0.1] hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
    >
      {/* Header: Case ID + Status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold-500/[0.08] border border-gold-500/[0.12] flex items-center justify-center">
            <Scale className="w-3.5 h-3.5 text-gold-400" />
          </div>
          <span className="text-[11px] font-mono text-neutral-500">
            {caseData.id}
          </span>
        </div>

        <StatusBadge status={caseData.status} type="case" size="xs" />
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-neutral-100 mb-2 line-clamp-2 group-hover:text-neutral-50 transition-colors">
        {caseData.title}
      </h4>

      {/* Lawyer */}
      <div className="flex items-center gap-1.5 mb-3">
        <User className="w-3 h-3 text-neutral-500" />
        <span className="text-xs text-neutral-400">{caseData.lawyerName}</span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-neutral-500 font-medium">Progress</span>
          <span className="text-[11px] text-gold-400 font-semibold">{caseData.progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-dark-600/80 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-linear-to-r from-gold-600 via-gold-500 to-gold-400"
            initial={{ width: 0 }}
            animate={{ width: `${caseData.progress}%` }}
            transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>

      {/* Meta Row */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
        <div className="flex items-center gap-3">
          {caseData.nextHearing && (
            <span className="flex items-center gap-1 text-[11px] text-neutral-500">
              <Calendar className="w-3 h-3" />
              {new Date(caseData.nextHearing).toLocaleDateString("en-LK", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
          <span className="flex items-center gap-1 text-[11px] text-neutral-600">
            <Clock className="w-3 h-3" />
            {formatRelativeTime(caseData.updatedAt)}
          </span>
        </div>

        <button
          className="flex items-center gap-0.5 text-[11px] font-medium text-neutral-500 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:text-gold-400"
          aria-label={`View case ${caseData.id}`}
        >
          View
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}
