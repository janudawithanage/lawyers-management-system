/**
 * ══════════════════════════════════════════════════════════════
 * STAT CARD — Admin Dashboard KPI Tile
 * ══════════════════════════════════════════════════════════════
 *
 * Displays a single governance KPI metric:
 *  • Total Clients, Total Lawyers, Verified, Pending, Suspended,
 *    Appointments, Active Cases
 *  • Icon with accent container
 *  • Large value + change indicator
 *  • Staggered entrance animation
 */

import { motion } from "framer-motion";
import {
  Users,
  Scale,
  ShieldCheck,
  Clock,
  Ban,
  CalendarDays,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

const ICON_MAP = {
  users: Users,
  scale: Scale,
  "shield-check": ShieldCheck,
  clock: Clock,
  ban: Ban,
  calendar: CalendarDays,
  briefcase: Briefcase,
};

const CHANGE_CONFIG = {
  increase: {
    icon: TrendingUp,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  decrease: {
    icon: TrendingDown,
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  neutral: {
    icon: Minus,
    color: "text-neutral-400",
    bg: "bg-neutral-500/10",
  },
};

// Suspended gets a special red accent instead of gold
const ICON_ACCENT = {
  ban: {
    bg: "bg-red-500/[0.08] border-red-500/[0.12] group-hover:bg-red-500/[0.12] group-hover:border-red-500/20",
    text: "text-red-400",
    glow: "group-hover:shadow-[0_0_16px_rgba(239,68,68,0.1)]",
  },
};

export default function StatCard({ stat, index = 0 }) {
  const Icon = ICON_MAP[stat.icon] || Briefcase;
  const changeConfig = CHANGE_CONFIG[stat.changeType] || CHANGE_CONFIG.neutral;
  const ChangeIcon = changeConfig.icon;

  const accent = ICON_ACCENT[stat.icon];
  const iconContainerClass = accent
    ? `${accent.bg} ${accent.glow}`
    : "bg-gold-500/[0.08] border-gold-500/[0.12] group-hover:bg-gold-500/[0.12] group-hover:border-gold-500/20 group-hover:shadow-[0_0_16px_rgba(198,167,94,0.1)]";
  const iconTextClass = accent ? accent.text : "text-gold-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.07,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="group relative p-5 rounded-2xl bg-dark-800/60 border border-white/[0.06] backdrop-blur-sm transition-all duration-300 hover:bg-dark-700/60 hover:border-gold-500/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_0_1px_rgba(198,167,94,0.08)]"
    >
      {/* Gold accent top edge on hover */}
      <div className="absolute top-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-gold-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-start justify-between mb-4">
        {/* Icon */}
        <div
          className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-300 ${iconContainerClass}`}
        >
          <Icon className={`w-5 h-5 ${iconTextClass}`} />
        </div>

        {/* Change indicator */}
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${changeConfig.bg} ${changeConfig.color}`}
        >
          <ChangeIcon className="w-3 h-3" />
          <span>{stat.change}</span>
        </div>
      </div>

      {/* Value */}
      <p className="text-3xl font-bold text-neutral-50 tracking-tight leading-none mb-1.5">
        {stat.value}
      </p>

      {/* Label */}
      <p className="text-sm text-neutral-400 font-medium">{stat.label}</p>

      {/* Period */}
      {stat.period && (
        <p className="text-[11px] text-neutral-600 mt-1">{stat.period}</p>
      )}
    </motion.div>
  );
}
