/**
 * ══════════════════════════════════════════════════════════════
 * LAWYER PROFILE — Public Profile Management
 * ══════════════════════════════════════════════════════════════
 *
 *  • Editable professional info (name, specializations, bio)
 *  • Bar Association & SLBA details
 *  • Profile photo placeholder
 *  • Languages, districts, experience
 *  • Mock save
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Shield,
  Save,
  RotateCcw,
  Camera,
  MapPin,
  Award,
  Globe,
  Star,
  CheckCircle2,
  Briefcase,
} from "lucide-react";

const INITIAL_PROFILE = {
  fullName: "Atty. Ranjan de Silva",
  title: "Senior Attorney-at-Law",
  email: "ranjan.desilva@basl.lk",
  phone: "+94 77 234 5678",
  barNumber: "BASL-2015-1234",
  enrollmentYear: "2015",
  bio: "Specializing in commercial law, corporate governance, and intellectual property with over 9 years of experience in the Sri Lankan legal system.",
  specializations: ["Commercial Law", "Corporate Governance", "Intellectual Property"],
  languages: ["Sinhala", "Tamil", "English"],
  districts: ["Colombo", "Gampaha", "Kandy"],
  experience: 9,
  rating: 4.8,
  casesCompleted: 156,
  consultationsCompleted: 412,
};

const SPEC_OPTIONS = ["Commercial Law", "Criminal Law", "Family Law", "Corporate Governance", "Intellectual Property", "Real Estate", "Labour Law", "Tax Law", "Environmental Law", "Constitutional Law"];
const LANG_OPTIONS = ["Sinhala", "Tamil", "English"];
const DISTRICT_OPTIONS = ["Colombo", "Gampaha", "Kandy", "Galle", "Matara", "Kurunegala", "Jaffna", "Batticaloa", "Trincomalee", "Anuradhapura"];

export default function LawyerProfile() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setProfile((p) => ({ ...p, [field]: value }));
    setSaved(false);
  };

  const toggleArrayItem = (field, item) => {
    setProfile((p) => ({
      ...p,
      [field]: p[field].includes(item) ? p[field].filter((i) => i !== item) : [...p[field], item],
    }));
    setSaved(false);
  };

  const handleSave = () => setSaved(true);
  const handleReset = () => { setProfile(INITIAL_PROFILE); setSaved(false); };

  const InputField = ({ label, field, type = "text" }) => (
    <div>
      <label className="block text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} value={profile[field]} onChange={(e) => handleChange(field, e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl text-sm text-neutral-200 bg-dark-800/60 border border-white/[0.06] placeholder:text-neutral-600 focus:outline-none focus:border-[#C6A75E]/30 transition-colors" />
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
          <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">My Profile</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage your public professional profile</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-400 border border-white/[0.06] hover:border-white/[0.12] transition-colors">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#C6A75E] to-[#B8963E] text-dark-950 hover:shadow-lg hover:shadow-[#C6A75E]/20 transition-all">
            <Save className="w-4 h-4" /> Save Profile
          </button>
        </div>
      </div>

      {saved && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          <CheckCircle2 className="w-4 h-4" /> Profile updated successfully
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — Photo + Stats */}
        <div className="space-y-4">
          {/* Profile Photo */}
          <div className="flex flex-col items-center p-6 rounded-xl bg-dark-800/40 border border-white/[0.06]">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C6A75E] to-[#8B7340] flex items-center justify-center">
                <User className="w-10 h-10 text-dark-950" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-dark-700 border border-white/[0.1] flex items-center justify-center text-neutral-400 hover:text-[#C6A75E] transition-colors">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <h3 className="text-lg font-semibold text-neutral-100 mt-3">{profile.fullName}</h3>
            <p className="text-xs text-neutral-500">{profile.title}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3.5 h-3.5 text-[#C6A75E] fill-[#C6A75E]" />
              <span className="text-sm font-semibold text-[#C6A75E]">{profile.rating}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-2">
            {[
              { icon: Briefcase, label: "Cases Completed", value: profile.casesCompleted },
              { icon: User, label: "Consultations", value: profile.consultationsCompleted },
              { icon: Award, label: "Years Experience", value: profile.experience },
              { icon: Globe, label: "Languages", value: profile.languages.length },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/40 border border-white/[0.06]">
                <div className="w-8 h-8 rounded-lg bg-[#C6A75E]/10 flex items-center justify-center"><s.icon className="w-4 h-4 text-[#C6A75E]" /></div>
                <div className="flex-1">
                  <p className="text-[11px] text-neutral-500">{s.label}</p>
                  <p className="text-sm font-semibold text-neutral-200">{s.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right — Editable Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="p-5 rounded-xl bg-dark-800/40 border border-white/[0.06]">
            <h2 className="text-base font-semibold text-neutral-200 mb-4">Personal Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <InputField label="Full Name" field="fullName" />
              <InputField label="Professional Title" field="title" />
              <InputField label="Email" field="email" type="email" />
              <InputField label="Phone" field="phone" type="tel" />
            </div>
          </div>

          {/* Bar Association */}
          <div className="p-5 rounded-xl bg-dark-800/40 border border-white/[0.06]">
            <h2 className="text-base font-semibold text-neutral-200 mb-4">Bar Association Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <InputField label="Bar Number" field="barNumber" />
              <InputField label="Enrollment Year" field="enrollmentYear" />
              <div className="sm:col-span-2">
                <InputField label="Years of Experience" field="experience" type="number" />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="p-5 rounded-xl bg-dark-800/40 border border-white/[0.06]">
            <h2 className="text-base font-semibold text-neutral-200 mb-4">Professional Bio</h2>
            <textarea value={profile.bio} onChange={(e) => handleChange("bio", e.target.value)} rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm text-neutral-200 bg-dark-800/60 border border-white/[0.06] placeholder:text-neutral-600 focus:outline-none focus:border-[#C6A75E]/30 transition-colors resize-none" />
          </div>

          {/* Specializations */}
          <div className="p-5 rounded-xl bg-dark-800/40 border border-white/[0.06]">
            <h2 className="text-base font-semibold text-neutral-200 mb-4">Specializations</h2>
            <div className="flex flex-wrap gap-2">
              {SPEC_OPTIONS.map((s) => (
                <button key={s} onClick={() => toggleArrayItem("specializations", s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${profile.specializations.includes(s) ? "bg-[#C6A75E]/15 text-[#C6A75E] border border-[#C6A75E]/30" : "bg-dark-700/60 text-neutral-500 border border-white/[0.06] hover:text-neutral-300"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Languages & Districts */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-dark-800/40 border border-white/[0.06]">
              <h2 className="text-base font-semibold text-neutral-200 mb-4">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {LANG_OPTIONS.map((l) => (
                  <button key={l} onClick={() => toggleArrayItem("languages", l)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${profile.languages.includes(l) ? "bg-blue-500/15 text-blue-400 border border-blue-500/30" : "bg-dark-700/60 text-neutral-500 border border-white/[0.06] hover:text-neutral-300"}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-5 rounded-xl bg-dark-800/40 border border-white/[0.06]">
              <h2 className="text-base font-semibold text-neutral-200 mb-4">Districts Covered</h2>
              <div className="flex flex-wrap gap-2">
                {DISTRICT_OPTIONS.map((d) => (
                  <button key={d} onClick={() => toggleArrayItem("districts", d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${profile.districts.includes(d) ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-dark-700/60 text-neutral-500 border border-white/[0.06] hover:text-neutral-300"}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
