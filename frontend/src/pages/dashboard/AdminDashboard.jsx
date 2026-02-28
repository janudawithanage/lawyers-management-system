/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS ADMIN DASHBOARD
 * Main dashboard view for Admin / Super Admin role
 * ══════════════════════════════════════════════════════════════
 */

import { useAuth } from "@context/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100">
            Admin Control Panel
          </h1>
          <p className="text-neutral-400 mt-1">
            Platform management & oversight — {user?.fullName}
          </p>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-700 border border-white/10 text-sm text-neutral-300 hover:text-red-400 hover:border-red-500/30 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: "2,451", icon: "👥", trend: "+89 this week" },
          { label: "Active Lawyers", value: "542", icon: "⚖️", trend: "12 pending verification" },
          { label: "Cases (Active)", value: "1,203", icon: "📂", trend: "+67 this month" },
          { label: "Platform Revenue", value: "12.4M", icon: "💎", trend: "+18% MoM" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-xl bg-dark-800/50 border border-white/5 hover:border-gold-500/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-2xl font-bold text-neutral-100">{stat.value}</span>
            </div>
            <p className="text-sm font-medium text-neutral-300">{stat.label}</p>
            <p className="text-xs text-neutral-500 mt-1">{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Verifications */}
        <div className="p-6 rounded-xl bg-dark-800/50 border border-white/5">
          <h2 className="text-lg font-semibold text-neutral-100 mb-4">
            Pending Lawyer Verifications
          </h2>
          <div className="space-y-3">
            {[
              { name: "A.B. Jayasuriya", bar: "BAR-2026-0042", date: "2 hours ago" },
              { name: "M.K. Fernando", bar: "BAR-2026-0041", date: "5 hours ago" },
              { name: "S.L. Wickremesinghe", bar: "BAR-2026-0040", date: "1 day ago" },
            ].map((lawyer, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-dark-700/50 border border-white/5"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-200">{lawyer.name}</p>
                  <p className="text-xs text-neutral-500 font-mono">{lawyer.bar}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-600">{lawyer.date}</span>
                  <button className="px-3 py-1 text-xs rounded-md bg-gold-500/10 text-gold-400 border border-gold-500/20 hover:bg-gold-500/20 transition-colors">
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="p-6 rounded-xl bg-dark-800/50 border border-white/5">
          <h2 className="text-lg font-semibold text-neutral-100 mb-4">System Health</h2>
          <div className="space-y-4">
            {[
              { label: "API Server", status: "operational", uptime: "99.98%" },
              { label: "Database", status: "operational", uptime: "99.99%" },
              { label: "File Storage", status: "operational", uptime: "100%" },
              { label: "Email Service", status: "degraded", uptime: "98.2%" },
            ].map((service, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-neutral-300">{service.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-500">{service.uptime}</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs border ${
                      service.status === "operational"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        service.status === "operational" ? "bg-emerald-400" : "bg-yellow-400 animate-pulse"
                      }`}
                    />
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role Badge */}
      <div className="flex items-center gap-2 text-xs text-neutral-600">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          {user?.role === "super_admin" ? "Super Admin" : "Admin"}
        </span>
        <span>•</span>
        <span>{user?.email}</span>
      </div>
    </div>
  );
}
