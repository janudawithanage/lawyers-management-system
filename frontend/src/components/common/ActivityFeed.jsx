/**
 * ══════════════════════════════════════════════════════════════
 * ACTIVITY FEED — Real-Time Notification Feed Component
 * ══════════════════════════════════════════════════════════════
 *
 * Displays a scrollable feed of notifications/activities.
 * Supports dismissal, links, and category-based icons.
 */

import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
  X,
  CreditCard,
  Briefcase,
  Calendar,
  ExternalLink,
} from "lucide-react";

const TYPE_CONFIG = {
  success: {
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/15",
    dot: "bg-emerald-400",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/15",
    dot: "bg-amber-400",
  },
  error: {
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/15",
    dot: "bg-red-400",
  },
  info: {
    icon: Info,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/15",
    dot: "bg-blue-400",
  },
};

const CATEGORY_ICONS = {
  appointment: Calendar,
  payment: CreditCard,
  case: Briefcase,
  system: Bell,
};

function formatRelativeTime(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString("en-LK", {
    month: "short",
    day: "numeric",
  });
}

export default function ActivityFeed({
  notifications = [],
  onDismiss,
  onAction,
  maxItems = 15,
  emptyMessage = "No notifications",
  className = "",
}) {
  const items = notifications.slice(0, maxItems);

  if (items.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-10 ${className}`}>
        <Bell className="w-9 h-9 text-neutral-700 mb-2" />
        <p className="text-sm text-neutral-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <AnimatePresence mode="popLayout">
        {items.map((notif, index) => {
          const typeConfig = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info;
          const Icon = typeConfig.icon;
          const CategoryIcon = CATEGORY_ICONS[notif.category] || Bell;

          return (
            <motion.div
              key={notif.id}
              layout
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
              className={`group relative flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-sm
                ${typeConfig.bg} ${typeConfig.border}
                hover:bg-white/[0.03] transition-all cursor-default`}
            >
              {/* Icon */}
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${typeConfig.bg}`}
              >
                <Icon className={`w-4 h-4 ${typeConfig.color}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-neutral-200 truncate">
                    {notif.title}
                  </p>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${typeConfig.dot}`} />
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                  {notif.message}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-neutral-600">
                    {formatRelativeTime(notif.timestamp)}
                  </span>
                  {notif.actionLabel && onAction && (
                    <button
                      onClick={() => onAction(notif)}
                      className={`inline-flex items-center gap-1 text-[10px] font-medium ${typeConfig.color} hover:underline`}
                    >
                      {notif.actionLabel}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Dismiss */}
              {onDismiss && (
                <button
                  onClick={() => onDismiss(notif.id)}
                  className="absolute top-2 right-2 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/[0.06] transition-all"
                >
                  <X className="w-3.5 h-3.5 text-neutral-600" />
                </button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
