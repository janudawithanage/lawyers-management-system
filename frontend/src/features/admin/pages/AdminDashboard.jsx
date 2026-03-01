/**
 * ══════════════════════════════════════════════════════════════
 * ADMIN DASHBOARD — Governance & Verification Control Center
 * ══════════════════════════════════════════════════════════════
 *
 * World-class admin dashboard for platform governance, featuring:
 *
 *  1. System Summary      — Platform status, service health, governance counters
 *  2. System Statistics    — 7 KPI tiles (users, lawyers, pending, cases, etc.)
 *  3. Verification Queue   — Lawyer verification with approve/reject workflow
 *  4. User Management      — Platform user oversight with suspend/activate
 *  5. Reports & Analytics  — Registration trends, case distribution, metrics
 *  6. Activity Log         — Audit trail of all admin actions
 *
 * Architecture mirrors LawyerDashboard / ClientDashboard with:
 *  • Section wrapper component with title, icon, action props
 *  • EmptyState fallback component
 *  • Framer Motion staggered entrance animations
 *  • All data sourced from mockAdminData.js
 */

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  Users,
  BarChart3,
  Activity,
  ArrowRight,
  Inbox,
} from "lucide-react";
import { useAuth } from "@context/AuthContext";

// ── Feature Components ───────────────────────────────────────
import SystemSummary from "../components/SystemSummary";
import StatCard from "../components/StatCard";
import VerificationTable from "../components/VerificationTable";
import UserManagementTable from "../components/UserManagementTable";
import ReportsWidget from "../components/ReportsWidget";
import ActivityLogItem from "../components/ActivityLogItem";

// ── Data ─────────────────────────────────────────────────────
import {
  systemStatus,
  systemStats,
  verificationQueue,
  platformUsers,
  activityLog,
  registrationTrend,
  appointmentTrend,
  caseDistribution,
  getGreeting,
} from "../data/mockAdminData";

// ══════════════════════════════════════════════════════════════
// SECTION WRAPPER — Reusable section container
// ══════════════════════════════════════════════════════════════

function Section({ title, icon: Icon, action, delay = 0, className = "", children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={className}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <div className="flex items-center gap-2">
              {Icon && <Icon className="w-4 h-4 text-gold-400" />}
              <h3 className="text-sm font-semibold text-neutral-300 tracking-wide">
                {title}
              </h3>
            </div>
          )}
          {action && (
            <button className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-gold-400 transition-colors duration-200 group/action">
              {action}
              <ArrowRight className="w-3 h-3 group-hover/action:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      )}
      {children}
    </motion.section>
  );
}

// ── Empty state ──────────────────────────────────────────────

function EmptyState({ icon: Icon = Inbox, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-12 h-12 rounded-2xl bg-dark-700/50 border border-white/[0.06] flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-neutral-600" />
      </div>
      <p className="text-sm text-neutral-500 text-center">{message}</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export default function AdminDashboard() {
  const { user } = useAuth();

  const greeting = useMemo(() => getGreeting(), []);
  const firstName = user?.fullName?.split(" ")[0] || "Administrator";

  // Sort activity log by most recent first
  const sortedActivityLog = useMemo(() => {
    return [...activityLog].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, []);

  return (
    <div className="space-y-8 pb-4">
      {/* ═══════════════════════════════════════════════════════
          1. SYSTEM SUMMARY — Governance Header
          ═══════════════════════════════════════════════════════ */}
      <SystemSummary
        greeting={greeting}
        adminName={firstName}
        adminRole={user?.role}
        systemStatus={systemStatus}
      />

      {/* ═══════════════════════════════════════════════════════
          2. SYSTEM STATISTICS — 7 KPI Cards
          ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {systemStats.map((stat, i) => (
          <StatCard key={stat.id} stat={stat} index={i} />
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════
          3. VERIFICATION QUEUE — Lawyer Approval Workflow
          ═══════════════════════════════════════════════════════ */}
      <Section
        title="Lawyer Verification Queue"
        icon={ShieldCheck}
        action="View All Applications"
        delay={0.25}
      >
        {verificationQueue.length > 0 ? (
          <VerificationTable lawyers={verificationQueue} />
        ) : (
          <EmptyState
            icon={ShieldCheck}
            message="No pending verification requests. All lawyers are verified."
          />
        )}
      </Section>

      {/* ═══════════════════════════════════════════════════════
          4. USER MANAGEMENT — Platform Oversight
          ═══════════════════════════════════════════════════════ */}
      <Section
        title="User Management"
        icon={Users}
        action="View All Users"
        delay={0.3}
      >
        {platformUsers.length > 0 ? (
          <UserManagementTable users={platformUsers} />
        ) : (
          <EmptyState
            icon={Users}
            message="No users registered on the platform yet."
          />
        )}
      </Section>

      {/* ═══════════════════════════════════════════════════════
          5. REPORTS & ANALYTICS
          ═══════════════════════════════════════════════════════ */}
      <Section
        title="Reports & Analytics"
        icon={BarChart3}
        action="Full Report"
        delay={0.35}
      >
        <ReportsWidget
          registrationTrend={registrationTrend}
          appointmentTrend={appointmentTrend}
          caseDistribution={caseDistribution}
        />
      </Section>

      {/* ═══════════════════════════════════════════════════════
          6. SYSTEM ACTIVITY LOG — Audit Trail
          ═══════════════════════════════════════════════════════ */}
      <Section
        title="System Activity Log"
        icon={Activity}
        action="View Full Audit Trail"
        delay={0.4}
      >
        <div className="rounded-2xl bg-dark-800/30 border border-white/[0.04] p-5">
          {sortedActivityLog.length > 0 ? (
            sortedActivityLog.map((log, i) => (
              <ActivityLogItem
                key={log.id}
                log={log}
                index={i}
                isLast={i === sortedActivityLog.length - 1}
              />
            ))
          ) : (
            <EmptyState
              icon={Activity}
              message="No activity recorded yet. Admin actions will appear here."
            />
          )}
        </div>
      </Section>
    </div>
  );
}
