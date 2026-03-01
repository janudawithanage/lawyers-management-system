/**
 * ══════════════════════════════════════════════════════════════
 * PROFILE SETTINGS PAGE — Client Feature
 * ══════════════════════════════════════════════════════════════
 *
 * Full profile management page with:
 *  • Profile form (personal, contact, preferences)
 *  • Avatar upload
 *  • Password change
 *  • Verification status
 *  • Page header & layout
 *  • Animated entrance
 *
 * Future API:
 *   GET    /api/v1/client/profile
 *   PUT    /api/v1/client/profile
 *   POST   /api/v1/client/profile/avatar
 *   PUT    /api/v1/client/auth/password
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Shield } from "lucide-react";
import ProfileForm from "../components/ProfileForm";
import { clientProfile } from "../data/mockClientData";

// ── Skeleton ─────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center gap-6 p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
        <div className="w-24 h-24 rounded-2xl bg-dark-600/60" />
        <div>
          <div className="h-5 w-40 bg-dark-600/50 rounded mb-2" />
          <div className="h-3 w-32 bg-dark-600/40 rounded mb-2" />
          <div className="h-5 w-20 bg-dark-600/30 rounded-full" />
        </div>
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
          <div className="h-4 w-40 bg-dark-600/50 rounded mb-5" />
          <div className="grid grid-cols-2 gap-5">
            {[...Array(4)].map((_, j) => (
              <div key={j}>
                <div className="h-3 w-20 bg-dark-600/40 rounded mb-2" />
                <div className="h-10 bg-dark-600/30 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProfileSettings() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = (formData) => {
    console.log("Profile saved:", formData);
    // Future: PUT /api/v1/client/profile
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-4xl"
    >
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100">
          Profile Settings
        </h1>
        <p className="text-neutral-400 mt-1">
          Manage your personal information and preferences
        </p>
      </div>

      {/* ── Profile Form ── */}
      {loading ? (
        <ProfileSkeleton />
      ) : (
        <ProfileForm profile={clientProfile} onSave={handleSave} />
      )}

      {/* ── Account Info Footer ── */}
      {!loading && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-dark-800/30 border border-white/[0.04]">
          <div className="flex items-center gap-2 text-[11px] text-neutral-500">
            <Shield className="w-3.5 h-3.5" />
            <span>User ID: {clientProfile.user_id}</span>
            <span className="text-neutral-700">•</span>
            <span>
              Account created:{" "}
              {new Date(clientProfile.joined).toLocaleDateString("en-LK", {
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
      )}
    </motion.div>
  );
}
