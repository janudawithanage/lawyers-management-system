/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS COUNTDOWN TIMER — Premium Real-Time Timer
 * ══════════════════════════════════════════════════════════════
 *
 * Renders a live countdown to a deadline timestamp.
 * Changes color based on urgency (green → amber → red).
 * Calls onExpire callback when timer hits zero.
 */

import { useState, useEffect, useCallback } from "react";
import { getTimeRemaining, getUrgencyLevel } from "@utils/timeHelpers";
import { Clock, AlertTriangle, XCircle } from "lucide-react";

const URGENCY_STYLES = {
  normal: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: Clock,
  },
  warning: {
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: AlertTriangle,
  },
  critical: {
    text: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    icon: AlertTriangle,
  },
  expired: {
    text: "text-neutral-500",
    bg: "bg-neutral-500/10",
    border: "border-neutral-500/20",
    icon: XCircle,
  },
};

export default function CountdownTimer({
  deadline,
  totalDuration,
  onExpire,
  label = "Time Remaining",
  variant = "inline",
  showLabel = true,
  className = "",
}) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(deadline));
  const [urgency, setUrgency] = useState(() =>
    getUrgencyLevel(deadline, totalDuration || deadline - Date.now())
  );

  const handleExpire = useCallback(() => {
    if (onExpire) onExpire();
  }, [onExpire]);

  useEffect(() => {
    if (!deadline) return;

    const tick = () => {
      const remaining = getTimeRemaining(deadline);
      setTimeLeft(remaining);

      const newUrgency = getUrgencyLevel(
        deadline,
        totalDuration || deadline - (Date.now() - remaining.total)
      );
      setUrgency(newUrgency);

      if (remaining.expired) {
        handleExpire();
        clearInterval(interval);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [deadline, totalDuration, handleExpire]);

  if (!deadline) return null;

  const style = URGENCY_STYLES[urgency];
  const Icon = style.icon;

  // Format the timer display
  const formatTime = () => {
    if (timeLeft.expired) return "Expired";
    if (timeLeft.days > 0) return `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`;
    if (timeLeft.hours > 0) return `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`;
    return `${String(timeLeft.minutes).padStart(2, "0")}:${String(timeLeft.seconds).padStart(2, "0")}`;
  };

  // ── Compact Inline Variant ──
  if (variant === "inline") {
    return (
      <div className={`inline-flex items-center gap-1.5 ${style.text} ${className}`}>
        <Icon className="w-3.5 h-3.5" />
        <span className={`text-xs font-mono font-semibold ${urgency === "critical" ? "animate-pulse" : ""}`}>
          {formatTime()}
        </span>
      </div>
    );
  }

  // ── Card Variant ──
  if (variant === "card") {
    return (
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${style.bg} ${style.border} ${className}`}>
        <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${style.bg}`}>
          <Icon className={`w-4.5 h-4.5 ${style.text}`} />
        </div>
        <div>
          {showLabel && (
            <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide">{label}</p>
          )}
          <p className={`text-lg font-mono font-bold ${style.text} ${urgency === "critical" ? "animate-pulse" : ""}`}>
            {formatTime()}
          </p>
        </div>
      </div>
    );
  }

  // ── Large Display Variant (for payment modal) ──
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {showLabel && (
        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{label}</p>
      )}
      <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl border ${style.bg} ${style.border}`}>
        <Icon className={`w-5 h-5 ${style.text}`} />
        <span className={`text-3xl font-mono font-bold tabular-nums ${style.text} ${urgency === "critical" ? "animate-pulse" : ""}`}>
          {formatTime()}
        </span>
      </div>
      {urgency === "critical" && !timeLeft.expired && (
        <p className="text-xs text-red-400 font-medium animate-pulse">
          ⚠ Hurry! Time is running out
        </p>
      )}
    </div>
  );
}
