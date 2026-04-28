import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/**
 * ScrollReveal — A wrapper that reveals its children with a parallax
 * or fade effect as the user scrolls the element into view.
 *
 * @param {"fadeUp" | "fadeLeft" | "fadeRight" | "scaleUp" | "parallax"} variant
 * @param {number} offset — Parallax offset in px (only for "parallax" variant)
 * @param {number} delay — Animation delay in seconds
 */
export default function ScrollReveal({
  children,
  variant = "fadeUp",
  offset = 50,
  delay = 0,
  className = "",
  ...props
}) {
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

  const yParallax = useTransform(smoothProgress, [0, 1], [offset, -offset]);
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  if (variant === "parallax") {
    return (
      <motion.div
        ref={ref}
        className={className}
        style={{ y: yParallax, opacity }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

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

  const v = variants[variant] || variants.fadeUp;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={v.initial}
      whileInView={v.whileInView}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
