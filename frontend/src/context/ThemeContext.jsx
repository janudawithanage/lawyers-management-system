/**
 * SL-LMS Theme Context — provider
 *
 * Provides dark/light theme switching infrastructure.
 * Currently defaults to dark mode (BASL branding).
 * Ready for future light-mode toggle.
 *
 * The context object, the THEMES constant and the useTheme hook live in
 * `./theme-context.js`; this module exports only the component.
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { prefStorage } from "@utils";

import { ThemeContext, THEMES } from "./theme-context";

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => prefStorage.getTheme());

  const setTheme = useCallback((mode) => {
    setThemeState(mode);
    prefStorage.setTheme(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK);
  }, [theme, setTheme]);

  const isDark = theme === THEMES.DARK;

  // Apply theme class to <html> for global CSS scoping
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.classList.toggle("light", !isDark);
    root.setAttribute("data-theme", theme);
  }, [theme, isDark]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, isDark }),
    [theme, setTheme, toggleTheme, isDark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export default ThemeProvider;
