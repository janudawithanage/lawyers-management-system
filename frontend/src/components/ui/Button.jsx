import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const variants = {
  primary:
    "gradient-gold-btn text-dark-950 font-semibold shadow-lg shadow-gold-500/20 hover:shadow-gold-500/35 hover:brightness-110",
  secondary:
    "bg-white/4 hover:bg-white/8 text-neutral-100 border border-white/8 hover:border-gold-500/30 backdrop-blur-sm",
  outline:
    "bg-transparent hover:bg-gold-500/10 text-gold-400 border border-gold-500/30 hover:border-gold-500/50",
  ghost:
    "bg-transparent hover:bg-white/6 text-neutral-300 hover:text-neutral-100",
  dark:
    "bg-dark-500 hover:bg-dark-400 text-neutral-100 border border-white/6 shadow-lg shadow-black/30",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-3.5 text-base",
  xl: "px-10 py-4 text-lg",
};

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      className = "",
      href,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:ring-offset-2 focus:ring-offset-dark-950 disabled:opacity-50 disabled:cursor-not-allowed";

    const classes = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      className
    );

    if (href) {
      return (
        <a ref={ref} href={href} className={classes} {...props}>
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
