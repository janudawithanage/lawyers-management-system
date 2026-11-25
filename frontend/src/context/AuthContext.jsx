/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS AUTH CONTEXT — Production-Grade
 * ══════════════════════════════════════════════════════════════
 *
 * Responsibilities:
 *  1. Store authenticated user, role, token, and loading state
 *  2. Provide login / logout / register actions
 *  3. Restore session on page refresh (hydrate from storage)
 *  4. Expose role-checking helpers
 *  5. Memoize context value to prevent unnecessary re-renders
 *
 * Integration points:
 *  • tokenStorage — abstraction over sessionStorage
 *  • authService  — mock API (swap for real backend later)
 *  • config.roles — single source of truth for role constants
 *
 * The context object, the role map and the useAuth hook live in
 * ./auth-context.js; this module exports only the provider component.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { tokenStorage } from "@utils/tokenStorage";
import { authService } from "@features/auth/services/authService";
import config from "@config";

import { AuthContext, getDashboardPath } from "./auth-context";

const { roles } = config;

// ── Provider ─────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // true until hydration completes
  const [error, setError] = useState(null);

  // ── Hydrate session on mount ────────────────────────────────
  useEffect(() => {
    const hydrateSession = async () => {
      try {
        if (!tokenStorage.hasSession()) {
          return; // no stored session — stay unauthenticated
        }

        const storedToken = tokenStorage.getAccessToken();
        const storedUser = tokenStorage.getUser();

        if (storedToken && storedUser) {
          // In production: validate token with backend via /auth/me
          // For now, trust the stored session (mock mode)
          setToken(storedToken);
          setUser(storedUser);
        } else {
          // Corrupted session — clear everything
          tokenStorage.clearSession();
        }
      } catch (err) {
        console.error("[AuthContext] Session hydration failed:", err);
        tokenStorage.clearSession();
      } finally {
        setLoading(false);
      }
    };

    hydrateSession();
  }, []);

  // ── Login ───────────────────────────────────────────────────
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);

      // Persist to abstracted storage
      tokenStorage.persistSession({
        token: response.token,
        refreshToken: response.refreshToken,
        user: response.user,
      });

      setToken(response.token);
      setUser(response.user);

      return response;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Register ────────────────────────────────────────────────
  const register = useCallback(async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(formData);

      tokenStorage.persistSession({
        token: response.token,
        refreshToken: response.refreshToken,
        user: response.user,
      });

      setToken(response.token);
      setUser(response.user);

      return response;
    } catch (err) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Logout ──────────────────────────────────────────────────
  const logout = useCallback(() => {
    tokenStorage.clearSession();
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  // ── Role helpers ────────────────────────────────────────────
  const role = user?.role ?? null;

  const hasRole = useCallback(
    (checkRole) => role === checkRole,
    [role],
  );

  const hasAnyRole = useCallback(
    (roleList = []) => roleList.includes(role),
    [role],
  );

  // Derived booleans
  const isAuthenticated = Boolean(user) && Boolean(token);
  const isClient = role === roles.CLIENT;
  const isLawyer = role === roles.LAWYER;
  const isAdmin = role === roles.ADMIN || role === roles.SUPER_ADMIN;

  // ── Memoized value ─────────────────────────────────────────
  const value = useMemo(
    () => ({
      // State
      user,
      role,
      token,
      loading,
      error,
      isAuthenticated,

      // Actions
      login,
      register,
      logout,

      // Role helpers
      hasRole,
      hasAnyRole,
      isClient,
      isLawyer,
      isAdmin,

      // Utilities
      getDashboardPath: () => getDashboardPath(role),
    }),
    [
      user,
      role,
      token,
      loading,
      error,
      isAuthenticated,
      login,
      register,
      logout,
      hasRole,
      hasAnyRole,
      isClient,
      isLawyer,
      isAdmin,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
