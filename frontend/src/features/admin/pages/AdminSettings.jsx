/**
 * ══════════════════════════════════════════════════════════════
 * ADMIN SETTINGS — Platform Settings Page
 * ══════════════════════════════════════════════════════════════
 *
 * Administrative platform settings — email, security, etc.
 * Distinct from System Config (time windows). This covers
 * broader platform policies and preferences.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Shield,
  Mail,
  Lock,
  Globe,
  Bell,
  FileText,
  Save,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

// ── Settings Sections ────────────────────────────────────────

const SECTIONS = [
  {
    id: "general",
    title: "General Settings",
    icon: Globe,
    fields: [
      { key: "platformName", label: "Platform Name", type: "text", value: "SL Legal Management System" },
      { key: "supportEmail", label: "Support Email", type: "text", value: "support@sl-lms.lk" },
      { key: "defaultLanguage", label: "Default Language", type: "select", value: "en", options: [{ label: "English", value: "en" }, { label: "Sinhala", value: "si" }, { label: "Tamil", value: "ta" }] },
      { key: "timezone", label: "Timezone", type: "text", value: "Asia/Colombo" },
    ],
  },
  {
    id: "email",
    title: "Email Configuration",
    icon: Mail,
    fields: [
      { key: "smtpHost", label: "SMTP Host", type: "text", value: "smtp.sl-lms.lk" },
      { key: "smtpPort", label: "SMTP Port", type: "text", value: "587" },
      { key: "senderName", label: "Sender Name", type: "text", value: "SL-LMS Platform" },
      { key: "senderEmail", label: "Sender Email", type: "text", value: "noreply@sl-lms.lk" },
    ],
  },
  {
    id: "security",
    title: "Security Policies",
    icon: Lock,
    toggles: [
      { key: "twoFactorRequired", label: "Require Two-Factor Authentication", description: "All admin accounts must use 2FA for login", value: true },
      { key: "sessionTimeout", label: "Auto Session Timeout", description: "Automatically log out inactive users after 30 minutes", value: true },
      { key: "ipWhitelist", label: "IP Whitelisting", description: "Restrict admin panel access to approved IP addresses", value: false },
      { key: "auditLogging", label: "Comprehensive Audit Logging", description: "Log all administrative actions with full detail", value: true },
    ],
  },
  {
    id: "notifications",
    title: "Notification Preferences",
    icon: Bell,
    toggles: [
      { key: "emailNotifs", label: "Email Notifications", description: "Send email alerts for critical system events", value: true },
      { key: "smsNotifs", label: "SMS Notifications", description: "Send SMS for urgent security alerts", value: false },
      { key: "verificationAlerts", label: "Verification Alerts", description: "Notify when new lawyer verification requests arrive", value: true },
      { key: "complaintAlerts", label: "Complaint Alerts", description: "Notify when new client complaints are filed", value: true },
    ],
  },
  {
    id: "legal",
    title: "Legal & Compliance",
    icon: FileText,
    fields: [
      { key: "tosVersion", label: "Terms of Service Version", type: "text", value: "3.2.1" },
      { key: "privacyVersion", label: "Privacy Policy Version", type: "text", value: "2.1.0" },
      { key: "dataRetention", label: "Data Retention (days)", type: "text", value: "365" },
      { key: "gdprCompliance", label: "GDPR Compliance Mode", type: "select", value: "full", options: [{ label: "Full", value: "full" }, { label: "Partial", value: "partial" }, { label: "Off", value: "off" }] },
    ],
  },
];

// ══════════════════════════════════════════════════════════════

export default function AdminSettings() {
  const [formData, setFormData] = useState(() => {
    const data = {};
    SECTIONS.forEach((s) => {
      (s.fields || []).forEach((f) => { data[f.key] = f.value; });
      (s.toggles || []).forEach((t) => { data[t.key] = t.value; });
    });
    return data;
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleToggle = (key) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-[#C6A75E]" />
            <span className="text-[11px] font-semibold text-[#C6A75E]/70 uppercase tracking-wider">Administration</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">Platform Settings</h1>
          <p className="text-sm text-neutral-500 mt-1">Configure platform policies, email, security, and notifications</p>
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {saved && (
              <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved
              </motion.span>
            )}
          </AnimatePresence>
          <button onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#C6A75E] to-[#B8963E] text-dark-950 hover:shadow-lg hover:shadow-[#C6A75E]/20 transition-all">
            <Save className="w-4 h-4" /> Save All
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-5">
        {SECTIONS.map((section, si) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: si * 0.08 }}
            className="rounded-2xl bg-dark-800/40 border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <section.icon className="w-4 h-4 text-[#C6A75E]" />
              <h3 className="text-sm font-semibold text-neutral-300">{section.title}</h3>
            </div>

            {/* Text/Select Fields */}
            {section.fields && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <div key={field.key}>
                    <label className="text-[11px] text-neutral-500 font-medium uppercase tracking-wide">{field.label}</label>
                    {field.type === "select" ? (
                      <select
                        value={formData[field.key]}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className="mt-1 w-full rounded-xl bg-dark-900 border border-white/[0.06] px-4 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-[#C6A75E]/30 transition-colors"
                      >
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={formData[field.key]}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className="mt-1 w-full rounded-xl bg-dark-900 border border-white/[0.06] px-4 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-[#C6A75E]/30 transition-colors"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Toggles */}
            {section.toggles && (
              <div className="space-y-4">
                {section.toggles.map((toggle) => (
                  <div key={toggle.key} className="flex items-center justify-between p-3 rounded-xl bg-dark-900/40 border border-white/[0.04] hover:bg-dark-700/30 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-neutral-200">{toggle.label}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{toggle.description}</p>
                    </div>
                    <button onClick={() => handleToggle(toggle.key)} className="flex-shrink-0 ml-4">
                      {formData[toggle.key] ? (
                        <ToggleRight className="w-8 h-8 text-[#C6A75E]" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-neutral-600" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
