/**
 * SL-LMS Client Feature — Barrel Export
 */

// Pages
export { default as ClientDashboard } from "./pages/ClientDashboard";
export { default as SearchLawyers } from "./pages/SearchLawyers";
export { default as AppointmentBooking } from "./pages/AppointmentBooking";
export { default as MyAppointments } from "./pages/MyAppointmentsLifecycle";
export { default as MyCases } from "./pages/MyCasesLifecycle";
export { default as CaseDetail } from "./pages/CaseDetail";
export { default as MyPayments } from "./pages/MyPayments";
export { default as DocumentUpload } from "./pages/DocumentUpload";
export { default as ProfileSettings } from "./pages/ProfileSettings";
export { default as FindLawyer } from "./pages/FindLawyer";
export { default as LawyerDetails } from "./pages/LawyerDetails";
export { default as Messages } from "./pages/Messages";
export { default as MyProfile } from "./pages/MyProfile";
export { default as HelpSupport } from "./pages/HelpSupport";

// Components — Dashboard
export { default as OverviewCard } from "./components/OverviewCard";
export { default as QuickActionCard } from "./components/QuickActionCard";
export { default as AppointmentItem } from "./components/AppointmentItem";
export { default as CaseCard } from "./components/CaseCard";
export { default as ActivityItem } from "./components/ActivityItem";

// Components — Feature
export { default as LawyerCard } from "./components/LawyerCard";
export { default as AppointmentCard } from "./components/AppointmentCard";
export { default as CaseCardFull } from "./components/CaseCardFull";
export { default as DocumentItem } from "./components/DocumentItem";
export { default as Stepper } from "./components/Stepper";
export { default as ProfileForm } from "./components/ProfileForm";
export { default as RatingStars } from "./components/RatingStars";
export { default as ReviewsList } from "./components/ReviewsList";
export { default as LawyerInfoPanel } from "./components/LawyerInfoPanel";
export { default as PaymentModal } from "./components/PaymentModal";
export { default as FollowUpBookingModal } from "./components/FollowUpBookingModal";

// Hooks
export { useClientStore } from "./hooks/useClientStore";

// Data
export * from "./data/mockClientData";
