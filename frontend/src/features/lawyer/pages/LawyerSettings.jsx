/**
 * ══════════════════════════════════════════════════════════════
 * LAWYER SETTINGS — Account & Notification Preferences
 * ══════════════════════════════════════════════════════════════
 *
 *  • Account settings (password change, 2FA)
 *  • Notification preferences
 *  • Consultation settings (fee, duration)
 *  • Privacy & visibility
 *  • Mock save / toast
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Shield,
  Save,
  Bell,
  Lock,
  Eye,
  DollarSign,
  CheckCircle2,
  RotateCcw,
  Clock,
} from "lucide-react";

const DEFAULT_SETTINGS = {
  consultationFee: "5000",
  consultationDuration: "30",
  autoApproveAppointments: false,
  emailNotifications: true,
  smsNotifications: false,
  appointmentReminders: true,
  caseUpdates: true,
  paymentAlerts: true,
  marketingEmails: false,
  profileVisibility: "public",
  showRating: true,
  showCaseCount: true,
  showContactInfo: false,
  twoFactorAuth: false,
  sessionTimeout: "60",
};

export default function LawyerSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  const update = (field, value) => {
    setSettings((p) => ({ ...p, [field]: value }));
    setSaved(false);
  };

  const toggle = (field) => update(field, !settings[field]);
  const handleSave = () => setSaved(true);
  const handleReset = () => { setSettings(DEFAULT_SETTINGS); setSaved(false); };

  const Toggle = ({ field, label, description }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
      <div>
        <p className="text-sm font-medium text-neutral-200">{label}</p>
        {description && <p className="text-[11px] text-neutral-500 mt-0.5">{description}</p>}
      </div>
      <button onClick={() => toggle(field)}
        className={`w-10 h-6 rounded-full flex items-center transition-colors ${settings[field] ? "bg-[#C6A75E]" : "bg-neutral-700"}`}>
        <motion.div animate={{ x: settings[field] ? 18 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-4 h-4 rounded-full bg-white shadow-sm" />
      </button>
    </div>
  );

  const Section = ({ title, icon: Icon, children }) => (
    <div className="p-5 rounded-xl bg-dark-800/40 border border-white/[0.06]">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-[#C6A75E]" />
        <h2 className="text-base font-semibold text-neutral-200">{title}</h2>
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-[#C6A75E]" />
            <span className="text-[11px] font-semibold text-[#C6A75E]/70 uppercase tracking-wider">Practice</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">Settings</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage account preferences & configuration</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-400 border border-white/[0.06] hover:border-white/[0.12] transition-colors">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#C6A75E] to-[#B8963E] text-dark-950 hover:shadow-lg hover:shadow-[#C6A75E]/20 transition-all">
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </div>

      {saved && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          <CheckCircle2 className="w-4 h-4" /> Settings saved successfully
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Consultation Settings */}
        <Section title="Consultation Settings" icon={DollarSign}>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5">Consultation Fee (LKR)</label>
              <input type="number" value={settings.consultationFee} onChange={(e) => update("consultationFee", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-neutral-200 bg-dark-800/60 border border-white/[0.06] focus:outline-none focus:border-[#C6A75E]/30 transition-colors" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5">Session Duration (minutes)</label>
              <select value={settings.consultationDuration} onChange={(e) => update("consultationDuration", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-neutral-200 bg-dark-800/60 border border-white/[0.06] focus:outline-none focus:border-[#C6A75E]/30 transition-colors appearance-none">
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>
            <Toggle field="autoApproveAppointments" label="Auto-approve Appointments" description="Automatically confirm new appointment requests" />
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Notification Preferences" icon={Bell}>
          <Toggle field="emailNotifications" label="Email Notifications" description="Receive notifications via email" />
          <Toggle field="smsNotifications" label="SMS Notifications" description="Receive notifications via SMS" />
          <Toggle field="appointmentReminders" label="Appointment Reminders" description="Get reminders before scheduled appointments" />
          <Toggle field="caseUpdates" label="Case Updates" description="Notifications when case status changes" />
          <Toggle field="paymentAlerts" label="Payment Alerts" description="Get notified about incoming payments" />
          <Toggle field="marketingEmails" label="Marketing Emails" description="Receive promotional content" />
        </Section>

        {/* Privacy */}
        <Section title="Privacy & Visibility" icon={Eye}>
          <div className="mb-4">
            <label className="block text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5">Profile Visibility</label>
            <select value={settings.profileVisibility} onChange={(e) => update("profileVisibility", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm text-neutral-200 bg-dark-800/60 border border-white/[0.06] focus:outline-none focus:border-[#C6A75E]/30 transition-colors appearance-none">
              <option value="public">Public — Visible to all users</option>
              <option value="registered">Registered Users Only</option>
              <option value="private">Private — Not discoverable</option>
            </select>
          </div>
          <Toggle field="showRating" label="Show Rating" description="Display your rating on public profile" />
          <Toggle field="showCaseCount" label="Show Case Count" description="Display completed cases count" />
          <Toggle field="showContactInfo" label="Show Contact Info" description="Display phone/email publicly" />
        </Section>

        {/* Security */}
        <Section title="Security" icon={Lock}>
          <Toggle field="twoFactorAuth" label="Two-Factor Authentication" description="Add an extra layer of security" />
          <div className="mt-4">
            <label className="block text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5">Session Timeout (minutes)</label>
            <select value={settings.sessionTimeout} onChange={(e) => update("sessionTimeout", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm text-neutral-200 bg-dark-800/60 border border-white/[0.06] focus:outline-none focus:border-[#C6A75E]/30 transition-colors appearance-none">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">60 minutes (default)</option>
              <option value="120">2 hours</option>
              <option value="480">8 hours</option>
            </select>
          </div>
          <div className="mt-4">
            <button className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-300 border border-white/[0.06] hover:border-white/[0.12] hover:text-neutral-100 transition-all text-center">
              Change Password
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}
