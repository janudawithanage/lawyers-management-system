/**
 * ══════════════════════════════════════════════════════════════
 * SYSTEM SUMMARY — Governance Control Header
 * ══════════════════════════════════════════════════════════════
 *
 * Institutional header for the admin dashboard:
 *  • Time-of-day greeting + admin role badge
 *  • System status indicator (Operational / Degraded / Maintenance)
 *  • Key governance counters (users, verified, pending)
 *  • Service health mini-grid
 */

import { motion } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Users,
  Scale,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Wrench,
} from "lucide-react";

// ── System Status Configuration ──────────────────────────────

const STATUS_CONFIG = {
  operational: {
    label: "All Systems Operational",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
    glow: "shadow-[0_0_12px_rgba(16,185,129,0.15)]",
  },
  degraded: {
    label: "Partial Degradation",
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    dot: "bg-amber-400 animate-pulse",
    glow: "",
  },
  maintenance: {
    label: "Under Maintenance",
    icon: Wrench,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    dot: "bg-blue-400 animate-pulse",
    glow: "",
  },
};

const SERVICE_STATUS = {
  operational: {
    dot: "bg-emerald-400",
    text: "text-emerald-400",
  },
  degraded: {
    dot: "bg-amber-400 animate-pulse",
    text: "text-amber-400",
  },
  maintenance: {
    dot: "bg-blue-400 animate-pulse",
    text: "text-blue-400",
  },
};

// ── Counter Pill ─────────────────────────────────────────────

function CounterPill({ icon: Icon, label, value, accent = false }) {
  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-colors duration-200 ${
        accent
          ? "bg-gold-500/[0.06] border-gold-500/[0.12] hover:border-gold-500/20"
          : "bg-dark-700/40 border-white/[0.06] hover:border-white/[0.1]"
      }`}
    >
      <Icon
        className={`w-4 h-4 ${accent ? "text-gold-400" : "text-neutral-500"}`}
      />
      <div>
        <p className="text-lg font-bold text-neutral-50 leading-none">
          {value}
        </p>
        <p className="text-[10px] text-neutral-500 mt-0.5 uppercase tracking-wider">
          {label}
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export default function SystemSummary({
  greeting,
  adminName,
  adminRole,
  systemStatus,
}) {
  const statusConfig =
    STATUS_CONFIG[systemStatus.overall] || STATUS_CONFIG.operational;
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
    >
      {/* ── Layered background ─────────────────────────────── */}
      <div className="absolute inset-0 bg-linear-to-br from-dark-800/80 via-dark-800/40 to-dark-900/60 rounded-2xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(198,167,94,0.05)_0%,transparent_60%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold-500/20 to-transparent" />

      <div className="relative z-10">
        {/* ── Top Row: Greeting + Status ───────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-gold-400" />
              <span className="text-xs font-medium text-gold-400/80 tracking-wide uppercase">
                {greeting}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-50 tracking-tight mb-1.5">
              System Control Panel
            </h1>

            <p className="text-sm text-neutral-400 max-w-lg leading-relaxed">
              Governance workspace for platform administration, lawyer
              verification, and compliance oversight.
            </p>
          </div>

          {/* System status badge */}
          <div className="flex flex-col items-start sm:items-end gap-2">
            <span
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color} ${statusConfig.glow}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
              <StatusIcon className="w-3.5 h-3.5" />
              {statusConfig.label}
            </span>

            {/* Admin role badge */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-red-500/10 border border-red-500/20 text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              {adminRole === "super_admin" ? "Super Admin" : "Admin"}
              <span className="text-neutral-600 ml-1">• {adminName}</span>
            </span>
          </div>
        </div>

        {/* ── Service Health Grid ──────────────────────────── */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-5">
          {systemStatus.services.map((svc) => {
            const svcStatus =
              SERVICE_STATUS[svc.status] || SERVICE_STATUS.operational;
            return (
              <span
                key={svc.name}
                className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${svcStatus.dot}`}
                />
                <span>{svc.name}</span>
                <span className="text-neutral-700">•</span>
                <span className={svcStatus.text}>{svc.uptime}</span>
              </span>
            );
          })}
        </div>

        {/* ── Governance Counters ──────────────────────────── */}
        <div className="flex flex-wrap gap-3">
          <CounterPill
            icon={Users}
            label="Total Users"
            value="2,389"
          />
          <CounterPill
            icon={Scale}
            label="Verified Lawyers"
            value="489"
            accent
          />
          <CounterPill
            icon={Clock}
            label="Pending Review"
            value="38"
          />
          <CounterPill
            icon={Activity}
            label="Active Cases"
            value="1,203"
          />
        </div>

        {/* Gold divider */}
        <div className="mt-6 h-px w-16 bg-linear-to-r from-gold-500/50 to-transparent rounded-full" />
      </div>
    </motion.div>
  );
}
