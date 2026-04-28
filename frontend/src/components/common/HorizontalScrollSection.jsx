import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * HorizontalScrollSection — Converts vertical scroll into horizontal
 * scroll for its children. Creates a stunning scroll-jacking effect
 * where content slides horizontally as the user scrolls down.
 */
export default function HorizontalScrollSection({
  children,
  className = "",
  panelCount = 4,
}) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${(panelCount - 1) * 100 / panelCount}%`]
  );

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: `${panelCount * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <motion.div
          className="flex"
          style={{
            x,
            width: `${panelCount * 100}vw`,
          }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
