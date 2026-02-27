import { motion } from "framer-motion";
import Badge from "./Badge";

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
        <Badge variant="gold" size="lg" className="mb-4">
          {badge}
        </Badge>
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
