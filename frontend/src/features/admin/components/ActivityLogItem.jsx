/**
 * ══════════════════════════════════════════════════════════════
 * ACTIVITY LOG ITEM — System Audit Trail Row
 * ══════════════════════════════════════════════════════════════
 *
 * Displays a single system activity log entry in a timeline:
 *  • Type indicator (Verification / Suspension / Login / System)
 *  • Severity indicator (Info / Warning / Critical)
 *  • Admin name who performed the action
 *  • Action description
 *  • Relative timestamp
 *
 * Part of the governance audit trail — all actions are logged
 * for compliance and accountability.
 */

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Ban,
  LogIn,
  Settings,
  RefreshCw,
  AlertTriangle,
  Info,
  AlertCircle,
  User,
  Clock,
} from "lucide-react";
import { formatRelativeTime } from "../data/mockAdminData";

// ── Type Configuration ───────────────────────────────────────

const TYPE_CONFIG = {
  verification: {
    icon: ShieldCheck,
    color: "text-gold-400",
    bg: "bg-gold-500/[0.08]",
    border: "border-gold-500/[0.12]",
  },
  suspension: {
    icon: Ban,
    color: "text-red-400",
    bg: "bg-red-500/[0.08]",
    border: "border-red-500/[0.12]",
  },
  activation: {
    icon: RefreshCw,
    color: "text-emerald-400",
    bg: "bg-emerald-500/[0.08]",
    border: "border-emerald-500/[0.12]",
  },
  login: {
    icon: LogIn,
    color: "text-blue-400",
    bg: "bg-blue-500/[0.08]",
    border: "border-blue-500/[0.12]",
  },
  system: {
    icon: Settings,
    color: "text-neutral-400",
    bg: "bg-neutral-500/[0.08]",
    border: "border-neutral-500/[0.12]",
  },
};

const SEVERITY_CONFIG = {
  info: {
    icon: Info,
    label: "Info",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  warning: {
    icon: AlertTriangle,
    label: "Warning",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  critical: {
    icon: AlertCircle,
    label: "Critical",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
};

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export default function ActivityLogItem({ log, index = 0, isLast = false }) {
  const typeConfig = TYPE_CONFIG[log.type] || TYPE_CONFIG.system;
  const TypeIcon = typeConfig.icon;
  const severity = SEVERITY_CONFIG[log.severity] || SEVERITY_CONFIG.info;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="group relative flex gap-4"
    >
      {/* ── Timeline Line ────────────────────────────────── */}
      <div className="flex flex-col items-center">
        <div
          className={`w-9 h-9 rounded-xl ${typeConfig.bg} border ${typeConfig.border} flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-105`}
        >
          <TypeIcon className={`w-4 h-4 ${typeConfig.color}`} />
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-white/[0.04] mt-2 group-hover:bg-gold-500/10 transition-colors duration-300" />
        )}
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <div className={`flex-1 pb-6 ${isLast ? "" : ""}`}>
        {/* Header: Action + Severity */}
        <div className="flex items-start justify-between mb-1">
          <p className="text-sm font-semibold text-neutral-200 leading-snug">
            {log.action}
          </p>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border flex-shrink-0 ml-3 ${severity.bg} ${severity.border} ${severity.color}`}
          >
            {severity.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-neutral-500 leading-relaxed mb-2">
          {log.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px] text-neutral-600">
            <User className="w-2.5 h-2.5" />
            {log.adminName}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-neutral-600">
            <Clock className="w-2.5 h-2.5" />
            {formatRelativeTime(log.timestamp)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
