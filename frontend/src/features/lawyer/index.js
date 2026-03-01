/**
 * ══════════════════════════════════════════════════════════════
 * LAWYER FEATURE — Barrel Export
 * ══════════════════════════════════════════════════════════════
 */

// Pages
export { default as LawyerDashboard } from "./pages/LawyerDashboard";
export { default as LawyerAppointments } from "./pages/LawyerAppointments";
export { default as LawyerConsultations } from "./pages/LawyerConsultations";
export { default as LawyerCases } from "./pages/LawyerCases";
export { default as LawyerCaseDetail } from "./pages/LawyerCaseDetail";
export { default as LawyerNewCase } from "./pages/LawyerNewCase";
export { default as LawyerDocuments } from "./pages/LawyerDocuments";
export { default as LawyerSchedule } from "./pages/LawyerSchedule";
export { default as LawyerEarnings } from "./pages/LawyerEarnings";
export { default as LawyerProfile } from "./pages/LawyerProfile";
export { default as LawyerSettings } from "./pages/LawyerSettings";
export { default as LawyerHelpSupport } from "./pages/LawyerHelpSupport";

// Components
export { default as SummaryHeader } from "./components/SummaryHeader";
export { default as StatCard } from "./components/StatCard";
export { default as CaseTable } from "./components/CaseTable";
export { default as LawyerAppointmentItem } from "./components/AppointmentItem";
export { default as RequestItem } from "./components/RequestItem";
export { default as PerformanceWidget } from "./components/PerformanceWidget";
export { default as LawyerQuickActionCard } from "./components/QuickActionCard";

// Hooks
export { default as useLawyerStore } from "./hooks/useLawyerStore";

// Data
export { MOCK_LAWYER_ID } from "./data/mockLawyerData";
