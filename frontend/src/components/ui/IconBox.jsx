/**
 * IconBox — Consistent icon container with themed backgrounds.
 *
 * Used across features, steps, and cards for uniform icon presentation.
 */

import { cn } from "@utils";

const colorClasses = {
  gold: "bg-gold-500/10 text-gold-400 group-hover:bg-gold-500/15",
  emerald: "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/15",
  blue: "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/15",
  neutral: "bg-white/6 text-neutral-400 group-hover:bg-white/10",
};

const sizeClasses = {
  sm: "w-10 h-10 rounded-lg",
  md: "w-12 h-12 rounded-xl",
  lg: "w-14 h-14 rounded-2xl",
};

const iconSizeMap = {
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-7 h-7",
};

export default function IconBox({
  icon: Icon,
  color = "gold",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center transition-all duration-300 group-hover:scale-110",
        colorClasses[color],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <Icon className={iconSizeMap[size]} />
    </div>
  );
}
