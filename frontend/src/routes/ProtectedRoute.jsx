/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS PROTECTED ROUTE — Authentication Guard
 * ══════════════════════════════════════════════════════════════
 *
 * Wraps any route that requires authentication.
 *
 * Behaviour:
 *   • loading = true  → show full-screen spinner (prevents flash)
 *   • not authenticated → redirect to /login with ?redirect= param
 *   • authenticated    → render children / <Outlet />
 *
 * The ?redirect= query param enables "return to intended page"
 * after login — standard SaaS UX pattern.
 */

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { PATHS } from "@/routes/routeConfig";

/** Full-screen loading state while session hydrates */
function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl gradient-gold-btn animate-pulse" />
          <div className="absolute inset-0 w-12 h-12 rounded-xl border-2 border-gold-500/20 animate-ping" />
        </div>
        <p className="text-sm text-neutral-500 font-medium tracking-wide">
          Verifying session…
        </p>
      </div>
    </div>
  );
}

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Wait for session hydration before making any redirect decision
  if (loading) {
    return <AuthLoadingScreen />;
  }

  // Not authenticated → redirect to login, preserve intended destination
  if (!isAuthenticated) {
    return (
      <Navigate
        to={PATHS.LOGIN}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Authenticated → render the protected content
  return children ?? <Outlet />;
}
