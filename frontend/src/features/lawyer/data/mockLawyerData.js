/**
 * ══════════════════════════════════════════════════════════════
 * MOCK LAWYER DASHBOARD DATA
 * ══════════════════════════════════════════════════════════════
 *
 * Realistic Sri Lankan legal-domain data that mirrors the shape
 * of the future API responses. Used to build and test the
 * Lawyer Dashboard UI before the backend is wired.
 *
 * Sections:
 *   1. Lawyer Profile
 *   2. Overview Stats (KPI tiles)
 *   3. Active Cases (table rows)
 *   4. Today's Appointments (timeline)
 *   5. Client Requests (accept / reject queue)
 *   6. Performance Metrics
 *   7. Quick Actions
 *   8. Helpers
 */

// ══════════════════════════════════════════════════════════════
// 0. MOCK LAWYER ID — Maps to seed data lawyerId
// ══════════════════════════════════════════════════════════════

export const MOCK_LAWYER_ID = "LWR-003";

// ══════════════════════════════════════════════════════════════
// 1. LAWYER PROFILE
// ══════════════════════════════════════════════════════════════

export const lawyerProfile = {
  fullName: "Atty. Ranjan de Silva",
  enrollmentNo: "BASL/2015/3284",
  specializations: ["Civil Law", "Property Law", "Labour Law"],
  district: "Colombo",
  court: "Colombo District Court",
  yearsOfExperience: 11,
  verificationStatus: "verified", // verified | pending | rejected
  rating: 4.8,
  totalReviews: 127,
  profileCompletion: 92,
  avatar: null,
};

// ══════════════════════════════════════════════════════════════
// 2. OVERVIEW STATS
// ══════════════════════════════════════════════════════════════

export const overviewStats = [
  {
    id: "active-cases",
    label: "Active Cases",
    value: "14",
    change: "+3",
    changeType: "increase",
    period: "vs last month",
    icon: "briefcase",
  },
  {
    id: "pending-hearings",
    label: "Pending Hearings",
    value: "6",
    change: "+2",
    changeType: "increase",
    period: "this week",
    icon: "gavel",
  },
  {
    id: "appointments",
    label: "Appointments Today",
    value: "4",
    change: "0",
    changeType: "neutral",
    period: "scheduled",
    icon: "calendar",
  },
  {
    id: "unread-messages",
    label: "Unread Messages",
    value: "9",
    change: "+5",
    changeType: "increase",
    period: "new today",
    icon: "message",
  },
  {
    id: "documents",
    label: "Documents",
    value: "48",
    change: "+7",
    changeType: "increase",
    period: "this month",
    icon: "file",
  },
];

// ══════════════════════════════════════════════════════════════
// 3. ACTIVE CASES
// ══════════════════════════════════════════════════════════════

export const activeCases = [
  {
    id: "CASE-2026-1024",
    clientName: "Kamal Jayawardena",
    caseType: "Property Dispute",
    description: "Land partition action — inherited property in Galle",
    status: "hearing_scheduled",
    priority: "high",
    nextHearing: "2026-03-12",
    court: "Colombo District Court",
    filedDate: "2025-11-15",
    updatedAt: "2026-02-28T10:30:00",
  },
  {
    id: "CASE-2026-0987",
    clientName: "Samantha Perera",
    caseType: "Labour Law",
    description: "Wrongful termination claim under Shop & Office Act",
    status: "in_progress",
    priority: "medium",
    nextHearing: "2026-03-20",
    court: "Labour Tribunal — Colombo",
    filedDate: "2025-12-02",
    updatedAt: "2026-02-27T14:15:00",
  },
  {
    id: "CASE-2026-0812",
    clientName: "Nimal Fernando",
    caseType: "Motor Accident",
    description: "Compensation claim — road traffic accident on A1 highway",
    status: "filed",
    priority: "low",
    nextHearing: null,
    court: "Magistrate's Court — Kandy",
    filedDate: "2026-01-10",
    updatedAt: "2026-02-25T16:45:00",
  },
  {
    id: "CASE-2026-0756",
    clientName: "Anura Wickramasinghe",
    caseType: "Civil Dispute",
    description: "Contract breach — commercial property lease agreement",
    status: "hearing_scheduled",
    priority: "high",
    nextHearing: "2026-03-08",
    court: "Colombo High Court",
    filedDate: "2025-10-22",
    updatedAt: "2026-02-26T09:00:00",
  },
  {
    id: "CASE-2026-0634",
    clientName: "Dilani Rajapaksa",
    caseType: "Family Law",
    description: "Divorce proceedings — custody and asset division",
    status: "in_progress",
    priority: "medium",
    nextHearing: "2026-04-02",
    court: "Family Court — Colombo",
    filedDate: "2025-09-18",
    updatedAt: "2026-02-24T11:30:00",
  },
];

// ══════════════════════════════════════════════════════════════
// 4. TODAY'S APPOINTMENTS
// ══════════════════════════════════════════════════════════════

