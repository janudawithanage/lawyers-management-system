import { useEffect } from "react";

/**
 * Locks body scrolling when `locked` is true. Useful for modals / drawers.
 */
export function useScrollLock(locked) {
  useEffect(() => {
    if (locked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);
}
