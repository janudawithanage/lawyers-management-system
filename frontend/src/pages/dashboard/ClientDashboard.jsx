/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS CLIENT DASHBOARD
 * Main dashboard view for Client role
 * ══════════════════════════════════════════════════════════════
 */

import { useAuth } from "@context/AuthContext";

export default function ClientDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100">
            Welcome back, {user?.fullName || "Client"}
          </h1>
          <p className="text-neutral-400 mt-1">
            Manage your legal matters from one place
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Cases", value: "3", icon: "📂", trend: "+1 this month" },
          { label: "Appointments", value: "2", icon: "📅", trend: "Next: Tomorrow" },
          { label: "Documents", value: "12", icon: "📄", trend: "3 pending review" },
          { label: "Messages", value: "5", icon: "💬", trend: "2 unread" },
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

      {/* Quick Actions */}
      <div className="p-6 rounded-xl bg-dark-800/50 border border-white/5">
        <h2 className="text-lg font-semibold text-neutral-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Find a Lawyer", desc: "Search by specialization & district", icon: "🔍" },
            { label: "Book Appointment", desc: "Schedule a consultation", icon: "📞" },
            { label: "Upload Document", desc: "Securely share files with your lawyer", icon: "📤" },
          ].map((action) => (
            <button
              key={action.label}
              className="p-4 rounded-lg bg-dark-700/50 border border-white/5 hover:border-gold-500/30 text-left transition-all duration-200 group"
            >
              <span className="text-xl mb-2 block">{action.icon}</span>
              <p className="text-sm font-medium text-neutral-200 group-hover:text-gold-400 transition-colors">
                {action.label}
              </p>
              <p className="text-xs text-neutral-500 mt-1">{action.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Role Badge */}
      <div className="flex items-center gap-2 text-xs text-neutral-600">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          Client
        </span>
        <span>•</span>
        <span>{user?.email}</span>
      </div>
    </div>
  );
}
