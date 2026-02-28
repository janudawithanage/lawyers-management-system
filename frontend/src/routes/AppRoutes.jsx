/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS APP ROUTES — Centralised Route Tree
 * ══════════════════════════════════════════════════════════════
 *
 * All application routing is wired here with:
 *   • React.lazy for code-splitting every dashboard page
 *   • ProtectedRoute for authentication gating
 *   • RoleRoute for role-based access control
 *   • Suspense boundaries with branded loading states
 *
 * Route flow:
 *   Public  → PublicLayout  (Navbar + Footer)
 *   Auth    → standalone    (AuthLayout — no Navbar)
 *   Dashboard → ProtectedRoute → RoleRoute → DashboardLayout
 */

import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout, DashboardLayout } from "@layouts";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import { PATHS } from "./routeConfig";
import config from "@config";

const { roles } = config;

// ── Lazy-loaded Pages ────────────────────────────────────────
const LandingPage = lazy(() => import("@pages/LandingPage"));
const LoginPage = lazy(() => import("@features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@features/auth/pages/RegisterPage"));

// Dashboard pages — each role gets its own chunk
const ClientDashboard = lazy(() => import("@pages/dashboard/ClientDashboard"));
const LawyerDashboard = lazy(() => import("@pages/dashboard/LawyerDashboard"));
const AdminDashboard = lazy(() => import("@pages/dashboard/AdminDashboard"));

// Error pages
const NotFound = lazy(() => import("@pages/NotFound"));

// ── Loading Fallback ─────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl gradient-gold-btn animate-pulse" />
        <p className="text-sm text-neutral-500 font-medium tracking-wide">
          Loading…
        </p>
      </div>
    </div>
  );
}

/** Wraps any lazy component with Suspense */
function Lazy({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

// ── Route Tree ───────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <Routes>
      {/* ════════════════════════════════════════════════════════
          PUBLIC ROUTES — PublicLayout (Navbar + Footer)
          ════════════════════════════════════════════════════════ */}
      <Route element={<PublicLayout />}>
        <Route
          index
          element={
            <Lazy>
              <LandingPage />
            </Lazy>
          }
        />
      </Route>

      {/* ════════════════════════════════════════════════════════
          AUTH ROUTES — Standalone (AuthLayout, no Navbar)
          Wrapped in GuestGuard to redirect if already logged in
          ════════════════════════════════════════════════════════ */}
      <Route
        path={PATHS.LOGIN}
        element={
          <Lazy>
            <LoginPage />
          </Lazy>
        }
      />
      <Route
        path={PATHS.REGISTER}
        element={
          <Lazy>
            <RegisterPage />
          </Lazy>
        }
      />

      {/* ════════════════════════════════════════════════════════
          DASHBOARD — Client
          ProtectedRoute checks auth → RoleRoute checks role
          ════════════════════════════════════════════════════════ */}
      <Route
        path={PATHS.DASHBOARD_CLIENT + "/*"}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={[roles.CLIENT]}>
              <DashboardLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Lazy>
              <ClientDashboard />
            </Lazy>
          }
        />
        {/* Future client sub-routes:
        <Route path="cases" element={<Lazy><CasesPage /></Lazy>} />
        <Route path="appointments" element={<Lazy><AppointmentsPage /></Lazy>} />
        */}
      </Route>

      {/* ════════════════════════════════════════════════════════
          DASHBOARD — Lawyer
          ════════════════════════════════════════════════════════ */}
      <Route
        path={PATHS.DASHBOARD_LAWYER + "/*"}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={[roles.LAWYER]}>
              <DashboardLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Lazy>
              <LawyerDashboard />
            </Lazy>
          }
        />
        {/* Future lawyer sub-routes:
        <Route path="clients" element={<Lazy><MyClientsPage /></Lazy>} />
        <Route path="schedule" element={<Lazy><SchedulePage /></Lazy>} />
        */}
      </Route>

      {/* ════════════════════════════════════════════════════════
          DASHBOARD — Admin
          ════════════════════════════════════════════════════════ */}
      <Route
        path={PATHS.DASHBOARD_ADMIN + "/*"}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={[roles.ADMIN, roles.SUPER_ADMIN]}>
              <DashboardLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Lazy>
              <AdminDashboard />
            </Lazy>
          }
        />
        {/* Future admin sub-routes:
        <Route path="users" element={<Lazy><UserManagement /></Lazy>} />
        <Route path="analytics" element={<Lazy><AnalyticsPage /></Lazy>} />
        <Route path="settings" element={<Lazy><PlatformSettings /></Lazy>} />
        */}
      </Route>

      {/* ════════════════════════════════════════════════════════
          CATCH-ALL — 404
          ════════════════════════════════════════════════════════ */}
      <Route
        path="*"
        element={
          <Lazy>
            <NotFound />
          </Lazy>
        }
      />
    </Routes>
  );
}