export const todaysAppointments = [
  {
    id: "APT-2026-101",
    clientName: "Kamal Jayawardena",
    dateTime: "2026-03-01T09:00:00",
    duration: 45,
    mode: "in-office",     // in-office | video | phone
    status: "confirmed",   // confirmed | pending | completed | cancelled
    caseRef: "CASE-2026-1024",
    notes: "Discuss hearing preparation and witness statements",
  },
  {
    id: "APT-2026-102",
    clientName: "Lakshmi Wijesinghe",
    dateTime: "2026-03-01T10:30:00",
    duration: 30,
    mode: "video",
    status: "confirmed",
    caseRef: null,
    notes: "Initial consultation — property boundary dispute",
  },
  {
    id: "APT-2026-103",
    clientName: "Samantha Perera",
    dateTime: "2026-03-01T14:00:00",
    duration: 60,
    mode: "in-office",
    status: "pending",
    caseRef: "CASE-2026-0987",
    notes: "Review employer's response and plan next steps",
  },
  {
    id: "APT-2026-104",
    clientName: "Priya Mendis",
    dateTime: "2026-03-01T16:00:00",
    duration: 30,
    mode: "phone",
    status: "confirmed",
    caseRef: null,
    notes: "Follow-up on legal aid application status",
  },
];

// ══════════════════════════════════════════════════════════════
// 5. CLIENT REQUESTS (consultation requests awaiting response)
// ══════════════════════════════════════════════════════════════

export const clientRequests = [
  {
    id: "REQ-2026-301",
    clientName: "Tharushi Gunasekara",
    caseType: "Property Law",
    messagePreview: "I need legal advice regarding a land ownership dispute in Negombo. The property was inherited and there are multiple claimants...",
    createdAt: "2026-02-28T08:15:00",
    urgency: "normal",  // urgent | normal
    location: "Negombo",
  },
  {
    id: "REQ-2026-302",
    clientName: "Roshan Abeywickrama",
    caseType: "Labour Law",
    messagePreview: "I was terminated without notice after 8 years of service. My employer refuses to pay severance...",
    createdAt: "2026-02-27T16:40:00",
    urgency: "urgent",
    location: "Colombo",
  },
  {
    id: "REQ-2026-303",
    clientName: "Malika Senanayake",
    caseType: "Civil Law",
    messagePreview: "Looking for representation in a contract dispute with a construction company. Project was abandoned midway...",
    createdAt: "2026-02-27T12:20:00",
    urgency: "normal",
    location: "Kandy",
  },
];

// ══════════════════════════════════════════════════════════════
// 6. PERFORMANCE METRICS
// ══════════════════════════════════════════════════════════════

export const performanceMetrics = {
  caseCompletionRate: 87,
  avgResolutionDays: 42,
  clientSatisfaction: 4.8,
  totalCasesHandled: 156,
  casesThisYear: 18,
  casesWon: 134,
  casesSettled: 14,
  casesLost: 8,
  workloadDistribution: [
    { category: "Property Law", count: 5, percentage: 36 },
    { category: "Labour Law", count: 3, percentage: 21 },
    { category: "Civil Disputes", count: 3, percentage: 21 },
    { category: "Family Law", count: 2, percentage: 15 },
    { category: "Motor Accident", count: 1, percentage: 7 },
  ],
  monthlyTrend: [
    { month: "Sep", cases: 2 },
    { month: "Oct", cases: 3 },
    { month: "Nov", cases: 2 },
    { month: "Dec", cases: 4 },
    { month: "Jan", cases: 3 },
    { month: "Feb", cases: 4 },
  ],
};

// ══════════════════════════════════════════════════════════════
// 7. QUICK ACTIONS
// ══════════════════════════════════════════════════════════════

export const quickActions = [
  {
    id: "new-case",
    label: "New Case",
    description: "Register a new legal case",
    icon: "folder-plus",
    href: "/dashboard/lawyer/cases/new",
    color: "gold",
  },
  {
    id: "manage-schedule",
    label: "My Schedule",
    description: "View & manage availability",
    icon: "calendar-clock",
    href: "/dashboard/lawyer/schedule",
    color: "blue",
  },
  {
    id: "upload-document",
    label: "Upload Documents",
    description: "Add case files & evidence",
    icon: "upload",
    href: "/dashboard/lawyer/documents",
    color: "emerald",
  },
  {
    id: "view-earnings",
    label: "Earnings",
    description: "Track fees & payment history",
    icon: "wallet",
    href: "/dashboard/lawyer/earnings",
    color: "purple",
  },
];

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════

/** Returns time-of-day greeting */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

/** Formats ISO string to relative time (e.g. "5m ago", "2d ago") */
export function formatRelativeTime(isoString) {
  const now = new Date();
  const date = new Date(isoString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-LK", {
    month: "short",
    day: "numeric",
  });
}

/** Formats ISO string to appointment-friendly display */
export function formatAppointmentTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-LK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/** Formats date to short display (e.g. "Mar 12") */
export function formatShortDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-LK", {
    month: "short",
    day: "numeric",
  });
}

/** Formats date to full display (e.g. "March 12, 2026") */
export function formatFullDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
