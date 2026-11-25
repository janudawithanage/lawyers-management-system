import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import { usePointerFine } from "../../hooks";

/**
 * TiltCard — Interactive 3D perspective tilt on pointer hover.
 *
 * Implementation notes (these matter for how the page feels):
 *
 *  • Pointer position is held in motion values, not React state. The previous
 *    version called setState on every mousemove, re-rendering the card and
 *    everything inside it ~60×/second; with six feature cards on screen that
 *    dominated the main thread. Motion values write straight to the compositor
 *    and never re-render.
 *
 *  • The effect is disabled when the primary pointer is coarse (touch). Tilt
 *    needs hover to read as tilt — on a phone it only fires mid-tap, which
 *    reads as the card flinching away from the finger.
 *
 *  • It is disabled under `prefers-reduced-motion`. Tilt is exactly the kind of
 *    unsolicited 3D movement that setting exists to suppress.
 *
 * In every disabled case the children render untouched, so layout is identical.
 */
export default function TiltCard({
  children,
  className = "",
  glareColor = "rgba(198, 167, 94, 0.08)",
  maxTilt = 8,
  scale = 1.02,
  ...props
}) {
  const cardRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const pointerFine = usePointerFine();
  const enabled = pointerFine && !reduceMotion;

  // Normalised pointer position, -0.5 … 0.5 from the card centre.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const hovered = useMotionValue(0);

  const spring = { stiffness: 300, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [maxTilt, -maxTilt]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-maxTilt, maxTilt]), spring);
  const cardScale = useSpring(useTransform(hovered, [0, 1], [1, scale]), spring);

  // Glare follows the pointer across the card face.
  const glareX = useTransform(px, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(py, [-0.5, 0.5], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, ${glareColor} 0%, transparent 60%)`;

  const handlePointerMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerEnter = () => hovered.set(1);

  const handlePointerLeave = () => {
    hovered.set(0);
    px.set(0);
    py.set(0);
  };

  if (!enabled) {
    return (
      <div ref={cardRef} className={`relative ${className}`} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={{
        rotateX,
        rotateY,
        scale: cardScale,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      {...props}
    >
      {children}
      {/* Glare overlay — opacity is driven by the same hover motion value, so
          it fades with the tilt instead of popping. */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{ background: glare, opacity: hovered }}
        aria-hidden="true"
      />
    </motion.div>
  );
}
