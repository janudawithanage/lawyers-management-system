/**
 * ══════════════════════════════════════════════════════════════
 * EMPTY STATE — Premium Empty/No-Data Placeholder
 * ══════════════════════════════════════════════════════════════
 */

import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description = "",
  action,
  actionLabel = "Get Started",
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-5">
        <Icon className="w-7 h-7 text-neutral-600" />
      </div>
      <h3 className="text-base font-semibold text-neutral-300 mb-1.5">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-500 max-w-sm leading-relaxed">{description}</p>
      )}
      {action && (
        <button
          onClick={action}
          className="mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold gradient-gold-btn text-white hover:opacity-90 transition-opacity"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
