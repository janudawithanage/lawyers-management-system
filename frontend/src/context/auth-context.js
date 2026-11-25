/**
 * SL-LMS Auth Context — context object, role constants and hook
 *
 * Kept apart from `AuthContext.jsx` so that file exports nothing but the
 * provider component. Vite's fast refresh can only hot-update a module whose
 * exports are all components; mixing a hook or a constant in forces a full
 * page reload on every edit.
 */

import { createContext, useContext } from "react";

import config from "@config";

export const AuthContext = createContext(undefined);
AuthContext.displayName = "AuthContext";

const { roles } = config;

/** Map role -> default dashboard path */
export const ROLE_DASHBOARD_MAP = Object.freeze({
  [roles.CLIENT]: "/dashboard/client",
  [roles.LAWYER]: "/dashboard/lawyer",
  [roles.ADMIN]: "/dashboard/admin",
  [roles.SUPER_ADMIN]: "/dashboard/admin",
});

/** Get the dashboard path for a given role */
export function getDashboardPath(role) {
  return ROLE_DASHBOARD_MAP[role] || "/dashboard/client";
}

/** Hook: access auth context from any component */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth() must be used within <AuthProvider>. " +
        "Wrap your app root with <AuthProvider>.",
    );
  }
  return context;
}

export default AuthContext;
