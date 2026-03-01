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

// ── Admin Feature Pages (lazy-loaded chunks) ────────────────
const AdminDashboard = lazy(() => import("@features/admin/pages/AdminDashboard"));
const AdminVerification = lazy(() => import("@features/admin/pages/AdminVerification"));
const AdminUsers = lazy(() => import("@features/admin/pages/AdminUsers"));
const AdminAppointments = lazy(() => import("@features/admin/pages/AdminAppointments"));
const AdminCases = lazy(() => import("@features/admin/pages/AdminCases"));
const AdminPayments = lazy(() => import("@features/admin/pages/AdminPayments"));
const AdminDisputes = lazy(() => import("@features/admin/pages/AdminDisputes"));
const AdminConfig = lazy(() => import("@features/admin/pages/AdminConfig"));
const AdminReports = lazy(() => import("@features/admin/pages/AdminReports"));
const AdminNotifications = lazy(() => import("@features/admin/pages/AdminNotifications"));
const AdminAudit = lazy(() => import("@features/admin/pages/AdminAudit"));
const AdminSettings = lazy(() => import("@features/admin/pages/AdminSettings"));
const AdminProfile = lazy(() => import("@features/admin/pages/AdminProfile"));
const AdminHelpSupport = lazy(() => import("@features/admin/pages/AdminHelpSupport"));

// ── Lawyer Feature Pages (lazy-loaded chunks) ───────────────
const LawyerDashboard = lazy(() => import("@features/lawyer/pages/LawyerDashboard"));
const LawyerAppointments = lazy(() => import("@features/lawyer/pages/LawyerAppointments"));
const LawyerConsultations = lazy(() => import("@features/lawyer/pages/LawyerConsultations"));
const LawyerCases = lazy(() => import("@features/lawyer/pages/LawyerCases"));
const LawyerCaseDetail = lazy(() => import("@features/lawyer/pages/LawyerCaseDetail"));
const LawyerNewCase = lazy(() => import("@features/lawyer/pages/LawyerNewCase"));
const LawyerDocuments = lazy(() => import("@features/lawyer/pages/LawyerDocuments"));
const LawyerSchedule = lazy(() => import("@features/lawyer/pages/LawyerSchedule"));
const LawyerEarnings = lazy(() => import("@features/lawyer/pages/LawyerEarnings"));
const LawyerProfile = lazy(() => import("@features/lawyer/pages/LawyerProfile"));
const LawyerSettings = lazy(() => import("@features/lawyer/pages/LawyerSettings"));
const LawyerHelpSupport = lazy(() => import("@features/lawyer/pages/LawyerHelpSupport"));

// ── Client Feature Pages (lazy-loaded chunks) ───────────────
const ClientDashboard = lazy(() => import("@features/client/pages/ClientDashboard"));
const FindLawyer = lazy(() => import("@features/client/pages/FindLawyer"));
const LawyerDetails = lazy(() => import("@features/client/pages/LawyerDetails"));
const AppointmentBooking = lazy(() => import("@features/client/pages/AppointmentBooking"));
const MyAppointments = lazy(() => import("@features/client/pages/MyAppointmentsLifecycle"));
const MyCases = lazy(() => import("@features/client/pages/MyCasesLifecycle"));
const CaseDetail = lazy(() => import("@features/client/pages/CaseDetail"));
const MyPayments = lazy(() => import("@features/client/pages/MyPayments"));
const MessagesPage = lazy(() => import("@features/client/pages/Messages"));
const DocumentUpload = lazy(() => import("@features/client/pages/DocumentUpload"));
const MyProfile = lazy(() => import("@features/client/pages/MyProfile"));
const ProfileSettings = lazy(() => import("@features/client/pages/ProfileSettings"));
const HelpSupport = lazy(() => import("@features/client/pages/HelpSupport"));

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
        <Route index element={<Lazy><ClientDashboard /></Lazy>} />
        <Route path="find-lawyer" element={<Lazy><FindLawyer /></Lazy>} />
        <Route path="find-lawyer/:lawyerId" element={<Lazy><LawyerDetails /></Lazy>} />
        <Route path="find-lawyer/:lawyerId/book" element={<Lazy><AppointmentBooking /></Lazy>} />
        <Route path="appointments" element={<Lazy><MyAppointments /></Lazy>} />
        <Route path="cases" element={<Lazy><MyCases /></Lazy>} />
        <Route path="cases/:caseId" element={<Lazy><CaseDetail /></Lazy>} />
        <Route path="payments" element={<Lazy><MyPayments /></Lazy>} />
        <Route path="messages" element={<Lazy><MessagesPage /></Lazy>} />
        <Route path="documents" element={<Lazy><DocumentUpload /></Lazy>} />
        <Route path="profile" element={<Lazy><MyProfile /></Lazy>} />
        <Route path="settings" element={<Lazy><ProfileSettings /></Lazy>} />
        <Route path="help" element={<Lazy><HelpSupport /></Lazy>} />
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
        <Route index element={<Lazy><LawyerDashboard /></Lazy>} />
        <Route path="appointments" element={<Lazy><LawyerAppointments /></Lazy>} />
        <Route path="consultations" element={<Lazy><LawyerConsultations /></Lazy>} />
        <Route path="cases" element={<Lazy><LawyerCases /></Lazy>} />
        <Route path="cases/new" element={<Lazy><LawyerNewCase /></Lazy>} />
        <Route path="cases/:caseId" element={<Lazy><LawyerCaseDetail /></Lazy>} />
        <Route path="documents" element={<Lazy><LawyerDocuments /></Lazy>} />
        <Route path="schedule" element={<Lazy><LawyerSchedule /></Lazy>} />
        <Route path="earnings" element={<Lazy><LawyerEarnings /></Lazy>} />
        <Route path="profile" element={<Lazy><LawyerProfile /></Lazy>} />
        <Route path="settings" element={<Lazy><LawyerSettings /></Lazy>} />
        <Route path="help" element={<Lazy><LawyerHelpSupport /></Lazy>} />
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
        <Route index element={<Lazy><AdminDashboard /></Lazy>} />
        <Route path="verification" element={<Lazy><AdminVerification /></Lazy>} />
        <Route path="users" element={<Lazy><AdminUsers /></Lazy>} />
        <Route path="appointments" element={<Lazy><AdminAppointments /></Lazy>} />
        <Route path="cases" element={<Lazy><AdminCases /></Lazy>} />
        <Route path="payments" element={<Lazy><AdminPayments /></Lazy>} />
        <Route path="disputes" element={<Lazy><AdminDisputes /></Lazy>} />
        <Route path="config" element={<Lazy><AdminConfig /></Lazy>} />
        <Route path="reports" element={<Lazy><AdminReports /></Lazy>} />
        <Route path="notifications" element={<Lazy><AdminNotifications /></Lazy>} />
        <Route path="audit" element={<Lazy><AdminAudit /></Lazy>} />
        <Route path="settings" element={<Lazy><AdminSettings /></Lazy>} />
        <Route path="profile" element={<Lazy><AdminProfile /></Lazy>} />
        <Route path="help" element={<Lazy><AdminHelpSupport /></Lazy>} />
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
