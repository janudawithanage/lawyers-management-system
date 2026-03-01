/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS NAVIGATION CONFIGURATION
 * Role-Based Sidebar & Menu Structure
 * ══════════════════════════════════════════════════════════════
 *
 * Single source of truth for all dashboard navigation items.
 * Each role gets a curated set of menu items grouped by category.
 *
 * Adding a new nav item:
 *   1. Add icon import from lucide-react
 *   2. Add entry to the correct role's navigation array
 *   3. Ensure the route path exists in routeConfig.js
 *   Done — sidebar renders automatically.
 */

import {
  LayoutDashboard,
  Search,
  CalendarDays,
  FolderOpen,
  FileText,
  Settings,
  Users,
  ShieldCheck,
  BarChart3,
  ScrollText,
  UserCircle,
  Briefcase,
  Clock,
  DollarSign,
  Bell,
  HelpCircle,
  MessageSquare,
  Scale,
  AlertTriangle,
} from "lucide-react";

import config from "@config";

const { roles } = config;

// ── Navigation Item Shape ────────────────────────────────────
// {
//   id:       string     — unique key
//   label:    string     — display name
//   icon:     Component  — lucide icon component
//   path:     string     — relative path (appended to dashboard base)
//   badge?:   number     — notification count (optional)
//   group?:   string     — section header (optional — first item in group)
//   disabled?:boolean    — greyed out with "Coming Soon" tooltip
// }

// ── Client Navigation ────────────────────────────────────────
const clientNavigation = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    path: "",
    group: "Main",
  },
  {
    id: "search-lawyers",
    label: "Find Lawyers",
    icon: Search,
    path: "find-lawyer",
    group: "Services",
  },
  {
    id: "appointments",
    label: "Appointments",
    icon: CalendarDays,
    path: "appointments",
    badge: 2,
  },
  {
    id: "cases",
    label: "My Cases",
    icon: FolderOpen,
    path: "cases",
  },
  {
    id: "payments",
    label: "Payments",
    icon: DollarSign,
    path: "payments",
  },
  {
    id: "documents",
    label: "Documents",
    icon: FileText,
    path: "documents",
  },
  {
    id: "messages",
    label: "Messages",
    icon: MessageSquare,
    path: "messages",
    badge: 5,
    group: "Communication",
  },
  {
    id: "profile",
    label: "My Profile",
    icon: UserCircle,
    path: "profile",
    group: "Account",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    path: "settings",
  },
  {
    id: "help",
    label: "Help & Support",
    icon: HelpCircle,
    path: "help",
  },
];

// ── Lawyer Navigation ────────────────────────────────────────
const lawyerNavigation = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    path: "",
    group: "Main",
  },
  {
    id: "appointments",
    label: "Appointments",
    icon: CalendarDays,
    path: "appointments",
    badge: 3,
    group: "Practice",
  },
  {
    id: "consultations",
    label: "Consultations",
    icon: MessageSquare,
    path: "consultations",
  },
  {
    id: "cases",
    label: "Active Cases",
    icon: Briefcase,
    path: "cases",
  },
  {
    id: "documents",
    label: "Documents",
    icon: FileText,
    path: "documents",
    group: "Management",
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: Clock,
    path: "schedule",
  },
  {
    id: "earnings",
    label: "Earnings",
    icon: DollarSign,
    path: "earnings",
  },
  {
    id: "profile",
    label: "Public Profile",
    icon: UserCircle,
    path: "profile",
    group: "Account",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    path: "settings",
  },
  {
    id: "help",
    label: "Help & Support",
    icon: HelpCircle,
    path: "help",
  },
];

// ── Admin Navigation ─────────────────────────────────────────
const adminNavigation = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    path: "",
    group: "Main",
  },
  {
    id: "verification",
    label: "Lawyer Verification",
    icon: ShieldCheck,
    path: "verification",
    badge: 8,
    group: "Management",
  },
  {
    id: "users",
    label: "User Management",
    icon: Users,
    path: "users",
  },
  {
    id: "appointments-monitor",
    label: "Appointments",
    icon: CalendarDays,
    path: "appointments",
    group: "Monitoring",
  },
  {
    id: "cases",
    label: "All Cases",
    icon: Scale,
    path: "cases",
  },
  {
    id: "payments-monitor",
    label: "Payments",
    icon: DollarSign,
    path: "payments",
  },
  {
    id: "disputes",
    label: "Disputes",
    icon: AlertTriangle,
    path: "disputes",
  },
  {
    id: "config",
    label: "System Config",
    icon: Settings,
    path: "config",
  },
  {
    id: "reports",
    label: "Reports & Analytics",
    icon: BarChart3,
    path: "reports",
    group: "Insights",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    path: "notifications",
  },
  {
    id: "audit",
    label: "System Logs",
    icon: ScrollText,
    path: "audit",
    group: "System",
  },
  {
    id: "settings",
    label: "Platform Settings",
    icon: Settings,
    path: "settings",
  },
];

// ── Role → Navigation Map ────────────────────────────────────
const NAVIGATION_MAP = Object.freeze({
  [roles.CLIENT]: clientNavigation,
  [roles.LAWYER]: lawyerNavigation,
  [roles.ADMIN]: adminNavigation,
  [roles.SUPER_ADMIN]: adminNavigation,
});

/**
 * Get navigation items for a given role.
 * Falls back to client navigation for unknown roles.
 */
export function getNavigationForRole(role) {
  return NAVIGATION_MAP[role] || clientNavigation;
}

/**
 * Get role display configuration (label, color, icon)
 */
export const ROLE_DISPLAY = Object.freeze({
  [roles.CLIENT]: {
    label: "Client",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    dotColor: "bg-blue-400",
  },
  [roles.LAWYER]: {
    label: "Lawyer",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    dotColor: "bg-emerald-400",
  },
  [roles.ADMIN]: {
    label: "Admin",
    color: "text-gold-400",
    bgColor: "bg-gold-500/10",
    borderColor: "border-gold-500/20",
    dotColor: "bg-gold-400",
  },
  [roles.SUPER_ADMIN]: {
    label: "Super Admin",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    dotColor: "bg-purple-400",
  },
});

/**
 * Get display config for a given role.
 */
export function getRoleDisplay(role) {
  return ROLE_DISPLAY[role] || ROLE_DISPLAY[roles.CLIENT];
}

export default NAVIGATION_MAP;
