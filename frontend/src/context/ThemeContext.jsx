/**
 * SL-LMS Theme Context
 *
 * Provides dark/light theme switching infrastructure.
 * Currently defaults to dark mode (BASL branding).
 * Ready for future light-mode toggle.
 */

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { prefStorage } from "@utils";

const ThemeContext = createContext(undefined);

const THEMES = { DARK: "dark", LIGHT: "light" };

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
    [theme, setTheme, toggleTheme, isDark]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export { THEMES };
export default ThemeContext;
