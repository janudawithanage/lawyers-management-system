/**
 * SL-LMS Auth Context
 *
 * Provides authentication state, login/logout/register actions,
 * and role-based access helpers.
 *
 * Ready for JWT / OAuth integration.
 */

import { createContext, useContext, useState, useMemo, useCallback } from "react";
import { authStorage } from "@utils";
import config from "@config";

const AuthContext = createContext(undefined);

const { roles } = config;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!user;

  const login = useCallback(async (/* credentials */) => {
    setLoading(true);
    try {
      // TODO: Call auth API
      // const response = await api.post("/auth/login", credentials);
      // authStorage.setToken(response.token);
      // setUser(response.user);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (/* userData */) => {
    setLoading(true);
    try {
      // TODO: Call register API
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authStorage.clear();
    setUser(null);
  }, []);

  /** Role-checking helpers */
  const hasRole = useCallback(
    (role) => user?.role === role,
    [user]
  );
  const isClient = useMemo(() => hasRole(roles.CLIENT), [hasRole, roles.CLIENT]);
  const isLawyer = useMemo(() => hasRole(roles.LAWYER), [hasRole, roles.LAWYER]);
  const isAdmin = useMemo(
    () => hasRole(roles.ADMIN) || hasRole(roles.SUPER_ADMIN),
    [hasRole, roles.ADMIN, roles.SUPER_ADMIN]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      hasRole,
      isClient,
      isLawyer,
      isAdmin,
    }),
    [user, loading, isAuthenticated, login, register, logout, hasRole, isClient, isLawyer, isAdmin]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
