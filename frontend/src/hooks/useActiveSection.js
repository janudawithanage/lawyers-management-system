import { useEffect, useState } from "react";

/**
 * Tracks which in-page section is currently in view so navigation can
 * reflect the reader's position on a long landing page.
 *
 * Without this, a visitor six sections deep has no idea where they are —
 * every nav link looks equally inactive.
 *
 * @param {string[]} ids – section ids to watch, in document order
 * @param {number} offset – px from the top treated as "the reading line"
 *                          (should roughly match the fixed header height)
 * @returns {string} the id of the section currently in view
 */
export function useActiveSection(ids, offset = 120) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    if (!ids.length) return;

    let frame = null;

    const measure = () => {
      frame = null;

      // Bottom of the page: always light up the last section, otherwise
      // the final section can never become active on short viewports.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActive(ids[ids.length - 1]);
        return;
      }

      // The active section is the last one whose top has passed the
      // reading line. Walking backwards means the first match wins.
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offset) {
          setActive(ids[i]);
          return;
        }
      }
      setActive(ids[0]);
    };

    const onScroll = () => {
      // Coalesce to one measurement per frame — getBoundingClientRect on
      // every scroll event would force layout dozens of times a second.
      if (frame === null) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, offset]);

  return active;
}
