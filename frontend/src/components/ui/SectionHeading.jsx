import { motion } from "framer-motion";

export default function SectionHeading({
  badge,
  title,
  subtitle,
  align = "center",
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`max-w-3xl mb-16 ${alignClass}`}
    >
      {badge && (
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 bg-gold-500/10 text-gold-400 border border-gold-500/20">
          {badge}
        </span>
      )}
      <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-neutral-50">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg leading-relaxed text-neutral-400">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
