/**
 * Card — Premium glassmorphism card component.
 *
 * Variants:
 *  - default: Subtle glass surface
 *  - gold:    Gold-tinted glass
 *  - elevated: Stronger background with shadow
 *
 * Supports hover effects, padding sizes, and interactive states.
 */

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@utils";

const variantClasses = {
  default: "surface-card hover:surface-card-hover",
  gold: "glass-gold hover:bg-gold-500/8",
  elevated:
    "bg-dark-600/50 border border-white/6 shadow-xl shadow-black/30 hover:border-gold-500/20 hover:shadow-gold-500/5",
  flat: "bg-dark-700/50 border border-white/6",
};

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-7",
  xl: "p-8",
};

const Card = forwardRef(
  (
    {
      children,
      variant = "default",
      padding = "md",
      rounded = "2xl",
      className = "",
      hover = true,
      animated = false,
      animationDelay = 0,
      as = "div",
      ...props
    },
    ref
  ) => {
    const classes = cn(
      "rounded-" + rounded,
      "transition-all duration-300",
      variantClasses[variant],
      paddingClasses[padding],
      hover && "group",
      className
    );

    if (animated) {
      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: animationDelay }}
          whileHover={hover ? { y: -4 } : undefined}
          className={classes}
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    const Component = as;
    return (
      <Component ref={ref} className={classes} {...props}>
        {children}
      </Component>
    );
  }
);

Card.displayName = "Card";

export default Card;
