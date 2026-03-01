/**
 * ══════════════════════════════════════════════════════════════
 * ADMIN SYSTEM CONFIGURATION — Platform Settings Panel
 * ══════════════════════════════════════════════════════════════
 *
 * Admin configuration panel for managing platform time windows
 * and system settings. Uses the globalStore updateConfig action.
 *
 *  • Time window controls (lawyer approval, client payment, case payment)
 *  • Live preview of current values
 *  • Save with visual confirmation
 *  • System info sidebar
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Shield,
  Clock,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Server,
  Database,
  Cpu,
  HardDrive,
  Zap,
  Info,
} from "lucide-react";
import { useAppStore } from "@/store/globalStore";

// ══════════════════════════════════════════════════════════════

export default function AdminConfig() {
  const { config, updateConfig } = useAppStore();
  const [localConfig, setLocalConfig] = useState({ ...config });
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (key, value) => {
    const numVal = parseInt(value, 10);
    if (isNaN(numVal) || numVal < 0) return;
    setLocalConfig((prev) => ({ ...prev, [key]: numVal }));
    setHasChanges(true);
    setSaved(false);
  };

  const handleSave = () => {
    updateConfig(localConfig);
    setSaved(true);
    setHasChanges(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setLocalConfig({ ...config });
    setHasChanges(false);
    setSaved(false);
  };

  const configFields = [
    {
      key: "lawyerApprovalHours",
      label: "Lawyer Approval Window",
      description: "How long lawyers have to approve or decline a new appointment request before it auto-expires.",
      unit: "hours",
      icon: Clock,
      min: 1,
      max: 168,
      color: "text-[#C6A75E]",
      bg: "bg-[#C6A75E]/10",
    },
    {
      key: "clientPaymentMinutes",
      label: "Client Payment Window",
      description: "How long clients have to complete payment after an appointment is approved. Countdown timer is shown.",
      unit: "minutes",
      icon: Zap,
      min: 5,
      max: 1440,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      key: "casePaymentDays",
      label: "Case Payment Deadline",
      description: "Default number of days for clients to pay case-related fees after a payment request is issued.",
      unit: "days",
      icon: AlertTriangle,
      min: 1,
      max: 90,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
  ];

  const systemInfo = [
    { label: "Platform Version", value: "2.4.1", icon: Server },
    { label: "Database", value: "PostgreSQL 15", icon: Database },
    { label: "API Server", value: "Node.js 20 LTS", icon: Cpu },
    { label: "Storage", value: "S3-compatible", icon: HardDrive },
    { label: "Cache", value: "Redis 7.2", icon: Zap },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-[#C6A75E]" />
          <span className="text-[11px] font-semibold text-[#C6A75E]/70 uppercase tracking-wider">Administration</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">System Configuration</h1>
        <p className="text-sm text-neutral-500 mt-1">Platform settings, time windows, and system parameters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main Config Panel ─────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Time Windows */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl bg-dark-800/40 border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-4 h-4 text-[#C6A75E]" />
              <h3 className="text-sm font-semibold text-neutral-300">Time Window Configuration</h3>
            </div>

            <div className="space-y-6">
              {configFields.map((field, i) => (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${field.bg}`}>
                      <field.icon className={`w-5 h-5 ${field.color}`} />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-neutral-200">{field.label}</label>
                      <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{field.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <input
                          type="number"
                          value={localConfig[field.key] || ""}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          min={field.min}
                          max={field.max}
                          className="w-28 rounded-xl bg-dark-900 border border-white/[0.06] px-4 py-2.5 text-sm font-mono text-neutral-200 focus:outline-none focus:border-[#C6A75E]/30 transition-colors"
                        />
                        <span className="text-xs text-neutral-500 font-medium">{field.unit}</span>
                        {localConfig[field.key] !== config[field.key] && (
                          <span className="text-[10px] text-amber-400 font-medium">
                            Changed (was {config[field.key]})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {i < configFields.length - 1 && (
                    <div className="mt-5 h-px bg-white/[0.04]" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-6 pt-5 border-t border-white/[0.06]">
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#C6A75E] to-[#B8963E] text-dark-950 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#C6A75E]/20 transition-all"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
              <button
                onClick={handleReset}
                disabled={!hasChanges}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-400 bg-dark-800 border border-white/[0.06] disabled:opacity-40 hover:text-neutral-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>

              <AnimatePresence>
                {saved && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Configuration saved successfully
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Info Note */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-xl bg-blue-500/5 border border-blue-500/15 p-4 flex gap-3"
          >
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-blue-400 font-medium">Configuration Note</p>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Changes to time windows apply immediately to new transactions. Existing appointments and cases
                retain their original deadlines. All configuration changes are logged in the system audit trail.
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Sidebar ────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Current Values */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-2xl bg-dark-800/40 border border-white/[0.06] p-5"
          >
            <h4 className="text-sm font-semibold text-neutral-300 mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#C6A75E]" /> Active Configuration
            </h4>
            <div className="space-y-3">
              {configFields.map((field) => (
                <div key={field.key} className="flex items-center justify-between p-3 rounded-xl bg-dark-900/40 border border-white/[0.04]">
                  <span className="text-xs text-neutral-400">{field.label}</span>
                  <span className="text-sm font-bold text-neutral-200 font-mono">
                    {config[field.key]} {field.unit}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* System Info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="rounded-2xl bg-dark-800/40 border border-white/[0.06] p-5"
          >
            <h4 className="text-sm font-semibold text-neutral-300 mb-4 flex items-center gap-2">
              <Server className="w-4 h-4 text-[#C6A75E]" /> System Information
            </h4>
            <div className="space-y-2">
              {systemInfo.map((info) => (
                <div key={info.label} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-dark-700/30 transition-colors">
                  <info.icon className="w-4 h-4 text-neutral-500" />
                  <div className="flex-1">
                    <p className="text-[11px] text-neutral-500">{info.label}</p>
                    <p className="text-xs text-neutral-200 font-medium">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
