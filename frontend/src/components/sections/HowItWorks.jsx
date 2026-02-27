import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CalendarCheck,
  Upload,
  BarChart3,
  UserCheck,
  Settings,
  FileText,
  TrendingUp,
  Shield,
  Activity,
  Megaphone,
  PieChart,
  Users,
  Briefcase,
  ShieldCheck,
} from "lucide-react";
import { CLIENT_STEPS, LAWYER_STEPS, ADMIN_STEPS } from "../../constants";
import { Container, SectionHeading } from "../ui";

const ROLES = [
  {
    key: "client",
    label: "For Clients",
    icon: Users,
    steps: CLIENT_STEPS,
    stepIcons: [Search, CalendarCheck, Upload, BarChart3],
    color: "gold",
  },
  {
    key: "lawyer",
    label: "For Lawyers",
    icon: Briefcase,
    steps: LAWYER_STEPS,
    stepIcons: [UserCheck, Settings, FileText, TrendingUp],
    color: "emerald",
  },
  {
    key: "admin",
    label: "For Admins",
    icon: ShieldCheck,
    steps: ADMIN_STEPS,
    stepIcons: [Shield, Activity, Megaphone, PieChart],
    color: "blue",
  },
];

const colorMap = {
  gold: {
    iconBg: "bg-gold-500/10",
    iconText: "text-gold-400",
    step: "text-gold-500",
    line: "bg-gold-500/20",
    tab: "gradient-gold-btn text-dark-950 shadow-lg shadow-gold-500/20",
  },
  emerald: {
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-400",
    step: "text-emerald-400",
    line: "bg-emerald-500/20",
    tab: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20",
  },
  blue: {
    iconBg: "bg-blue-500/10",
    iconText: "text-blue-400",
    step: "text-blue-400",
    line: "bg-blue-500/20",
    tab: "bg-blue-500 text-white shadow-lg shadow-blue-500/20",
  },
};

export default function HowItWorks() {
  const [activeRole, setActiveRole] = useState("client");
  const role = ROLES.find((r) => r.key === activeRole);
  const colors = colorMap[role.color];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-dark-950" aria-label="How it works">
      <Container>
        <SectionHeading
          badge="How It Works"
          title="Simple Steps, Powerful Results"
          subtitle="Whether you're a client seeking legal help, a lawyer growing your practice, or an admin managing the platform — SL-LMS makes it effortless."
        />

        {/* Role Tabs */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-dark-800 rounded-2xl p-1.5 gap-1 border border-white/5">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const isActive = activeRole === r.key;
              return (
                <button
                  key={r.key}
                  onClick={() => setActiveRole(r.key)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? colorMap[r.color].tab
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-white/4"
                  }`}
                  aria-pressed={isActive}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {role.steps.map((step, idx) => {
              const StepIcon = role.stepIcons[idx];
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group"
                >
                  {/* Connector */}
                  {idx < role.steps.length - 1 && (
                    <div
                      className={`hidden lg:block absolute top-12 left-[calc(100%+0.75rem)] w-[calc(100%-1.5rem)] h-px ${colors.line}`}
                      style={{ transform: "translateX(-50%)" }}
                      aria-hidden="true"
                    />
                  )}

                  <div className="surface-card rounded-2xl p-6 hover:surface-card-hover transition-all duration-300 h-full">
                    <span className={`text-xs font-bold ${colors.step} uppercase tracking-wider`}>
                      Step {step.step}
                    </span>

                    <div className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center mt-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <StepIcon className={`w-6 h-6 ${colors.iconText}`} />
                    </div>

                    <h3 className="text-lg font-semibold text-neutral-100 mb-2">{step.title}</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}
