/**
 * ══════════════════════════════════════════════════════════════
 * MY PROFILE PAGE — Client Feature
 * ══════════════════════════════════════════════════════════════
 *
 * Comprehensive client profile dashboard with:
 *  • Profile hero section (avatar, name, verification)
 *  • Account statistics grid
 *  • Personal information section
 *  • Contact & address details
 *  • Emergency contact
 *  • Notification preferences toggles
 *  • Payment methods
 *  • Account activity log
 *  • Skeleton loading
 *  • Animated entrance
 *
 * Future API:
 *   GET  /api/v1/client/profile/full
 *   PUT  /api/v1/client/profile
 *   PUT  /api/v1/client/notifications
 *   POST /api/v1/client/payment-methods
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  BadgeCheck,
  CreditCard,
  Building2,
  Bell,
  BellOff,
  Clock,
  Briefcase,
  FileText,
  DollarSign,
  PencilLine,
  ChevronRight,
  Heart,
  Globe,
  Hash,
  Settings,
  Camera,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { clientProfileFull, formatDate } from "../data/mockClientData";

// ── Skeleton ─────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero skeleton */}
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
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
            <div className="h-3 w-10 mx-auto bg-dark-600/40 rounded mb-2" />
            <div className="h-5 w-8 mx-auto bg-dark-600/50 rounded" />
          </div>
        ))}
      </div>
      {/* Sections skeleton */}
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
        <p className="text-[11px] text-neutral-500 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-sm text-neutral-200 break-words">
          {value || <span className="text-neutral-600 italic">Not provided</span>}
        </p>
      </div>
    </div>
  );
}

