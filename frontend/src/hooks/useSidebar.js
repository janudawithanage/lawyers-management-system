/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS useSidebar Hook
 * Manages sidebar collapsed/expanded state with localStorage
 * persistence, mobile drawer, and keyboard shortcuts.
 * ══════════════════════════════════════════════════════════════
 */

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "sl_lms_sidebar_collapsed";

/**
 * Read initial state from localStorage.
 * Defaults to expanded (false) on first visit.
 */
function getInitialState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "true";
  } catch {
    return false;
  }
}

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(getInitialState);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // ── Persist collapsed state ─────────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(isCollapsed));
    } catch {
      // silently fail
    }
  }, [isCollapsed]);

  // ── Close mobile drawer on resize to desktop ────────────────
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Keyboard shortcut: Ctrl/Cmd + B to toggle ──────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        setIsCollapsed((prev) => !prev);
      }
      // Escape closes mobile drawer
      if (e.key === "Escape" && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen]);

  // ── Actions ─────────────────────────────────────────────────
  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const openMobile = useCallback(() => {
    setIsMobileOpen(true);
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const toggleMobile = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (isCollapsed) setIsHovering(true);
  }, [isCollapsed]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  // When collapsed + hovering, temporarily show expanded state
  const isExpanded = !isCollapsed || isHovering;

  return {
    // State
    isCollapsed,
    isMobileOpen,
    isHovering,
    isExpanded,

    // Actions
    toggleCollapsed,
    openMobile,
    closeMobile,
    toggleMobile,

    // Mouse handlers (for hover-to-expand)
    handleMouseEnter,
    handleMouseLeave,
  };
}
