import { motion, useReducedMotion } from "framer-motion";
import Badge from "./Badge";

/**
 * SectionHeading — Shared eyebrow + title + subtitle block.
 *
 * Typography notes:
 *
 *  • `maxWidth` constrains the heading, but the subtitle is additionally
 *    capped by `measure` (~68ch). Callers were passing max-w-5xl/6xl, which
 *    set centred body paragraphs ~140 characters wide; past roughly 75 the
 *    eye starts losing its place on the return sweep. The title can still use
 *    the full width — short, large text doesn't suffer the same way.
 *
 *  • The title renders at a deliberately tighter tracking than body copy.
 *    Large serif type needs negative letter-spacing to avoid looking loose.
 *
 *  • Accepts an `id` so sections can point `aria-labelledby` at the real
 *    heading instead of duplicating the label in an aria-label.
 */
export default function SectionHeading({
  badge,
  title,
  subtitle,
  align = "center",
  maxWidth = "max-w-3xl",
  id,
  className = "",
}) {
  const reduceMotion = useReducedMotion();
  const centered = align === "center";

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduceMotion ? 0.3 : 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`${maxWidth} mb-12 lg:mb-16 ${
        centered ? "text-center mx-auto" : "text-left"
      } ${className}`}
    >
      {badge && (
        <Badge variant="gold" size="lg" className="mb-5">
          {badge}
        </Badge>
      )}

      <h2
        id={id}
        className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] text-balance text-neutral-50"
        style={{ letterSpacing: "-0.02em" }}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={`measure mt-5 text-base sm:text-lg leading-relaxed text-neutral-400 ${
            centered ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
