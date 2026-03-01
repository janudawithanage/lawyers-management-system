/**
 * ══════════════════════════════════════════════════════════════
 * SKELETON LOADER — Premium Skeleton Loading States
 * ══════════════════════════════════════════════════════════════
 *
 * Provides shimmer-animated skeleton placeholders for cards,
 * lists, and dashboard widgets during data loading.
 */

import { cn } from "@utils/cn";

function Bone({ className = "", circle = false }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-white/[0.04] via-white/[0.08] to-white/[0.04] bg-[length:200%_100%]",
        circle ? "rounded-full" : "rounded-lg",
        className
      )}
    />
  );
}

export function SkeletonCard({ className = "" }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Bone circle className="w-10 h-10" />
        <div className="flex-1 space-y-2">
          <Bone className="h-4 w-3/4" />
          <Bone className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Bone className="h-3 w-full" />
        <Bone className="h-3 w-5/6" />
      </div>
      <div className="flex gap-2">
        <Bone className="h-8 w-24 rounded-lg" />
        <Bone className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonList({ rows = 5, className = "" }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.04]"
        >
          <Bone circle className="w-8 h-8" />
          <div className="flex-1 space-y-1.5">
            <Bone className="h-3.5 w-2/3" />
            <Bone className="h-2.5 w-1/3" />
          </div>
          <Bone className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-2">
        <Bone className="h-7 w-64" />
        <Bone className="h-4 w-96" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Bone circle className="w-10 h-10" />
              <Bone className="h-6 w-16" />
            </div>
            <Bone className="h-4 w-24" />
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

export default Bone;
