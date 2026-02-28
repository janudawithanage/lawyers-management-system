/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS LAWYER DASHBOARD
 * Main dashboard view for Lawyer role
 * ══════════════════════════════════════════════════════════════
 */

import { useAuth } from "@context/AuthContext";

export default function LawyerDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100">
            Welcome, {user?.fullName || "Counselor"}
          </h1>
          <p className="text-neutral-400 mt-1">
            {user?.barNumber && (
              <span className="text-gold-400 font-mono text-xs mr-2">{user.barNumber}</span>
            )}
            Manage your practice efficiently
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
          { label: "Active Cases", value: "14", icon: "⚖️", trend: "+3 this month" },
          { label: "Clients", value: "28", icon: "👥", trend: "2 new inquiries" },
          { label: "Appointments", value: "6", icon: "📅", trend: "Next: Today 3 PM" },
          { label: "Revenue (LKR)", value: "850K", icon: "💰", trend: "+12% vs last month" },
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

      {/* Today's Schedule */}
      <div className="p-6 rounded-xl bg-dark-800/50 border border-white/5">
        <h2 className="text-lg font-semibold text-neutral-100 mb-4">Today's Schedule</h2>
        <div className="space-y-3">
          {[
            { time: "09:00 AM", client: "Perera v. State", type: "Court Hearing", status: "upcoming" },
            { time: "11:30 AM", client: "Silva Consultation", type: "Video Call", status: "upcoming" },
            { time: "03:00 PM", client: "Fernando Property Case", type: "In-Office", status: "upcoming" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 rounded-lg bg-dark-700/50 border border-white/5"
            >
              <span className="text-xs font-mono text-gold-400 w-20">{item.time}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-200">{item.client}</p>
                <p className="text-xs text-neutral-500">{item.type}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Role Badge */}
      <div className="flex items-center gap-2 text-xs text-neutral-600">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Lawyer
        </span>
        <span>•</span>
        <span>{user?.email}</span>
        {user?.specialization && (
          <>
            <span>•</span>
            <span className="capitalize">{user.specialization} Law</span>
          </>
        )}
      </div>
    </div>
  );
}
