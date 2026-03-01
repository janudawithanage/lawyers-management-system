/**
 * ══════════════════════════════════════════════════════════════
 * MOCK ADMIN DASHBOARD DATA
 * ══════════════════════════════════════════════════════════════
 *
 * Realistic Sri Lankan legal-platform governance data that
 * mirrors future API response shapes. Powers the Admin
 * Dashboard UI before the backend is wired.
 *
 * Sections:
 *   1. System Status
 *   2. System Statistics (KPI tiles)
 *   3. Lawyer Verification Queue
 *   4. Platform Users
 *   5. Registration Trend (chart data)
 *   6. Case Distribution (chart data)
 *   7. Activity Log (audit trail)
 *   8. Helpers
 *
 * ⚠ SECURITY NOTE
 * All access-control enforcement MUST happen on the backend.
 * This frontend simply renders UI affordances; it does NOT
 * replace server-side authorisation or audit logging.
 */

// ══════════════════════════════════════════════════════════════
// 1. SYSTEM STATUS
// ══════════════════════════════════════════════════════════════

export const systemStatus = {
  overall: "operational", // operational | degraded | maintenance
  lastChecked: "2026-02-28T09:00:00",
  services: [
    { name: "API Server", status: "operational", uptime: "99.98%" },
    { name: "Database", status: "operational", uptime: "99.99%" },
    { name: "File Storage", status: "operational", uptime: "100%" },
    { name: "Email Service", status: "degraded", uptime: "98.2%" },
    { name: "SMS Gateway", status: "operational", uptime: "99.95%" },
  ],
};

// ══════════════════════════════════════════════════════════════
// 2. SYSTEM STATISTICS
// ══════════════════════════════════════════════════════════════

export const systemStats = [
  {
    id: "total-clients",
    label: "Total Clients",
    value: "1,847",
    change: "+124",
    changeType: "increase",
    period: "this month",
    icon: "users",
  },
  {
    id: "total-lawyers",
    label: "Total Lawyers",
    value: "542",
    change: "+18",
    changeType: "increase",
    period: "this month",
    icon: "scale",
  },
  {
    id: "verified-lawyers",
    label: "Verified Lawyers",
    value: "489",
    change: "+12",
    changeType: "increase",
    period: "this month",
    icon: "shield-check",
  },
  {
    id: "pending-approvals",
    label: "Pending Approvals",
    value: "38",
    change: "+7",
    changeType: "increase",
    period: "awaiting review",
    icon: "clock",
  },
  {
    id: "suspended-accounts",
    label: "Suspended",
    value: "15",
    change: "-2",
    changeType: "decrease",
    period: "this month",
    icon: "ban",
  },
  {
    id: "total-appointments",
    label: "Appointments",
    value: "3,214",
    change: "+286",
    changeType: "increase",
    period: "this month",
    icon: "calendar",
  },
  {
    id: "active-cases",
    label: "Active Cases",
    value: "1,203",
    change: "+67",
    changeType: "increase",
    period: "this month",
    icon: "briefcase",
  },
];

// ══════════════════════════════════════════════════════════════
// 3. LAWYER VERIFICATION QUEUE
// ══════════════════════════════════════════════════════════════

