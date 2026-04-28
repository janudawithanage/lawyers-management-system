import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgress — A thin animated progress bar fixed at the top of the
 * viewport that fills left-to-right as the user scrolls the page.
 * Uses a gold gradient matching the BASL brand.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[100]"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, #C6A75E, #E8C15C, #34D399)",
        boxShadow: "0 0 10px rgba(198,167,94,0.4), 0 0 30px rgba(198,167,94,0.1)",
      }}
      aria-hidden="true"
    />
  );
}
