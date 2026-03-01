/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS TIME HELPERS — Deadline & Countdown Utilities
 * ══════════════════════════════════════════════════════════════
 *
 * Utilities for time-bound flows: appointment approval windows,
 * payment deadlines, and case payment due dates.
 */

// ── Default Time Windows (configurable by admin) ─────────────

export const DEFAULT_TIME_WINDOWS = Object.freeze({
  /** Hours a lawyer has to approve/decline an appointment */
  LAWYER_APPROVAL_HOURS: 24,

  /** Minutes a client has to complete payment after approval */
  CLIENT_PAYMENT_MINUTES: 10,

  /** Days a client has to pay a case fee request */
  CASE_PAYMENT_DAYS: 7,
});

// ── Deadline Creation ────────────────────────────────────────

/**
 * Create a deadline timestamp from now.
 * @param {number} amount   — Number of time units
 * @param {"hours"|"minutes"|"days"|"seconds"} unit — Time unit
 * @returns {number} Unix timestamp in milliseconds
 */
export function createDeadline(amount, unit = "hours") {
  const multipliers = {
    seconds: 1000,
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
  };

  const ms = multipliers[unit] || multipliers.hours;
  return Date.now() + amount * ms;
}

// ── Time Remaining Calculation ───────────────────────────────

/**
 * Calculate remaining time from now to a deadline.
 * @param {number} deadline — Unix timestamp in milliseconds
 * @returns {{ total: number, days: number, hours: number, minutes: number, seconds: number, expired: boolean }}
 */
export function getTimeRemaining(deadline) {
  const total = Math.max(0, deadline - Date.now());
  const expired = total <= 0;

  return {
    total,
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
    expired,
  };
}

// ── Formatting ───────────────────────────────────────────────

/**
 * Format remaining time for display.
 * Shows the two most significant non-zero units.
 * @param {number} deadline — Unix timestamp in ms
 * @returns {string}
 */
export function formatCountdown(deadline) {
  const { days, hours, minutes, seconds, expired } = getTimeRemaining(deadline);

  if (expired) return "Expired";

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

/**
 * Format a countdown in MM:SS for payment timers.
 * @param {number} deadline — Unix timestamp in ms
 * @returns {string}
 */
export function formatPaymentCountdown(deadline) {
  const { minutes, seconds, expired } = getTimeRemaining(deadline);

  if (expired) return "00:00";
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Get urgency level based on remaining time fraction.
 * @param {number} deadline — Unix timestamp in ms
 * @param {number} totalDuration — Total duration in ms
 * @returns {"critical"|"warning"|"normal"|"expired"}
 */
export function getUrgencyLevel(deadline, totalDuration) {
  const { total, expired } = getTimeRemaining(deadline);

  if (expired) return "expired";
  const fraction = total / totalDuration;
  if (fraction <= 0.15) return "critical";
  if (fraction <= 0.4) return "warning";
  return "normal";
}