export const verificationQueue = [
  {
    id: "LWR-2026-0042",
    name: "A.B. Jayasuriya",
    barRegistrationNumber: "BASL/2026/0042",
    district: "Colombo",
    specialization: "Criminal Law",
    verificationStatus: "pending",
    submittedAt: "2026-02-28T07:30:00",
    email: "ab.jayasuriya@lawmail.lk",
    documents: ["Bar Certificate", "NIC Copy", "Degree Certificate"],
  },
  {
    id: "LWR-2026-0041",
    name: "M.K. Fernando",
    barRegistrationNumber: "BASL/2026/0041",
    district: "Galle",
    specialization: "Civil Law",
    verificationStatus: "pending",
    submittedAt: "2026-02-27T15:20:00",
    email: "mk.fernando@lawmail.lk",
    documents: ["Bar Certificate", "NIC Copy"],
  },
  {
    id: "LWR-2026-0040",
    name: "S.L. Wickremesinghe",
    barRegistrationNumber: "BASL/2026/0040",
    district: "Kandy",
    specialization: "Property Law",
    verificationStatus: "pending",
    submittedAt: "2026-02-27T09:10:00",
    email: "sl.wickremesinghe@lawmail.lk",
    documents: ["Bar Certificate", "NIC Copy", "Degree Certificate", "Proof of Address"],
  },
  {
    id: "LWR-2026-0039",
    name: "D.P. Karunaratne",
    barRegistrationNumber: "BASL/2025/1287",
    district: "Matara",
    specialization: "Labour Law",
    verificationStatus: "verified",
    submittedAt: "2026-02-25T11:45:00",
    email: "dp.karunaratne@lawmail.lk",
    documents: ["Bar Certificate", "NIC Copy", "Degree Certificate"],
  },
  {
    id: "LWR-2026-0038",
    name: "R.N. Pathirana",
    barRegistrationNumber: "BASL/2025/1190",
    district: "Kurunegala",
    specialization: "Family Law",
    verificationStatus: "rejected",
    submittedAt: "2026-02-24T14:00:00",
    email: "rn.pathirana@lawmail.lk",
    documents: ["Bar Certificate"],
    rejectionReason: "Incomplete documentation — missing NIC and degree certificate.",
  },
  {
    id: "LWR-2026-0037",
    name: "T.H. Samarawickrama",
    barRegistrationNumber: "BASL/2025/1155",
    district: "Colombo",
    specialization: "Corporate Law",
    verificationStatus: "verified",
    submittedAt: "2026-02-22T08:30:00",
    email: "th.samarawickrama@lawmail.lk",
    documents: ["Bar Certificate", "NIC Copy", "Degree Certificate"],
  },
];

// ══════════════════════════════════════════════════════════════
// 4. PLATFORM USERS
// ══════════════════════════════════════════════════════════════

export const platformUsers = [
  {
    id: "USR-001",
    name: "Kamal Jayawardena",
    role: "client",
    email: "kamal.j@gmail.com",
    status: "active",
    createdAt: "2026-01-15T08:00:00",
    lastLogin: "2026-02-28T07:45:00",
  },
  {
    id: "USR-002",
    name: "Atty. Ranjan de Silva",
    role: "lawyer",
    email: "ranjan.desilva@lawmail.lk",
    status: "active",
    createdAt: "2025-11-20T10:30:00",
    lastLogin: "2026-02-28T08:15:00",
  },
  {
    id: "USR-003",
    name: "Samantha Perera",
    role: "client",
    email: "samantha.p@outlook.com",
    status: "active",
    createdAt: "2026-02-01T14:20:00",
    lastLogin: "2026-02-27T16:30:00",
  },
  {
    id: "USR-004",
    name: "Atty. Nimalka Fernando",
    role: "lawyer",
    email: "nimalka.f@lawmail.lk",
    status: "suspended",
    createdAt: "2025-08-10T09:00:00",
    lastLogin: "2026-02-20T11:00:00",
    suspensionReason: "Under investigation — client complaint #CMP-2026-0018",
  },
  {
    id: "USR-005",
    name: "Dilani Rajapaksa",
    role: "client",
    email: "dilani.r@yahoo.com",
    status: "active",
    createdAt: "2026-01-28T07:15:00",
    lastLogin: "2026-02-26T09:45:00",
  },
  {
    id: "USR-006",
    name: "Atty. Kamal Perera",
    role: "lawyer",
    email: "kamal.perera@lawmail.lk",
    status: "active",
    createdAt: "2025-06-05T11:00:00",
    lastLogin: "2026-02-28T06:30:00",
  },
  {
    id: "USR-007",
    name: "Priya Mendis",
    role: "client",
    email: "priya.m@gmail.com",
    status: "suspended",
    createdAt: "2025-12-12T13:30:00",
    lastLogin: "2026-02-15T10:00:00",
    suspensionReason: "Terms of service violation — fraudulent activity suspected",
  },
  {
    id: "USR-008",
    name: "Anura Wickramasinghe",
    role: "client",
    email: "anura.w@gmail.com",
    status: "active",
    createdAt: "2026-02-10T08:45:00",
    lastLogin: "2026-02-27T14:20:00",
  },
];

// ══════════════════════════════════════════════════════════════
// 5. REGISTRATION TREND (monthly chart data)
// ══════════════════════════════════════════════════════════════

