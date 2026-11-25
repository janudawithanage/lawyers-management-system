import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/**
 * ScrollReveal — Reveals its children as they scroll into view.
 *
 * Two important behaviours:
 *
 *  1. It honours `prefers-reduced-motion`. Framer Motion drives transforms in
 *     JavaScript, so the `@media (prefers-reduced-motion)` rule in index.css
 *     does NOT reach it — the reveal has to opt out in JS or vestibular users
 *     get the full slide-and-fade regardless of their OS setting.
 *
 *  2. The scroll-linked machinery (useScroll + useSpring + useTransform) only
 *     mounts for the "parallax" variant. It used to run for every instance,
 *     which meant ~20 spring simulations and scroll subscriptions on the
 *     landing page doing nothing but burning frames.
 *
 * @param {"fadeUp"|"fadeLeft"|"fadeRight"|"scaleUp"|"parallax"} variant
 * @param {number} offset — Parallax travel in px (parallax variant only)
 * @param {number} delay — Animation delay in seconds
 */

const variants = {
  fadeUp: {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    initial: { opacity: 0, x: -60 },
    whileInView: { opacity: 1, x: 0 },
  },
  fadeRight: {
    initial: { opacity: 0, x: 60 },
    whileInView: { opacity: 1, x: 0 },
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.9 },
    whileInView: { opacity: 1, scale: 1 },
  },
};

/** Scroll-linked parallax — isolated so its hooks only run when used. */
function ParallaxReveal({ children, offset, className, ...props }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const y = useTransform(smoothProgress, [0, 1], [offset, -offset]);
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div ref={ref} className={className} style={{ y, opacity }} {...props}>
      {children}
    </motion.div>
  );
}

export default function ScrollReveal({
  children,
  variant = "fadeUp",
  offset = 50,
  delay = 0,
  className = "",
  ...props
}) {
  const reduceMotion = useReducedMotion();

  // Reduced motion: content appears in place. We still gate on viewport with
  // a short opacity fade so the page doesn't feel like a static dump, but
  // nothing travels across the screen.
  if (reduceMotion) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.3, delay: Math.min(delay, 0.15) }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  if (variant === "parallax") {
    return (
      <ParallaxReveal offset={offset} className={className} {...props}>
        {children}
      </ParallaxReveal>
    );
  }

  const v = variants[variant] || variants.fadeUp;

  return (
    <motion.div
      className={className}
      initial={v.initial}
      whileInView={v.whileInView}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
