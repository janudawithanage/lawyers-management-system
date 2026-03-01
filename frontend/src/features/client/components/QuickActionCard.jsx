/**
 * ══════════════════════════════════════════════════════════════
 * QUICK ACTION CARD — Dashboard Action Tile
 * ══════════════════════════════════════════════════════════════
 *
 * Interactive tile for primary user actions.
 * Uses Link for SPA navigation. Each card has a unique
 * accent color that reinforces action identity.
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  CalendarPlus,
  Upload,
  Activity,
  ArrowRight,
} from "lucide-react";

const ICON_MAP = {
  search: Search,
  "calendar-plus": CalendarPlus,
  upload: Upload,
  activity: Activity,
};

const COLOR_MAP = {
  gold: {
    iconBg: "bg-gold-500/10 border-gold-500/15 group-hover:bg-gold-500/15 group-hover:border-gold-500/25",
    iconColor: "text-gold-400",
    arrow: "text-gold-500/0 group-hover:text-gold-400",
    glow: "group-hover:shadow-[0_0_20px_rgba(198,167,94,0.08)]",
  },
  blue: {
    iconBg: "bg-blue-500/10 border-blue-500/15 group-hover:bg-blue-500/15 group-hover:border-blue-500/25",
    iconColor: "text-blue-400",
    arrow: "text-blue-500/0 group-hover:text-blue-400",
    glow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.08)]",
  },
  emerald: {
    iconBg: "bg-emerald-500/10 border-emerald-500/15 group-hover:bg-emerald-500/15 group-hover:border-emerald-500/25",
    iconColor: "text-emerald-400",
    arrow: "text-emerald-500/0 group-hover:text-emerald-400",
    glow: "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]",
  },
  purple: {
    iconBg: "bg-purple-500/10 border-purple-500/15 group-hover:bg-purple-500/15 group-hover:border-purple-500/25",
    iconColor: "text-purple-400",
    arrow: "text-purple-500/0 group-hover:text-purple-400",
    glow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.08)]",
  },
};

export default function QuickActionCard({ action, index = 0 }) {
  const Icon = ICON_MAP[action.icon] || Search;
  const colors = COLOR_MAP[action.color] || COLOR_MAP.gold;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: 0.3 + index * 0.07,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <Link
        to={action.href}
        className={`group flex items-center gap-4 p-4 rounded-2xl bg-dark-800/40 border border-white/[0.06] transition-all duration-300 hover:bg-dark-700/50 hover:border-white/[0.1] ${colors.glow}`}
      >
        {/* Icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 ${colors.iconBg}`}>
          <Icon className={`w-5 h-5 ${colors.iconColor}`} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-200 group-hover:text-neutral-50 transition-colors duration-200">
            {action.label}
          </p>
          <p className="text-xs text-neutral-500 mt-0.5 truncate">
            {action.description}
          </p>
        </div>

        {/* Arrow */}
        <ArrowRight
          className={`w-4 h-4 flex-shrink-0 transition-all duration-300 transform group-hover:translate-x-0.5 ${colors.arrow}`}
        />
      </Link>
    </motion.div>
  );
}