// ── Toggle Switch ────────────────────────────────────────────
function Toggle({ enabled, onToggle, label }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full py-2.5 group"
    >
      <span className="text-sm text-neutral-300 group-hover:text-neutral-200 transition-colors">
        {label}
      </span>
      <div
        className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 ${
          enabled ? "bg-gold-500/30" : "bg-dark-600"
        }`}
      >
        <div
          className={`absolute top-0.5 w-4.5 h-4.5 rounded-full transition-all duration-200 ${
            enabled
              ? "left-5 bg-gold-500 shadow-[0_0_8px_rgba(198,167,94,0.3)]"
              : "left-0.5 bg-neutral-500"
          }`}
        />
      </div>
    </button>
  );
}

// ══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export default function MyProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [notifPrefs, setNotifPrefs] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setProfile(clientProfileFull);
      setNotifPrefs(clientProfileFull.notificationPreferences);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleNotif = (key) => {
    setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    // Future: PUT /api/v1/client/notifications
  };

  // ── Stat cards config ──────────────────────────────────────
  const statCards = profile
    ? [
        {
          label: "Appointments",
          value: profile.stats.totalAppointments,
          icon: Calendar,
          color: "text-blue-400",
        },
        {
          label: "Completed",
          value: profile.stats.completedAppointments,
          icon: CheckCircle,
          color: "text-emerald-400",
        },
        {
          label: "Active Cases",
          value: profile.stats.activeCases,
          icon: Briefcase,
          color: "text-gold-400",
        },
        {
          label: "Resolved",
          value: profile.stats.resolvedCases,
          icon: Shield,
          color: "text-emerald-400",
        },
        {
          label: "Documents",
          value: profile.stats.documentsUploaded,
          icon: FileText,
          color: "text-blue-400",
        },
        {
          label: "Total Spent",
          value: `LKR ${(profile.stats.totalSpent / 1000).toFixed(0)}K`,
          icon: DollarSign,
          color: "text-gold-400",
        },
      ]
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-6 max-w-5xl"
    >
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100">
            My Profile
          </h1>
          <p className="text-neutral-400 mt-1 text-sm">
            View and manage your account information
          </p>
        </div>
        <Link
          to="/dashboard/client/settings"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-300 bg-dark-800/60 border border-white/[0.08] hover:border-gold-500/20 hover:text-gold-400 transition-all"
        >
          <Settings className="w-4 h-4" />
          Edit Profile
        </Link>
      </div>

      {loading ? (
        <ProfileSkeleton />
      ) : (
        <>
          {/* ════════ HERO SECTION ════════ */}
          <div className="relative p-6 sm:p-8 rounded-2xl bg-dark-800/40 border border-white/[0.06] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold-500/20 to-transparent" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/[0.02] rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-dark-600/60 border-2 border-gold-500/20 flex items-center justify-center overflow-hidden">
                  {profile.profile_picture ? (
                    <img
                      src={profile.profile_picture}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gold-400">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <button className="absolute inset-0 flex items-center justify-center bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                  <Camera className="w-5 h-5 text-white" />
                </button>
                {profile.verification_status === "verified" && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-dark-950 border-2 border-dark-800 flex items-center justify-center">
                    <BadgeCheck className="w-4 h-4 text-gold-400" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-xl font-bold text-neutral-100 mb-0.5">
                  {profile.name}
                </h2>
                <p className="text-sm text-neutral-400 mb-2">
                  {profile.occupation}
                  {profile.company && ` · ${profile.company}`}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      profile.verification_status === "verified"
                        ? "bg-gold-500/10 text-gold-400 border border-gold-500/20"
                        : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    }`}
                  >
                    {profile.verification_status === "verified" ? (
                      <BadgeCheck className="w-3 h-3" />
                    ) : (
                      <AlertCircle className="w-3 h-3" />
                    )}
                    {profile.verification_status === "verified"
                      ? "Verified Account"
                      : "Pending Verification"}
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Member since{" "}
                    {new Date(profile.joined).toLocaleDateString("en-LK", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <p className="text-sm text-neutral-400 mt-3 leading-relaxed max-w-xl">
                    {profile.bio}
                  </p>
                )}
              </div>

              {/* Edit button (mobile) */}
              <Link
                to="/dashboard/client/settings"
                className="sm:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-300 bg-dark-700/60 border border-white/[0.08] hover:border-gold-500/20 transition-all"
              >
                <PencilLine className="w-4 h-4" />
                Edit
              </Link>
            </div>
          </div>

          {/* ════════ STATS GRID ════════ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {statCards.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  className="flex flex-col items-center p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]"
                >
                  <StatIcon className={`w-4.5 h-4.5 mb-2 ${stat.color}`} />
                  <p className="text-lg font-bold text-neutral-200">{stat.value}</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* ════════ CONTENT GRID ════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ── Personal Information ── */}
            <div className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-gold-400" />
                Personal Information
              </h3>
              <div className="divide-y divide-white/[0.04]">
                <InfoRow icon={User} label="Full Name" value={profile.name} />
                <InfoRow icon={Calendar} label="Date of Birth" value={formatDate(profile.dateOfBirth)} />
                <InfoRow icon={Hash} label="NIC Number" value={profile.nic} />
                <InfoRow icon={Globe} label="Nationality" value={profile.nationality} />
                <InfoRow icon={Heart} label="Marital Status" value={profile.maritalStatus} />
                <InfoRow icon={Briefcase} label="Occupation" value={profile.occupation} />
                {profile.company && (
                  <InfoRow icon={Building2} label="Company" value={profile.company} />
                )}
              </div>
            </div>

            {/* ── Contact & Address ── */}
            <div className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-400" />
                Contact & Address
              </h3>
              <div className="divide-y divide-white/[0.04]">
                <InfoRow icon={Mail} label="Email" value={profile.email} iconColor="text-blue-400" />
                <InfoRow icon={Phone} label="Phone" value={profile.phone} iconColor="text-emerald-400" />
                <InfoRow icon={Globe} label="Language" value={profile.language} />
                <InfoRow icon={MapPin} label="Address" value={profile.address} iconColor="text-gold-400" />
                <InfoRow icon={MapPin} label="District" value={profile.district} />
                <InfoRow icon={Mail} label="Preferred Contact" value={profile.preferredContactMethod === "email" ? "Email" : "Phone"} />
              </div>
            </div>

            {/* ── Emergency Contact ── */}
            <div className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400" />
                Emergency Contact
              </h3>
              {profile.emergencyContact ? (
                <div className="divide-y divide-white/[0.04]">
                  <InfoRow icon={User} label="Name" value={profile.emergencyContact.name} />
                  <InfoRow icon={Phone} label="Phone" value={profile.emergencyContact.phone} iconColor="text-emerald-400" />
                  <InfoRow icon={Heart} label="Relationship" value={profile.emergencyContact.relationship} />
                </div>
              ) : (
                <div className="flex flex-col items-center py-6">
                  <AlertCircle className="w-6 h-6 text-neutral-600 mb-2" />
                  <p className="text-sm text-neutral-500">
                    No emergency contact added
                  </p>
                  <Link
                    to="/dashboard/client/settings"
                    className="text-xs text-gold-400 hover:text-gold-300 mt-1 transition-colors"
                  >
                    Add one →
                  </Link>
                </div>
              )}
            </div>

            {/* ── Notification Preferences ── */}
            <div className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Bell className="w-4 h-4 text-gold-400" />
                Notification Preferences
              </h3>
              <div className="space-y-1 divide-y divide-white/[0.04]">
                <Toggle
                  label="Email Notifications"
                  enabled={notifPrefs.email}
                  onToggle={() => handleToggleNotif("email")}
                />
                <Toggle
                  label="SMS Notifications"
                  enabled={notifPrefs.sms}
                  onToggle={() => handleToggleNotif("sms")}
                />
                <Toggle
                  label="Push Notifications"
                  enabled={notifPrefs.push}
                  onToggle={() => handleToggleNotif("push")}
                />
                <Toggle
                  label="Appointment Reminders"
                  enabled={notifPrefs.appointmentReminders}
                  onToggle={() => handleToggleNotif("appointmentReminders")}
                />
                <Toggle
                  label="Case Updates"
                  enabled={notifPrefs.caseUpdates}
                  onToggle={() => handleToggleNotif("caseUpdates")}
                />
                <Toggle
                  label="Promotions & News"
                  enabled={notifPrefs.promotions}
                  onToggle={() => handleToggleNotif("promotions")}
                />
              </div>
            </div>
          </div>

          {/* ════════ PAYMENT METHODS ════════ */}
          <div className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gold-400" />
                Payment Methods
              </h3>
              <button className="text-[11px] text-gold-400 hover:text-gold-300 font-medium transition-colors">
                + Add New
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    pm.isDefault
                      ? "bg-gold-500/[0.05] border-gold-500/15"
                      : "bg-dark-900/30 border-white/[0.04]"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-dark-700/60 border border-white/[0.06] flex items-center justify-center">
                    {pm.type === "card" ? (
                      <CreditCard className="w-4.5 h-4.5 text-neutral-400" />
                    ) : (
                      <Building2 className="w-4.5 h-4.5 text-neutral-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-200">
                      {pm.type === "card"
                        ? `${pm.brand} •••• ${pm.last4}`
                        : `${pm.bankName} •••• ${pm.last4}`}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      {pm.type === "card" ? `Expires ${pm.expiry}` : "Bank Account"}
                    </p>
                  </div>
                  {pm.isDefault && (
                    <span className="text-[10px] font-semibold text-gold-400 px-2 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/15">
                      Default
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ════════ ACTIVITY LOG ════════ */}
          <div className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
            <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-400" />
              Account Activity
            </h3>
            <div className="space-y-0 divide-y divide-white/[0.04]">
              {profile.activityLog.map((log, i) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  className="flex items-center gap-3 py-3"
                >
                  <div className="w-2 h-2 rounded-full bg-gold-500/40 flex-shrink-0" />
                  <p className="text-sm text-neutral-300 flex-1">{log.action}</p>
                  <span className="text-[11px] text-neutral-500 flex-shrink-0">
                    {formatDate(log.timestamp)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ════════ FOOTER ════════ */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-dark-800/30 border border-white/[0.04]">
            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <Shield className="w-3.5 h-3.5" />
              <span>User ID: {profile.user_id}</span>
              <span className="text-neutral-700">•</span>
              <span>
                Account created:{" "}
                {new Date(profile.joined).toLocaleDateString("en-LK", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <button className="text-[11px] text-red-400/60 hover:text-red-400 transition-colors">
              Delete Account
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
