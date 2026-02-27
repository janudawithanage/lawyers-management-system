/**
 * Badge — Small label / tag component.
 *
 * Variants: gold, emerald, blue, neutral, outline
 */

import { cn } from "@utils";

const variantClasses = {
  gold: "bg-gold-500/10 text-gold-400 border border-gold-500/20",
  emerald: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  blue: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  neutral: "bg-white/4 text-neutral-400 border border-white/6",
  outline: "bg-transparent text-neutral-400 border border-white/10",
  live: "bg-white/4 text-neutral-400 border border-white/6",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-3 py-1 text-xs",
  lg: "px-4 py-1.5 text-xs",
};

export default function Badge({
  children,
  variant = "gold",
  size = "md",
  dot = false,
  className = "",
  ...props
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wider uppercase whitespace-nowrap",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "flex h-2 w-2 rounded-full",
            variant === "emerald" && "bg-emerald-400 animate-pulse",
            variant === "gold" && "bg-gold-400 animate-pulse",
            variant === "blue" && "bg-blue-400 animate-pulse",
            variant === "live" && "bg-emerald-400 animate-pulse",
            variant === "neutral" && "bg-neutral-400"
          )}
        />
      )}
      {children}
    </span>
  );
}
