/**
 * ══════════════════════════════════════════════════════════════
 * CASE TABLE — Professional Cases Management View
 * ══════════════════════════════════════════════════════════════
 *
 * Enterprise-grade table displaying active legal cases:
 *  • Desktop: Full table with sticky header
 *  • Mobile: Stacked card layout
 *  • Status badges with colour-coded indicators
 *  • Priority flags
 *  • Hover row highlight with quick-action buttons
 *  • Framer Motion row entrance animation
 *
 * Columns: Case ID | Client | Type | Status | Priority | Next Hearing | Actions
 */

import { motion } from "framer-motion";
import {
  Scale,
  ExternalLink,
  MoreHorizontal,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { formatShortDate, formatRelativeTime } from "../data/mockLawyerData";

// ── Status Configuration ─────────────────────────────────────

const STATUS_CONFIG = {
  filed: {
    label: "Filed",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    dot: "bg-blue-400",
  },
  hearing_scheduled: {
    label: "Hearing Set",
    color: "text-gold-400",
    bg: "bg-gold-500/10",
    border: "border-gold-500/20",
    dot: "bg-gold-400",
  },
  in_progress: {
    label: "In Progress",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  closed: {
    label: "Closed",
    color: "text-neutral-400",
    bg: "bg-neutral-500/10",
    border: "border-neutral-500/20",
    dot: "bg-neutral-400",
  },
};

const PRIORITY_CONFIG = {
  high: {
    label: "High",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  medium: {
    label: "Med",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  low: {
    label: "Low",
    color: "text-neutral-400",
    bg: "bg-neutral-500/10",
    border: "border-neutral-500/20",
  },
};

// ── Desktop Table Row ────────────────────────────────────────

function CaseRow({ caseData, index }) {
  const status = STATUS_CONFIG[caseData.status] || STATUS_CONFIG.filed;
  const priority = PRIORITY_CONFIG[caseData.priority] || PRIORITY_CONFIG.low;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.06,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="group border-b border-white/[0.04] last:border-0 hover:bg-dark-700/30 transition-colors duration-200"
    >
      {/* Case ID */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold-500/[0.08] border border-gold-500/[0.12] flex items-center justify-center flex-shrink-0">
            <Scale className="w-3.5 h-3.5 text-gold-400" />
          </div>
          <span className="text-xs font-mono text-neutral-400">
            {caseData.id}
          </span>
        </div>
      </td>

      {/* Client */}
      <td className="py-3.5 px-4">
        <p className="text-sm font-medium text-neutral-200">
          {caseData.clientName}
        </p>
      </td>

      {/* Type */}
      <td className="py-3.5 px-4">
        <span className="text-xs text-neutral-400">{caseData.caseType}</span>
      </td>

      {/* Status */}
      <td className="py-3.5 px-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status.bg} ${status.border} ${status.color}`}
        >
          <span className={`w-1 h-1 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </td>

      {/* Priority */}
      <td className="py-3.5 px-4">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${priority.bg} ${priority.border} ${priority.color}`}
        >
          {caseData.priority === "high" && (
            <AlertTriangle className="w-2.5 h-2.5" />
          )}
          {priority.label}
        </span>
      </td>

      {/* Next Hearing */}
      <td className="py-3.5 px-4">
        {caseData.nextHearing ? (
          <span className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Calendar className="w-3 h-3 text-neutral-500" />
            {formatShortDate(caseData.nextHearing)}
          </span>
        ) : (
          <span className="text-xs text-neutral-600">—</span>
        )}
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            className="p-1.5 rounded-lg text-neutral-400 hover:text-gold-400 hover:bg-gold-500/10 transition-colors"
            aria-label={`View case ${caseData.id}`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-dark-600/60 transition-colors"
            aria-label={`More actions for ${caseData.id}`}
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

// ── Mobile Card ──────────────────────────────────────────────

function CaseMobileCard({ caseData, index }) {
  const status = STATUS_CONFIG[caseData.status] || STATUS_CONFIG.filed;
  const priority = PRIORITY_CONFIG[caseData.priority] || PRIORITY_CONFIG.low;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="group p-4 rounded-xl bg-dark-800/40 border border-white/[0.06] transition-all duration-300 hover:bg-dark-700/40 hover:border-white/[0.1]"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gold-500/[0.08] border border-gold-500/[0.12] flex items-center justify-center">
            <Scale className="w-3 h-3 text-gold-400" />
          </div>
          <span className="text-[11px] font-mono text-neutral-500">
            {caseData.id}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${priority.bg} ${priority.border} ${priority.color}`}
          >
            {priority.label}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status.bg} ${status.border} ${status.color}`}
          >
            <span className={`w-1 h-1 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>
      </div>

      {/* Client + Type */}
      <p className="text-sm font-semibold text-neutral-200 mb-0.5">
        {caseData.clientName}
      </p>
      <p className="text-xs text-neutral-500 mb-3">{caseData.caseType}</p>

      {/* Meta */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
        <div className="flex items-center gap-3">
          {caseData.nextHearing && (
            <span className="flex items-center gap-1 text-[11px] text-neutral-500">
              <Calendar className="w-3 h-3" />
              {formatShortDate(caseData.nextHearing)}
            </span>
          )}
          <span className="text-[11px] text-neutral-600">
            {formatRelativeTime(caseData.updatedAt)}
          </span>
        </div>
        <button
          className="p-1.5 rounded-lg text-neutral-400 hover:text-gold-400 hover:bg-gold-500/10 transition-colors"
          aria-label={`View case ${caseData.id}`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export default function CaseTable({ cases }) {
  if (!cases || cases.length === 0) return null;

  return (
    <>
      {/* ── Desktop Table ────────────────────────────────── */}
      <div className="hidden md:block rounded-2xl bg-dark-800/30 border border-white/[0.04] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Case ID", "Client", "Type", "Status", "Priority", "Next Hearing", ""].map(
                  (heading) => (
                    <th
                      key={heading || "actions"}
                      className="py-3 px-4 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {cases.map((c, i) => (
                <CaseRow key={c.id} caseData={c} index={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile Cards ─────────────────────────────────── */}
      <div className="md:hidden space-y-3">
        {cases.map((c, i) => (
          <CaseMobileCard key={c.id} caseData={c} index={i} />
        ))}
      </div>
    </>
  );
}
