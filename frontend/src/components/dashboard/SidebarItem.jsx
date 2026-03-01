/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS SIDEBAR ITEM — Individual Navigation Entry
 * ══════════════════════════════════════════════════════════════
 *
 * Features:
 *  • Gold active indicator bar
 *  • Smooth hover transitions
 *  • Collapsed mode: icon-only with tooltip
 *  • Badge support for notification counts
 *  • Disabled state with "Coming Soon" label
 *  • Accessible keyboard navigation
 */

import { NavLink } from "react-router-dom";

export default function SidebarItem({
  item,
  basePath,
  isExpanded,
  isCollapsed,
}) {
  const Icon = item.icon;
  const fullPath = item.path
    ? `${basePath}/${item.path}`
    : basePath;

  if (item.disabled) {
    return (
      <div
        className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-600 cursor-not-allowed select-none"
        title={isCollapsed && !isExpanded ? item.label : undefined}
      >
        {/* Icon */}
        <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg">
          <Icon className="w-[18px] h-[18px]" />
        </div>

        {/* Label */}
        {isExpanded && (
          <div className="flex-1 flex items-center justify-between min-w-0 overflow-hidden">
            <span className="text-sm font-medium truncate">{item.label}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-dark-600/50 text-neutral-500 whitespace-nowrap">
              Soon
            </span>
          </div>
        )}

        {/* Collapsed Tooltip */}
        {isCollapsed && !isExpanded && (
          <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-dark-700 border border-white/10 text-xs text-neutral-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg">
            {item.label}
            <span className="ml-1.5 text-neutral-600">• Soon</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={fullPath}
      end={item.path === ""}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-gold-500/10 text-gold-400"
            : "text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]"
        }`
      }
      title={isCollapsed && !isExpanded ? item.label : undefined}
    >
      {({ isActive }) => (
        <>
          {/* Gold Active Indicator */}
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gold-500 shadow-[0_0_8px_rgba(198,167,94,0.4)]" />
          )}

          {/* Icon Container */}
          <div
            className={`flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-gold-500/15 shadow-[0_0_12px_rgba(198,167,94,0.1)]"
                : "group-hover:bg-white/[0.06]"
            }`}
          >
            <Icon
              className={`w-[18px] h-[18px] transition-colors duration-200 ${
                isActive ? "text-gold-400" : "text-neutral-500 group-hover:text-neutral-300"
              }`}
            />
          </div>

          {/* Label + Badge */}
          {isExpanded && (
            <div className="flex-1 flex items-center justify-between min-w-0 overflow-hidden">
              <span
                className={`text-sm font-medium truncate transition-colors duration-200 ${
                  isActive ? "text-gold-300" : ""
                }`}
              >
                {item.label}
              </span>

              {/* Notification Badge */}
              {item.badge && (
                <span
                  className={`flex-shrink-0 min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full text-[11px] font-semibold ${
                    isActive
                      ? "bg-gold-500/20 text-gold-300"
                      : "bg-dark-600 text-neutral-400"
                  }`}
                >
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </div>
          )}

          {/* Collapsed Badge Dot */}
          {isCollapsed && !isExpanded && item.badge && (
            <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold-500 shadow-[0_0_6px_rgba(198,167,94,0.5)]" />
          )}

          {/* Collapsed Tooltip */}
          {isCollapsed && !isExpanded && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-dark-700 border border-white/10 text-xs text-neutral-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg">
              {item.label}
              {item.badge && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 text-[10px] font-semibold">
                  {item.badge}
                </span>
              )}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
}
