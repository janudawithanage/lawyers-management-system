/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS STATUS BADGE — Premium Status Indicator
 * ══════════════════════════════════════════════════════════════
 *
 * Renders a styled badge for appointment, case, or payment status.
 * Automatically resolves colors and labels from statusEnums config.
 */

import {
  APPOINTMENT_STATUS_CONFIG,
  CASE_STATUS_CONFIG,
  PAYMENT_STATUS_CONFIG,
} from "@utils/statusEnums";

const CONFIG_MAP = {
  appointment: APPOINTMENT_STATUS_CONFIG,
  case: CASE_STATUS_CONFIG,
  payment: PAYMENT_STATUS_CONFIG,
};

export default function StatusBadge({
  status,
  type = "appointment",
  size = "sm",
  showDot = true,
  className = "",
}) {
  const configs = CONFIG_MAP[type] || APPOINTMENT_STATUS_CONFIG;
  const cfg = configs[status];

  if (!cfg) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-500/10 text-neutral-400 border border-neutral-500/20 ${className}`}>
        {status || "Unknown"}
      </span>
    );
  }

  const sizes = {
    xs: "px-2 py-0.5 text-[10px]",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${cfg.bg} ${cfg.color} ${cfg.border} ${sizes[size]} ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${status?.includes("PENDING") || status?.includes("AWAITING") ? "animate-pulse" : ""}`} />
      )}
      {cfg.label}
    </span>
  );
}
