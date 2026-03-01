/**
 * ══════════════════════════════════════════════════════════════
 * PROFILE FORM — Client Profile Settings Form
 * ══════════════════════════════════════════════════════════════
 *
 * Comprehensive profile editing form with:
 *  • Section-based layout (Personal, Contact, Security, Preferences)
 *  • Avatar upload with camera overlay
 *  • Verification status badge
 *  • Form validation states
 *  • Save/Cancel actions
 *  • Animated transitions
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Globe,
  Camera,
  Save,
  X,
  BadgeCheck,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { languages as languageOptions } from "../data/mockClientData";

function FormField({ label, icon: Icon, children, error }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-400">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[11px] text-red-400">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

export default function ProfileForm({ profile, onSave }) {
  const [formData, setFormData] = useState({
    name: profile.name || "",
    email: profile.email || "",
    phone: profile.phone || "",
    address: profile.address || "",
    language: profile.language || "English",
    dateOfBirth: profile.dateOfBirth || "",
    emergencyName: profile.emergencyContact?.name || "",
    emergencyPhone: profile.emergencyContact?.phone || "",
    emergencyRelation: profile.emergencyContact?.relationship || "",
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    newPassword: false,
    confirm: false,
  });

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    onSave?.(formData);
    setSaving(false);
    setEditing(false);
  };

  const inputClasses = (disabled) =>
    `w-full px-4 py-2.5 rounded-xl text-sm text-neutral-200 bg-dark-600/50 border transition-all duration-200 focus:outline-none ${
      disabled
        ? "border-white/[0.04] cursor-not-allowed opacity-60"
        : "border-white/[0.08] hover:border-white/[0.12] focus:border-gold-500/40 focus:shadow-[0_0_0_3px_rgba(198,167,94,0.1)]"
    }`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* ── Avatar Section ── */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
        <div className="relative group">
          <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-gold-500/20 to-gold-600/10 border-2 border-gold-500/20 flex items-center justify-center overflow-hidden">
            {profile.profile_picture ? (
              <img
                src={profile.profile_picture}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-gold-400">
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            )}
          </div>
          <button className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Camera className="w-6 h-6 text-white" />
          </button>
          {profile.verification_status === "verified" && (
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-dark-800 border-2 border-emerald-500/30 flex items-center justify-center">
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
            </div>
          )}
        </div>

        <div className="text-center sm:text-left">
          <h3 className="text-xl font-bold text-neutral-100">{profile.name}</h3>
          <p className="text-sm text-neutral-400 mt-0.5">{profile.email}</p>
          <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <BadgeCheck className="w-3 h-3" />
              {profile.verification_status === "verified" ? "Verified" : "Unverified"}
            </span>
            <span className="text-[11px] text-neutral-500">
              Member since {new Date(profile.joined).toLocaleDateString("en-LK", { month: "short", year: "numeric" })}
            </span>
          </div>
        </div>

        <div className="sm:ml-auto">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold gradient-gold-btn text-dark-950 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/35 transition-all"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold gradient-gold-btn text-dark-950 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/35 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-dark-600 text-neutral-300 border border-white/[0.06] hover:bg-dark-500 transition-all"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Personal Information ── */}
      <div className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
        <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider mb-5 flex items-center gap-2">
          <User className="w-4 h-4 text-gold-400" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Full Name" icon={User}>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={!editing}
              className={inputClasses(!editing)}
            />
          </FormField>
          <FormField label="Date of Birth" icon={User}>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              disabled={!editing}
              className={inputClasses(!editing)}
            />
          </FormField>
          <FormField label="Email Address" icon={Mail}>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={!editing}
              className={inputClasses(!editing)}
            />
          </FormField>
          <FormField label="Phone Number" icon={Phone}>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              disabled={!editing}
              className={inputClasses(!editing)}
            />
          </FormField>
          <FormField label="Address" icon={MapPin}>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              disabled={!editing}
              className={`${inputClasses(!editing)} sm:col-span-2`}
            />
          </FormField>
          <FormField label="NIC Number" icon={Shield}>
            <input
              type="text"
              value={profile.nic || ""}
              disabled
              className={inputClasses(true)}
            />
          </FormField>
        </div>
      </div>

      {/* ── Preferences ── */}
      <div className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
        <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider mb-5 flex items-center gap-2">
          <Globe className="w-4 h-4 text-gold-400" />
          Preferences
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Language Preference" icon={Globe}>
            <select
              value={formData.language}
              onChange={(e) => handleChange("language", e.target.value)}
              disabled={!editing}
              className={inputClasses(!editing)}
            >
              {languageOptions.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </div>

      {/* ── Emergency Contact ── */}
      <div className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
        <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider mb-5 flex items-center gap-2">
          <Phone className="w-4 h-4 text-gold-400" />
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <FormField label="Contact Name" icon={User}>
            <input
              type="text"
              value={formData.emergencyName}
              onChange={(e) => handleChange("emergencyName", e.target.value)}
              disabled={!editing}
              className={inputClasses(!editing)}
            />
          </FormField>
          <FormField label="Contact Phone" icon={Phone}>
            <input
              type="tel"
              value={formData.emergencyPhone}
              onChange={(e) => handleChange("emergencyPhone", e.target.value)}
              disabled={!editing}
              className={inputClasses(!editing)}
            />
          </FormField>
          <FormField label="Relationship" icon={User}>
            <input
              type="text"
              value={formData.emergencyRelation}
              onChange={(e) => handleChange("emergencyRelation", e.target.value)}
              disabled={!editing}
              className={inputClasses(!editing)}
            />
          </FormField>
        </div>
      </div>

      {/* ── Change Password ── */}
      <div className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
        <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider mb-5 flex items-center gap-2">
          <Lock className="w-4 h-4 text-gold-400" />
          Change Password
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {["current", "newPassword", "confirm"].map((field) => (
            <FormField
              key={field}
              label={
                field === "current"
                  ? "Current Password"
                  : field === "newPassword"
                  ? "New Password"
                  : "Confirm Password"
              }
              icon={Lock}
            >
              <div className="relative">
                <input
                  type={showPassword[field] ? "text" : "password"}
                  value={passwordData[field]}
                  onChange={(e) =>
                    setPasswordData((prev) => ({ ...prev, [field]: e.target.value }))
                  }
                  placeholder="••••••••"
                  className={inputClasses(false)}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword[field] ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </FormField>
          ))}
        </div>
        <button className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-dark-600 text-neutral-300 border border-white/[0.06] hover:bg-dark-500 transition-all">
          <Lock className="w-4 h-4" />
          Update Password
        </button>
      </div>
    </motion.div>
  );
}
