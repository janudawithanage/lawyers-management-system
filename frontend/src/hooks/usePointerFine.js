import { useMediaQuery } from "./useMediaQuery";

/**
 * True when the primary input is a precise pointer (mouse / trackpad).
 *
 * Hover-driven embellishments — 3D tilt, glare, magnetic hover — have no
 * meaning on a touchscreen. Worse, they fire on tap and cost real frames on
 * the low-powered Android hardware that makes up most Sri Lankan mobile
 * traffic. Gate those effects behind this.
 */
export function usePointerFine() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}
