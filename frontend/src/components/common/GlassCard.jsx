/**
 * ══════════════════════════════════════════════════════════════
 * GLASS CARD — Glassmorphism Card Component
 * ══════════════════════════════════════════════════════════════
 *
 * Premium glassmorphism card with hover effects and glow.
 */

import { motion } from "framer-motion";
import { cn } from "@utils/cn";

export default function GlassCard({
  children,
  className = "",
  hover = true,
  glow = false,
  glowColor = "gold",
  padding = "p-5",
  onClick,
  animate = true,
  ...props
}) {
  const glowColors = {
    gold: "hover:shadow-[0_0_30px_-8px_rgba(212,168,74,0.15)]",
    emerald: "hover:shadow-[0_0_30px_-8px_rgba(16,185,129,0.15)]",
    red: "hover:shadow-[0_0_30px_-8px_rgba(239,68,68,0.15)]",
    blue: "hover:shadow-[0_0_30px_-8px_rgba(59,130,246,0.15)]",
  };

  const Wrapper = animate ? motion.div : "div";
  const animProps = animate
    ? {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
      }
    : {};

  return (
    <Wrapper
      {...animProps}
      onClick={onClick}
      className={cn(
        "relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl",
        padding,
        hover && "hover:border-white/[0.1] transition-all duration-300",
        glow && glowColors[glowColor],
        onClick && "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </Wrapper>
  );
}
