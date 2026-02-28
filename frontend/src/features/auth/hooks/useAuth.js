/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS AUTH HOOK
 * Custom React hook for authentication state management
 * ══════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { authService } from "../services/authService";

// Create Auth Context
const AuthContext = createContext(null);

/**
 * Auth Provider Component
 * Wrap your app with this to provide auth state globally
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Auth initialization error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login handler
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register handler
  const register = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(formData);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout handler
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error("Refresh user error:", err);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    isClient: user?.role === "client",
    isLawyer: user?.role === "lawyer",
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to access auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * Hook for protected routes
 */
export function useRequireAuth(allowedRoles = []) {
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Redirect to login
      window.location.href = "/login";
    }

    if (!loading && isAuthenticated && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role)) {
        // Redirect to unauthorized page
        window.location.href = "/unauthorized";
      }
    }
  }, [user, loading, isAuthenticated, allowedRoles]);

  return { user, loading };
}
