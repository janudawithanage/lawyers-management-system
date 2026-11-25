/**
 * SL-LMS Theme Context — context object, constants and hook
 *
 * Kept apart from `ThemeContext.jsx` so that file exports nothing but the
 * provider component. Vite's fast refresh can only hot-update a module whose
 * exports are all components; mixing a hook or a constant in forces a full
 * page reload on every edit.
 */

import { createContext, useContext } from "react";

export const ThemeContext = createContext(undefined);
ThemeContext.displayName = "ThemeContext";

export const THEMES = Object.freeze({ DARK: "dark", LIGHT: "light" });

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export default ThemeContext;