export const registrationTrend = [
  { month: "Sep", clients: 98, lawyers: 14 },
  { month: "Oct", clients: 124, lawyers: 19 },
  { month: "Nov", clients: 112, lawyers: 16 },
  { month: "Dec", clients: 156, lawyers: 22 },
  { month: "Jan", clients: 189, lawyers: 28 },
  { month: "Feb", clients: 168, lawyers: 21 },
];

// ══════════════════════════════════════════════════════════════
// 6. CASE STATUS DISTRIBUTION
// ══════════════════════════════════════════════════════════════

export const caseDistribution = [
  { status: "Active", count: 1203, percentage: 48, color: "gold" },
  { status: "Resolved", count: 845, percentage: 34, color: "emerald" },
  { status: "Filed", count: 312, percentage: 12, color: "blue" },
  { status: "Dismissed", count: 148, percentage: 6, color: "neutral" },
];

// ══════════════════════════════════════════════════════════════
// 7. ACTIVITY LOG (audit trail)
// ══════════════════════════════════════════════════════════════

export const activityLog = [
  {
    id: "LOG-001",
    type: "verification",
    action: "Approved lawyer verification",
    description: "Verified Atty. D.P. Karunaratne (BASL/2025/1287)",
    adminName: "System Admin",
    timestamp: "2026-02-28T08:45:00",
    severity: "info",
  },
  {
    id: "LOG-002",
    type: "suspension",
    action: "Account suspended",
    description: "Suspended Atty. Nimalka Fernando — complaint #CMP-2026-0018",
    adminName: "System Admin",
    timestamp: "2026-02-27T16:30:00",
    severity: "critical",
  },
  {
    id: "LOG-003",
    type: "verification",
    action: "Rejected lawyer verification",
    description: "Rejected R.N. Pathirana — incomplete documentation",
    adminName: "System Admin",
    timestamp: "2026-02-27T14:15:00",
    severity: "warning",
  },
  {
    id: "LOG-004",
    type: "login",
    action: "Admin login",
    description: "System Admin logged in from 192.168.1.45",
    adminName: "System Admin",
    timestamp: "2026-02-27T08:00:00",
    severity: "info",
  },
  {
    id: "LOG-005",
    type: "activation",
    action: "Account reactivated",
    description: "Reactivated client Anura Wickramasinghe after review",
    adminName: "System Admin",
    timestamp: "2026-02-26T11:20:00",
    severity: "info",
  },
  {
    id: "LOG-006",
    type: "system",
    action: "System maintenance completed",
    description: "Database migration v2.4.1 applied successfully",
    adminName: "System",
    timestamp: "2026-02-25T03:00:00",
    severity: "info",
  },
  {
    id: "LOG-007",
    type: "suspension",
    action: "Account suspended",
    description: "Suspended client Priya Mendis — TOS violation",
    adminName: "System Admin",
    timestamp: "2026-02-24T15:45:00",
    severity: "critical",
  },
  {
    id: "LOG-008",
    type: "verification",
    action: "Approved lawyer verification",
    description: "Verified Atty. T.H. Samarawickrama (BASL/2025/1155)",
    adminName: "System Admin",
    timestamp: "2026-02-23T10:30:00",
    severity: "info",
  },
];

// ══════════════════════════════════════════════════════════════
// 8. APPOINTMENT TREND (chart data)
// ══════════════════════════════════════════════════════════════

export const appointmentTrend = [
  { month: "Sep", total: 412, completed: 380 },
  { month: "Oct", total: 478, completed: 445 },
  { month: "Nov", total: 502, completed: 468 },
  { month: "Dec", total: 534, completed: 501 },
  { month: "Jan", total: 589, completed: 552 },
  { month: "Feb", total: 548, completed: 510 },
];

// ══════════════════════════════════════════════════════════════
// 9. REVENUE TREND (chart data)
// ══════════════════════════════════════════════════════════════

export const revenueTrend = [
  { month: "Sep", revenue: 824000 },
  { month: "Oct", revenue: 956000 },
  { month: "Nov", revenue: 1003000 },
  { month: "Dec", revenue: 1168000 },
  { month: "Jan", revenue: 1295000 },
  { month: "Feb", revenue: 1184000 },
];

// ══════════════════════════════════════════════════════════════
// 10. DISPUTE ENUMS & CONFIG
// ══════════════════════════════════════════════════════════════

