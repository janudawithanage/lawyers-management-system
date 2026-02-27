/**
 * SL-LMS Formatters — Reusable formatting utilities
 */

/**
 * Format a date string for Sri Lankan locale.
 * @param {string|Date} date
 * @param {Intl.DateTimeFormatOptions} options
 */
export function formatDate(date, options = {}) {
  const defaults = { year: "numeric", month: "long", day: "numeric" };
  return new Intl.DateTimeFormat("en-LK", { ...defaults, ...options }).format(
    new Date(date)
  );
}

/**
 * Format currency in LKR.
 * @param {number} amount
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Truncate text with ellipsis.
 * @param {string} text
 * @param {number} maxLength
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

/**
 * Generate initials from a full name.
 * @param {string} name
 * @param {number} max – maximum number of initials
 */
export function getInitials(name, max = 2) {
  if (!name) return "";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, max)
    .join("")
    .toUpperCase();
}

/**
 * Slugify a string for URLs.
 * @param {string} text
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
