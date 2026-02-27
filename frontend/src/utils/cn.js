/**
 * Utility to conditionally join class names.
 * Filters out falsy values (false, null, undefined, "").
 *
 * @param  {...(string|boolean|null|undefined)} classes
 * @returns {string}
 *
 * @example
 *   cn("text-white", isActive && "bg-gold-500", className)
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
