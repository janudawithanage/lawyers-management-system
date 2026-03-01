/**
 * ══════════════════════════════════════════════════════════════
 * REPORTS WIDGET — Platform Analytics & Charts
 * ══════════════════════════════════════════════════════════════
 *
 * Governance-level analytics panels:
 *  • Monthly user registration trend (bar chart)
 *  • Appointment completion trend (dual bar)
 *  • Case status distribution (horizontal bars)
 *  • Platform activity summary stats
 *
 * Charts are implemented with pure CSS/SVG + Framer Motion.
 * Ready to swap in a real charting library (Recharts, etc.)
 * when production data is wired.
 */

import { motion } from "framer-motion";
import {
  UserPlus,
  CalendarCheck,
  BarChart3,
  TrendingUp,
  Users,
  Scale,
  Clock,
  CheckCircle2,
} from "lucide-react";

// ── Color Map for Case Distribution ──────────────────────────

const DIST_COLORS = {
  gold: {
    bar: "from-gold-600 via-gold-500 to-gold-400",
    text: "text-gold-400",
    bg: "bg-gold-500/10",
  },
  emerald: {
    bar: "from-emerald-600 via-emerald-500 to-emerald-400",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  blue: {
    bar: "from-blue-600 via-blue-500 to-blue-400",
    text: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  neutral: {
    bar: "from-neutral-600 via-neutral-500 to-neutral-400",
    text: "text-neutral-400",
    bg: "bg-neutral-500/10",
  },
};

// ── Bar Chart (Registration Trend) ───────────────────────────

function RegistrationChart({ data }) {
  const maxVal = Math.max(...data.map((d) => d.clients + d.lawyers));

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="p-5 rounded-2xl bg-dark-800/40 border border-white/[0.06]"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-gold-400" />
          <h4 className="text-sm font-semibold text-neutral-200">
            User Registrations
          </h4>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[10px] text-blue-400">
            <span className="w-2 h-2 rounded-sm bg-blue-400" />
            Clients
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-gold-400">
            <span className="w-2 h-2 rounded-sm bg-gold-400" />
            Lawyers
          </span>
        </div>
      </div>

      <div className="flex items-end gap-3 h-32">
        {data.map((item, i) => (
          <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end gap-0.5 justify-center h-24">
              {/* Client bar */}
              <motion.div
                className="flex-1 max-w-4 rounded-t-sm bg-linear-to-t from-blue-600/60 to-blue-400/40"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + i * 0.08,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{
                  height: `${(item.clients / maxVal) * 100}%`,
                  transformOrigin: "bottom",
                  minHeight: 4,
                }}
              />
              {/* Lawyer bar */}
              <motion.div
                className="flex-1 max-w-4 rounded-t-sm bg-linear-to-t from-gold-600/60 to-gold-400/40"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.4 + i * 0.08,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{
                  height: `${(item.lawyers / maxVal) * 100}%`,
                  transformOrigin: "bottom",
                  minHeight: 4,
                }}
              />
            </div>
            <span className="text-[9px] text-neutral-600">{item.month}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Appointment Trend Chart ──────────────────────────────────

function AppointmentChart({ data }) {
  const maxVal = Math.max(...data.map((d) => d.total));

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="p-5 rounded-2xl bg-dark-800/40 border border-white/[0.06]"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <CalendarCheck className="w-4 h-4 text-gold-400" />
          <h4 className="text-sm font-semibold text-neutral-200">
            Appointment Trend
          </h4>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[10px] text-neutral-400">
            <span className="w-2 h-2 rounded-sm bg-neutral-500" />
            Total
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
            <span className="w-2 h-2 rounded-sm bg-emerald-400" />
            Completed
          </span>
        </div>
      </div>

      <div className="flex items-end gap-3 h-32">
        {data.map((item, i) => (
          <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end gap-0.5 justify-center h-24">
              <motion.div
                className="flex-1 max-w-4 rounded-t-sm bg-linear-to-t from-neutral-700/60 to-neutral-500/30"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + i * 0.08,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{
                  height: `${(item.total / maxVal) * 100}%`,
                  transformOrigin: "bottom",
                  minHeight: 4,
                }}
              />
              <motion.div
                className="flex-1 max-w-4 rounded-t-sm bg-linear-to-t from-emerald-600/60 to-emerald-400/40"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.4 + i * 0.08,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{
                  height: `${(item.completed / maxVal) * 100}%`,
                  transformOrigin: "bottom",
                  minHeight: 4,
                }}
              />
            </div>
            <span className="text-[9px] text-neutral-600">{item.month}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Case Distribution (Horizontal Bars) ──────────────────────

function CaseDistribution({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="p-5 rounded-2xl bg-dark-800/40 border border-white/[0.06]"
    >
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="w-4 h-4 text-gold-400" />
        <h4 className="text-sm font-semibold text-neutral-200">
          Case Status Distribution
        </h4>
      </div>

      <div className="space-y-4">
        {data.map((item, i) => {
          const colors = DIST_COLORS[item.color] || DIST_COLORS.neutral;
          return (
            <div key={item.status} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-300 font-medium">
                  {item.status}
                </span>
                <span className="text-[11px] text-neutral-500">
                  {item.count.toLocaleString()} · {item.percentage}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-dark-600/80 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-linear-to-r ${colors.bar}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{
                    duration: 0.8,
                    delay: 0.5 + i * 0.1,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-5 pt-4 border-t border-white/[0.04] flex items-center justify-between">
        <span className="text-xs text-neutral-500 font-medium">
          Total Cases
        </span>
        <span className="text-sm font-bold text-neutral-200">
          {data.reduce((acc, d) => acc + d.count, 0).toLocaleString()}
        </span>
      </div>
    </motion.div>
  );
}

// ── Platform Summary Stats ───────────────────────────────────

function PlatformSummary() {
  const stats = [
    {
      icon: TrendingUp,
      label: "Growth Rate",
      value: "+12.4%",
      sub: "MoM",
      color: "text-emerald-400 bg-emerald-500/10",
    },
    {
      icon: Users,
      label: "Daily Active",
      value: "847",
      sub: "users",
      color: "text-blue-400 bg-blue-500/10",
    },
    {
      icon: CheckCircle2,
      label: "Completion",
      value: "94.2%",
      sub: "appointments",
      color: "text-gold-400 bg-gold-500/10",
    },
    {
      icon: Clock,
      label: "Avg Response",
      value: "2.4h",
      sub: "verification",
      color: "text-purple-400 bg-purple-500/10",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="p-5 rounded-2xl bg-dark-800/40 border border-white/[0.06]"
    >
      <div className="flex items-center gap-2 mb-5">
        <Scale className="w-4 h-4 text-gold-400" />
        <h4 className="text-sm font-semibold text-neutral-200">
          Platform Summary
        </h4>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-dark-700/30 border border-white/[0.04]"
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}
            >
              <s.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-50 leading-none">
                {s.value}
              </p>
              <p className="text-[10px] text-neutral-500 mt-0.5">
                {s.label} · {s.sub}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export default function ReportsWidget({
  registrationTrend,
  appointmentTrend,
  caseDistribution,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RegistrationChart data={registrationTrend} />
      <AppointmentChart data={appointmentTrend} />
      <CaseDistribution data={caseDistribution} />
      <PlatformSummary />
    </div>
  );
}
