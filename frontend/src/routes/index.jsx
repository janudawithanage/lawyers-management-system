/**
 * SL-LMS Route Definitions
 *
 * Centralised routing with code-splitting via React.lazy.
 * Structured for role-based access and feature-based growth.
 */

import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PublicLayout } from "@layouts";

// ── Lazy-loaded pages ──
const LandingPage = lazy(() => import("@pages/LandingPage"));

// Future pages (uncomment when ready):
// const LoginPage       = lazy(() => import("@features/auth/LoginPage"));
// const RegisterPage    = lazy(() => import("@features/auth/RegisterPage"));
// const LawyerSearch    = lazy(() => import("@features/lawyers/LawyerSearch"));
// const LawyerProfile   = lazy(() => import("@features/lawyers/LawyerProfile"));
// const ClientDashboard = lazy(() => import("@features/dashboard/ClientDashboard"));
// const LawyerDashboard = lazy(() => import("@features/dashboard/LawyerDashboard"));
// const AdminDashboard  = lazy(() => import("@features/dashboard/AdminDashboard"));
// const NotFoundPage    = lazy(() => import("@pages/NotFoundPage"));

/** Page loading fallback */
function PageLoader() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl gradient-gold-btn animate-pulse" />
        <p className="text-sm text-neutral-500 font-medium tracking-wide">Loading…</p>
      </div>
    </div>
  );
}

/** Suspense wrapper */
function SuspenseWrapper({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

// ── Route tree ──
const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <LandingPage />
          </SuspenseWrapper>
        ),
      },
      // Future public routes:
      // { path: "auth/login",    element: <SuspenseWrapper><LoginPage /></SuspenseWrapper> },
      // { path: "auth/register", element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper> },
      // { path: "lawyers",       element: <SuspenseWrapper><LawyerSearch /></SuspenseWrapper> },
      // { path: "lawyers/:id",   element: <SuspenseWrapper><LawyerProfile /></SuspenseWrapper> },
    ],
  },

  // Future: Authenticated dashboard routes
  // {
  //   element: <DashboardLayout allowedRoles={["client"]} />,
  //   children: [
  //     { path: "dashboard",              element: <SuspenseWrapper><ClientDashboard /></SuspenseWrapper> },
  //     { path: "dashboard/cases",        element: <SuspenseWrapper><CasesPage /></SuspenseWrapper> },
  //     { path: "dashboard/appointments", element: <SuspenseWrapper><AppointmentsPage /></SuspenseWrapper> },
  //   ],
  // },
  // {
  //   element: <DashboardLayout allowedRoles={["lawyer"]} />,
  //   children: [
  //     { path: "lawyer/dashboard", element: <SuspenseWrapper><LawyerDashboard /></SuspenseWrapper> },
  //   ],
  // },
  // {
  //   element: <DashboardLayout allowedRoles={["admin", "super_admin"]} />,
  //   children: [
  //     { path: "admin/dashboard", element: <SuspenseWrapper><AdminDashboard /></SuspenseWrapper> },
  //   ],
  // },

  // 404 catch-all
  // { path: "*", element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
