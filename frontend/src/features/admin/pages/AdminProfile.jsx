/**
 * ══════════════════════════════════════════════════════════════
 * ADMIN PROFILE — Platform Administrator Profile
 * ══════════════════════════════════════════════════════════════
 *
 * Comprehensive admin profile page with:
 *  • Profile hero section (avatar, name, role badge)
 *  • Platform governance stats
 *  • Personal information
 *  • Contact & security details
 *  • Notification preferences toggles
 *  • Active sessions & login activity
 *  • Skeleton loading state
 *  • Animated entrance
 *
 * Uses auth context for live user info + mock admin profile data
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Shield,
  BadgeCheck,
  Bell,
  Clock,
  Settings,
  Camera,
  Calendar,
  Hash,
  Globe,
  Briefcase,
  Scale,
  Users,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Monitor,
  Smartphone,
  MapPin,
  Key,
  Lock,
  Activity,
} from "lucide-react";
import { useAuth } from "@context/AuthContext";

// ── Mock Admin Profile Data ──────────────────────────────────

const adminProfileData = {
  name: "Platform Admin",
  email: "admin@example.com",
  phone: "+94 11 234 5678",
  role: "System Administrator",
  department: "Platform Governance",
  employeeId: "ADM-001",
  joined: "2024-06-15",
  lastLogin: "2026-03-01T08:30:00",
  timezone: "Asia/Colombo (UTC+5:30)",
  twoFactorEnabled: true,
  bio: "System administrator responsible for platform governance, user management, dispute resolution, and system configuration for the BASL Legal Management System.",
  address: "No. 12, Hulftsdorp Street, Colombo 12, Sri Lanka",
  stats: {
    verifications: 489,
    disputesResolved: 127,
    usersManaged: 2389,
    configChanges: 56,
    systemUptime: "99.97%",
    avgResponseTime: "2.4h",
  },
  notificationPreferences: {
    email: true,
    sms: false,
    push: true,
    verificationAlerts: true,
    disputeAlerts: true,
    systemAlerts: true,
    paymentAlerts: true,
    securityAlerts: true,
  },
  sessions: [
    { device: "MacBook Pro — Chrome 121", location: "Colombo, LK", lastActive: "Active now", icon: Monitor, current: true },
    { device: "iPhone 15 — Safari", location: "Colombo, LK", lastActive: "2 hours ago", icon: Smartphone, current: false },
  ],
  activityLog: [
    { id: 1, action: "Approved lawyer verification — Atty. D.P. Karunaratne", timestamp: "2026-03-01T07:45:00" },
    { id: 2, action: "Resolved dispute DSP-003 — Missed consultation", timestamp: "2026-02-28T14:00:00" },
    { id: 3, action: "Updated system configuration — Payment timeout", timestamp: "2026-02-28T09:15:00" },
    { id: 4, action: "Suspended account USR-007 — Policy violation", timestamp: "2026-02-27T16:30:00" },
    { id: 5, action: "Generated monthly analytics report", timestamp: "2026-02-27T10:00:00" },
    { id: 6, action: "Escalated dispute DSP-004 to legal team", timestamp: "2026-02-25T16:00:00" },
  ],
};

// ── Skeleton ─────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="p-6 sm:p-8 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-dark-600/60" />
          <div className="text-center sm:text-left">
            <div className="h-6 w-48 bg-dark-600/50 rounded mb-2" />
            <div className="h-3 w-32 bg-dark-600/40 rounded mb-3" />
            <div className="h-5 w-20 bg-dark-600/30 rounded-full" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
            <div className="h-3 w-10 mx-auto bg-dark-600/40 rounded mb-2" />
            <div className="h-5 w-8 mx-auto bg-dark-600/50 rounded" />
          </div>
        ))}
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
          <div className="h-4 w-40 bg-dark-600/50 rounded mb-4" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, j) => (
              <div key={j}>
                <div className="h-2.5 w-16 bg-dark-600/30 rounded mb-1.5" />
                <div className="h-3.5 w-32 bg-dark-600/40 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Info Row ─────────────────────────────────────────────────

function InfoRow({ icon: Icon, label, value, iconColor = "text-neutral-500" }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="w-8 h-8 rounded-lg bg-dark-700/50 border border-white/[0.04] flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-neutral-500 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm text-neutral-200 break-words">{value || <span className="text-neutral-600 italic">Not provided</span>}</p>
      </div>
    </div>
  );
}

// ── Toggle Switch ────────────────────────────────────────────

function Toggle({ enabled, onToggle, label }) {
  return (
    <button onClick={onToggle} className="flex items-center justify-between w-full py-2.5 group">
      <span className="text-sm text-neutral-300 group-hover:text-neutral-200 transition-colors">{label}</span>
      <div className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 ${enabled ? "bg-[#C6A75E]/30" : "bg-dark-600"}`}>
        <div className={`absolute top-0.5 w-4.5 h-4.5 rounded-full transition-all duration-200 ${enabled ? "left-5 bg-[#C6A75E] shadow-[0_0_8px_rgba(198,167,94,0.3)]" : "left-0.5 bg-neutral-500"}`} />
      </div>
    </button>
  );
}

// ══════════════════════════════════════════════════════════════

export default function AdminProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [notifPrefs, setNotifPrefs] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setProfile({
        ...adminProfileData,
        name: user?.fullName || adminProfileData.name,
        email: user?.email || adminProfileData.email,
      });
      setNotifPrefs(adminProfileData.notificationPreferences);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [user]);

  const handleToggleNotif = (key) => {
    setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const statCards = profile
    ? [
        { label: "Verifications", value: profile.stats.verifications, icon: ShieldCheck, color: "text-[#C6A75E]" },
        { label: "Disputes Resolved", value: profile.stats.disputesResolved, icon: Scale, color: "text-emerald-400" },
        { label: "Users Managed", value: profile.stats.usersManaged.toLocaleString(), icon: Users, color: "text-blue-400" },
        { label: "Config Changes", value: profile.stats.configChanges, icon: Settings, color: "text-purple-400" },
        { label: "System Uptime", value: profile.stats.systemUptime, icon: Activity, color: "text-emerald-400" },
        { label: "Avg Response", value: profile.stats.avgResponseTime, icon: Clock, color: "text-amber-400" },
      ]
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-6 max-w-5xl"
    >
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-[#C6A75E]" />
            <span className="text-[11px] font-semibold text-[#C6A75E]/70 uppercase tracking-wider">Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100">My Profile</h1>
          <p className="text-neutral-400 mt-1 text-sm">View and manage your administrator account</p>
        </div>
        <Link
          to="/dashboard/admin/settings"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-300 bg-dark-800/60 border border-white/[0.08] hover:border-[#C6A75E]/20 hover:text-[#C6A75E] transition-all"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </div>

      {loading ? (
        <ProfileSkeleton />
      ) : (
        <>
          {/* ════════ HERO ════════ */}
          <div className="relative p-6 sm:p-8 rounded-2xl bg-dark-800/40 border border-white/[0.06] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#C6A75E]/20 to-transparent" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C6A75E]/[0.02] rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-dark-600/60 border-2 border-[#C6A75E]/20 flex items-center justify-center overflow-hidden">
                  <span className="text-2xl font-bold text-[#C6A75E]">
                    {profile.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                  </span>
                </div>
                <button className="absolute inset-0 flex items-center justify-center bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                  <Camera className="w-5 h-5 text-white" />
                </button>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-dark-950 border-2 border-dark-800 flex items-center justify-center">
                  <BadgeCheck className="w-4 h-4 text-[#C6A75E]" />
                </div>
              </div>

              {/* Info */}
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-xl font-bold text-neutral-100 mb-0.5">{profile.name}</h2>
                <p className="text-sm text-neutral-400 mb-2">{profile.role} · {profile.department}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#C6A75E]/10 text-[#C6A75E] border border-[#C6A75E]/20">
                    <Shield className="w-3 h-3" />
                    Super Admin
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Since {new Date(profile.joined).toLocaleDateString("en-LK", { month: "long", year: "numeric" })}
                  </span>
                </div>
                {profile.bio && (
                  <p className="text-sm text-neutral-400 mt-3 leading-relaxed max-w-xl">{profile.bio}</p>
                )}
              </div>

              {/* Mobile edit */}
              <Link to="/dashboard/admin/settings"
                className="sm:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-300 bg-dark-700/60 border border-white/[0.08] hover:border-[#C6A75E]/20 transition-all">
                <Settings className="w-4 h-4" /> Settings
              </Link>
            </div>
          </div>

          {/* ════════ STATS ════════ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {statCards.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.3 }}
                  className="flex flex-col items-center p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
                  <StatIcon className={`w-4.5 h-4.5 mb-2 ${stat.color}`} />
                  <p className="text-lg font-bold text-neutral-200">{stat.value}</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* ════════ CONTENT GRID ════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-[#C6A75E]" />
                Administrator Information
              </h3>
              <div className="divide-y divide-white/[0.04]">
                <InfoRow icon={User} label="Full Name" value={profile.name} />
                <InfoRow icon={Hash} label="Employee ID" value={profile.employeeId} />
                <InfoRow icon={Briefcase} label="Department" value={profile.department} />
                <InfoRow icon={Shield} label="Role" value={profile.role} />
                <InfoRow icon={Calendar} label="Date Joined" value={new Date(profile.joined).toLocaleDateString("en-LK", { year: "numeric", month: "long", day: "numeric" })} />
              </div>
            </div>

            {/* Contact & Security */}
            <div className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#C6A75E]" />
                Contact & Security
              </h3>
              <div className="divide-y divide-white/[0.04]">
                <InfoRow icon={Mail} label="Email" value={profile.email} iconColor="text-blue-400" />
                <InfoRow icon={Phone} label="Phone" value={profile.phone} iconColor="text-emerald-400" />
                <InfoRow icon={MapPin} label="Office Address" value={profile.address} iconColor="text-[#C6A75E]" />
                <InfoRow icon={Globe} label="Timezone" value={profile.timezone} />
                <InfoRow icon={Key} label="Two-Factor Auth" value={
                  <span className={`inline-flex items-center gap-1 text-sm ${profile.twoFactorEnabled ? "text-emerald-400" : "text-red-400"}`}>
                    {profile.twoFactorEnabled ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    {profile.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </span>
                } />
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#C6A75E]" />
                Notification Preferences
              </h3>
              <div className="space-y-1 divide-y divide-white/[0.04]">
                <Toggle label="Email Notifications" enabled={notifPrefs.email} onToggle={() => handleToggleNotif("email")} />
                <Toggle label="SMS Notifications" enabled={notifPrefs.sms} onToggle={() => handleToggleNotif("sms")} />
                <Toggle label="Push Notifications" enabled={notifPrefs.push} onToggle={() => handleToggleNotif("push")} />
                <Toggle label="Verification Alerts" enabled={notifPrefs.verificationAlerts} onToggle={() => handleToggleNotif("verificationAlerts")} />
                <Toggle label="Dispute Alerts" enabled={notifPrefs.disputeAlerts} onToggle={() => handleToggleNotif("disputeAlerts")} />
                <Toggle label="System Alerts" enabled={notifPrefs.systemAlerts} onToggle={() => handleToggleNotif("systemAlerts")} />
                <Toggle label="Payment Alerts" enabled={notifPrefs.paymentAlerts} onToggle={() => handleToggleNotif("paymentAlerts")} />
                <Toggle label="Security Alerts" enabled={notifPrefs.securityAlerts} onToggle={() => handleToggleNotif("securityAlerts")} />
              </div>
            </div>

            {/* Active Sessions */}
            <div className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-[#C6A75E]" />
                Active Sessions
              </h3>
              <div className="space-y-3">
                {profile.sessions.map((session, i) => {
                  const SessionIcon = session.icon;
                  return (
                    <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${session.current ? "bg-[#C6A75E]/[0.05] border-[#C6A75E]/15" : "bg-dark-900/30 border-white/[0.04]"}`}>
                      <div className="w-10 h-10 rounded-lg bg-dark-700/60 border border-white/[0.06] flex items-center justify-center">
                        <SessionIcon className="w-4.5 h-4.5 text-neutral-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-200">{session.device}</p>
                        <p className="text-[11px] text-neutral-500">{session.location} · {session.lastActive}</p>
                      </div>
                      {session.current ? (
                        <span className="text-[10px] font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/15">Current</span>
                      ) : (
                        <button className="text-[11px] text-red-400/60 hover:text-red-400 transition-colors">Revoke</button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ════════ ACTIVITY LOG ════════ */}
          <div className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
            <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C6A75E]" />
              Recent Activity
            </h3>
            <div className="space-y-0 divide-y divide-white/[0.04]">
              {profile.activityLog.map((log, i) => (
                <motion.div key={log.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06, duration: 0.3 }}
                  className="flex items-center gap-3 py-3">
                  <div className="w-2 h-2 rounded-full bg-[#C6A75E]/40 flex-shrink-0" />
                  <p className="text-sm text-neutral-300 flex-1">{log.action}</p>
                  <span className="text-[11px] text-neutral-500 flex-shrink-0">
                    {new Date(log.timestamp).toLocaleDateString("en-LK", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ════════ FOOTER ════════ */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-dark-800/30 border border-white/[0.04]">
            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin ID: {profile.employeeId}</span>
              <span className="text-neutral-700">•</span>
              <span>Last login: {new Date(profile.lastLogin).toLocaleString("en-LK")}</span>
            </div>
            <Link to="/dashboard/admin/settings" className="text-[11px] text-[#C6A75E]/60 hover:text-[#C6A75E] transition-colors">
              Manage Account →
            </Link>
          </div>
        </>
      )}
    </motion.div>
  );
}
