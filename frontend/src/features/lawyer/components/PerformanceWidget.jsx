/**
 * ══════════════════════════════════════════════════════════════
 * PERFORMANCE WIDGET — Lawyer Career Metrics
 * ══════════════════════════════════════════════════════════════
 *
 * Visual breakdown of professional performance:
 *  • Case completion rate (circular indicator)
 *  • Win / Settled / Lost summary
 *  • Workload distribution bars by case type
 *  • Client satisfaction rating
 *  • Average resolution timeline
 */

import { motion } from "framer-motion";
import {
  TrendingUp,
  CheckCircle2,
  Handshake,
  XCircle,
  Star,
  Clock,
  BarChart3,
} from "lucide-react";

// ── Circular Progress Ring ───────────────────────────────────

function CircularProgress({ percentage, size = 80, strokeWidth = 6 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B8941F" />
            <stop offset="50%" stopColor="#C6A75E" />
            <stop offset="100%" stopColor="#D4B978" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-neutral-50">{percentage}%</span>
        <span className="text-[9px] text-neutral-500 uppercase tracking-wider">
          rate
        </span>
      </div>
    </div>
  );
}

// ── Workload Bar ─────────────────────────────────────────────

function WorkloadBar({ category, count, percentage, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.6 + index * 0.08 }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-300 font-medium">{category}</span>
        <span className="text-[11px] text-neutral-500">
          {count} cases · {percentage}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-dark-600/80 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-linear-to-r from-gold-600 via-gold-500 to-gold-400"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 0.8,
            delay: 0.8 + index * 0.1,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      </div>
    </motion.div>
  );
}

// ── Summary Stat ─────────────────────────────────────────────

function SummaryStat({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-dark-700/30 border border-white/[0.04]">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-lg font-bold text-neutral-50 leading-none">
          {value}
        </p>
        <p className="text-[10px] text-neutral-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export default function PerformanceWidget({ metrics }) {
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ── Left: Completion Rate + Summary ──────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="p-5 rounded-2xl bg-dark-800/40 border border-white/[0.06]"
      >
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4 text-gold-400" />
          <h4 className="text-sm font-semibold text-neutral-200">
            Case Performance
          </h4>
        </div>

        <div className="flex items-center gap-6 mb-6">
          <CircularProgress percentage={metrics.caseCompletionRate} />
          <div className="space-y-1">
            <p className="text-sm font-medium text-neutral-300">
              Completion Rate
            </p>
            <p className="text-xs text-neutral-500">
              {metrics.totalCasesHandled} total cases handled
            </p>
            <p className="text-xs text-neutral-500">
              {metrics.casesThisYear} cases this year
            </p>
          </div>
        </div>

        {/* Win / Settled / Lost */}
        <div className="grid grid-cols-3 gap-2">
          <SummaryStat
            icon={CheckCircle2}
            label="Won"
            value={metrics.casesWon}
            color="text-emerald-400 bg-emerald-500/10"
          />
          <SummaryStat
            icon={Handshake}
            label="Settled"
            value={metrics.casesSettled}
            color="text-blue-400 bg-blue-500/10"
          />
          <SummaryStat
            icon={XCircle}
            label="Lost"
            value={metrics.casesLost}
            color="text-red-400 bg-red-500/10"
          />
        </div>

        {/* Additional metrics */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/[0.04]">
          <div className="flex items-center gap-2">
            <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
            <div>
              <p className="text-sm font-semibold text-neutral-200">
                {metrics.clientSatisfaction}
              </p>
              <p className="text-[10px] text-neutral-500">Satisfaction</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <div>
              <p className="text-sm font-semibold text-neutral-200">
                {metrics.avgResolutionDays}d
              </p>
              <p className="text-[10px] text-neutral-500">Avg Resolution</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Right: Workload Distribution ─────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="p-5 rounded-2xl bg-dark-800/40 border border-white/[0.06]"
      >
        <div className="flex items-center gap-2 mb-5">
          <BarChart3 className="w-4 h-4 text-gold-400" />
          <h4 className="text-sm font-semibold text-neutral-200">
            Workload Distribution
          </h4>
        </div>

        <div className="space-y-4">
          {metrics.workloadDistribution.map((item, i) => (
            <WorkloadBar
              key={item.category}
              category={item.category}
              count={item.count}
              percentage={item.percentage}
              index={i}
            />
          ))}
        </div>

        {/* Monthly trend (mini sparkline placeholder) */}
        <div className="mt-6 pt-4 border-t border-white/[0.04]">
          <p className="text-[11px] text-neutral-500 font-medium mb-3 uppercase tracking-wider">
            Monthly Case Intake
          </p>
          <div className="flex items-end gap-2 h-12">
            {metrics.monthlyTrend.map((item, i) => (
              <motion.div
                key={item.month}
                className="flex-1 flex flex-col items-center gap-1"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.8 + i * 0.08,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{ transformOrigin: "bottom" }}
              >
                <div
                  className="w-full rounded-sm bg-linear-to-t from-gold-600/60 to-gold-400/30 transition-colors duration-300 hover:from-gold-500 hover:to-gold-400/60"
                  style={{
                    height: `${(item.cases / 5) * 100}%`,
                    minHeight: 4,
                  }}
                />
                <span className="text-[9px] text-neutral-600">
                  {item.month}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
