/**
 * Divider — Subtle section separator.
 */

import { cn } from "@utils";

export default function Divider({ className = "", gold = false }) {
  return (
    <hr
      className={cn(
        "border-0 h-px",
        gold
          ? "bg-gradient-to-r from-transparent via-gold-500/20 to-transparent"
          : "bg-white/6",
        className
      )}
    />
  );
}