export const DisputeStatus = Object.freeze({
  OPEN: "OPEN",
  UNDER_REVIEW: "UNDER_REVIEW",
  ESCALATED: "ESCALATED",
  RESOLVED: "RESOLVED",
  DISMISSED: "DISMISSED",
});

export const DisputePriority = Object.freeze({
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
});

export const DisputeCategory = Object.freeze({
  SERVICE_QUALITY: "Service Quality",
  PAYMENT: "Payment Dispute",
  MISCONDUCT: "Professional Misconduct",
  COMMUNICATION: "Communication Issue",
  BILLING: "Billing Discrepancy",
  OTHER: "Other",
});

// ══════════════════════════════════════════════════════════════
// 11. DISPUTES (mock data)
// ══════════════════════════════════════════════════════════════

export const disputes = [
  {
    id: "DSP-2026-0001",
    subject: "Unresponsive lawyer after payment",
    description:
      "Client paid LKR 25,000 consultation fee but lawyer did not respond for 5 business days. Client is requesting a refund and reassignment to another lawyer.",
    category: DisputeCategory.COMMUNICATION,
    priority: DisputePriority.HIGH,
    status: DisputeStatus.OPEN,
    filedBy: "Kamal Jayawardena",
    filedByRole: "client",
    against: "Atty. Nimalka Fernando",
    againstRole: "lawyer",
    filedAt: "2026-02-27T10:30:00",
    lastUpdated: "2026-02-27T10:30:00",
    relatedCaseId: "CASE-2026-0008",
    relatedAppointmentId: null,
    resolution: null,
    timeline: [
      {
        action: "Dispute filed",
        by: "Kamal Jayawardena",
        at: "2026-02-27T10:30:00",
        note: "Client submitted dispute via platform — 5-day communication gap reported.",
      },
    ],
  },
  {
    id: "DSP-2026-0002",
    subject: "Overcharged for consultation",
    description:
      "Client was charged LKR 15,000 for a phone consultation that was quoted at LKR 8,000. Lawyer claims additional fees for complexity, but no prior agreement was made.",
    category: DisputeCategory.BILLING,
    priority: DisputePriority.MEDIUM,
    status: DisputeStatus.UNDER_REVIEW,
    filedBy: "Samantha Perera",
    filedByRole: "client",
    against: "Atty. Kamal Perera",
    againstRole: "lawyer",
    filedAt: "2026-02-25T14:15:00",
    lastUpdated: "2026-02-26T09:00:00",
    relatedCaseId: null,
    relatedAppointmentId: "APT-2026-0045",
    resolution: null,
    timeline: [
      {
        action: "Dispute filed",
        by: "Samantha Perera",
        at: "2026-02-25T14:15:00",
        note: "Billing discrepancy — quoted LKR 8,000, charged LKR 15,000.",
      },
      {
        action: "Under Review",
        by: "System Admin",
        at: "2026-02-26T09:00:00",
        note: "Admin initiated review. Requested fee breakdown from lawyer.",
      },
    ],
  },
  {
    id: "DSP-2026-0003",
    subject: "Missed court hearing — no prior notice",
    description:
      "Lawyer failed to attend a scheduled court hearing on Feb 20 without informing the client. The case adjournment resulted in additional costs and delays.",
    category: DisputeCategory.MISCONDUCT,
    priority: DisputePriority.CRITICAL,
    status: DisputeStatus.ESCALATED,
    filedBy: "Dilani Rajapaksa",
    filedByRole: "client",
    against: "Atty. Nimalka Fernando",
    againstRole: "lawyer",
    filedAt: "2026-02-21T08:45:00",
    lastUpdated: "2026-02-24T16:00:00",
    relatedCaseId: "CASE-2026-0003",
    relatedAppointmentId: null,
    resolution: null,
    timeline: [
      {
        action: "Dispute filed",
        by: "Dilani Rajapaksa",
        at: "2026-02-21T08:45:00",
        note: "Lawyer missed court hearing on Feb 20 — no prior notice given to client.",
      },
      {
        action: "Under Review",
        by: "System Admin",
        at: "2026-02-22T10:00:00",
        note: "Admin opened investigation. Contacted lawyer for explanation.",
      },
      {
        action: "Escalated",
        by: "System Admin",
        at: "2026-02-24T16:00:00",
        note: "Escalated — lawyer's account suspended pending investigation.",
      },
    ],
  },
  {
    id: "DSP-2026-0004",
    subject: "Refund not processed after cancellation",
    description:
      "Client cancelled appointment within the allowed window but has not received the refund after 10 business days. Support has been unresponsive.",
    category: DisputeCategory.PAYMENT,
    priority: DisputePriority.HIGH,
    status: DisputeStatus.RESOLVED,
    filedBy: "Anura Wickramasinghe",
    filedByRole: "client",
    against: "Platform",
    againstRole: "system",
    filedAt: "2026-02-15T11:00:00",
    lastUpdated: "2026-02-22T14:30:00",
    relatedCaseId: null,
    relatedAppointmentId: "APT-2026-0032",
    resolution:
      "Full refund of LKR 12,000 processed on Feb 22. Support response time improvement noted for follow-up.",
    timeline: [
      {
        action: "Dispute filed",
        by: "Anura Wickramasinghe",
        at: "2026-02-15T11:00:00",
        note: "Refund not received 10 days after cancellation.",
      },
      {
        action: "Under Review",
        by: "System Admin",
        at: "2026-02-16T09:30:00",
        note: "Admin confirmed cancellation was within policy. Payment gateway check initiated.",
      },
      {
        action: "Resolved",
        by: "System Admin",
        at: "2026-02-22T14:30:00",
        note: "Refund processed — LKR 12,000 returned to client's bank account.",
      },
    ],
  },
  {
    id: "DSP-2026-0005",
    subject: "Unsatisfactory legal advice quality",
    description:
      "Client feels the legal advice provided during a video consultation was generic and not tailored to their specific property dispute case.",
    category: DisputeCategory.SERVICE_QUALITY,
    priority: DisputePriority.LOW,
    status: DisputeStatus.DISMISSED,
    filedBy: "Priya Mendis",
    filedByRole: "client",
    against: "Atty. Ranjan de Silva",
    againstRole: "lawyer",
    filedAt: "2026-02-10T16:20:00",
    lastUpdated: "2026-02-14T11:00:00",
    relatedCaseId: null,
    relatedAppointmentId: "APT-2026-0028",
    resolution: null,
    timeline: [
      {
        action: "Dispute filed",
        by: "Priya Mendis",
        at: "2026-02-10T16:20:00",
        note: "Client dissatisfied with consultation quality.",
      },
      {
        action: "Under Review",
        by: "System Admin",
        at: "2026-02-11T10:00:00",
        note: "Reviewed consultation recording. Advice appears to be appropriate for initial consultation scope.",
      },
      {
        action: "Dismissed",
        by: "System Admin",
        at: "2026-02-14T11:00:00",
        note: "Dispute dismissed — consultation was within scope. Client advised to book follow-up for detailed case analysis.",
      },
    ],
  },
  {
    id: "DSP-2026-0006",
    subject: "Document confidentiality breach",
    description:
      "Client's case documents were allegedly shared with a third party without consent. This is a potential violation of attorney-client privilege.",
    category: DisputeCategory.MISCONDUCT,
    priority: DisputePriority.CRITICAL,
    status: DisputeStatus.OPEN,
    filedBy: "Kamal Jayawardena",
    filedByRole: "client",
    against: "Atty. Kamal Perera",
    againstRole: "lawyer",
    filedAt: "2026-02-28T07:00:00",
    lastUpdated: "2026-02-28T07:00:00",
    relatedCaseId: "CASE-2026-0001",
    relatedAppointmentId: null,
    resolution: null,
    timeline: [
      {
        action: "Dispute filed",
        by: "Kamal Jayawardena",
        at: "2026-02-28T07:00:00",
        note: "Urgent — potential confidentiality breach involving case documents.",
      },
    ],
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

/** Formats ISO string to relative time */
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

  return date.toLocaleDateString("en-LK", { month: "short", day: "numeric" });
}

/** Formats ISO to short date (e.g. "Feb 28") */
export function formatShortDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-LK", {
    month: "short",
    day: "numeric",
  });
}

/** Formats ISO to full date (e.g. "February 28, 2026") */
export function formatFullDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Formats ISO to date + time */
export function formatDateTime(isoString) {
  if (!isoString) return "—";
  const d = new Date(isoString);
  return `${d.toLocaleDateString("en-LK", {
    month: "short",
    day: "numeric",
  })}, ${d.toLocaleTimeString("en-LK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}`;
}
