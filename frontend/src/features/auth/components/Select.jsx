/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS SELECT COMPONENT
 * Premium form select with validation states
 * ══════════════════════════════════════════════════════════════
 */

import { forwardRef, useState } from "react";
import { cn } from "../../../utils/cn";

export const Select = forwardRef(
  (
    {
      label,
      error,
      helperText,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value && props.value.length > 0;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="block text-sm font-medium text-neutral-300 mb-2"
          >
            {label}
            {props.required && <span className="text-gold-400 ml-1">*</span>}
          </label>
        )}

        {/* Select Container */}
        <div className="relative">
          {/* Select Field */}
          <select
            ref={ref}
            className={cn(
              // Base styles
              "w-full px-4 py-3 rounded-lg appearance-none",
              "bg-dark-600 border transition-all duration-300",
              "text-neutral-100",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950",

              // Border states
              error
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/40"
                : isFocused || hasValue
                ? "border-gold-500/30 focus:border-gold-500 focus:ring-gold-500/40"
                : "border-white/10 focus:border-gold-500 focus:ring-gold-500/40",

              // Hover state
              !error && "hover:border-white/20",

              // Padding adjustment for dropdown icon
              "pr-10",

              // Disabled state
              "disabled:opacity-50 disabled:cursor-not-allowed",

              // Custom scrollbar for dropdown
              "[&_option]:bg-dark-600 [&_option]:text-neutral-100",

              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          >
            {children}
          </select>

          {/* Dropdown Icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Focus Ring Effect */}
          {isFocused && !error && (
            <div className="absolute inset-0 rounded-lg ring-2 ring-gold-500/20 pointer-events-none animate-pulse" />
          )}
        </div>

        {/* Helper Text / Error */}
        {(error || helperText) && (
          <p
            className={cn(
              "text-xs mt-1.5 animate-fade-in",
              error ? "text-red-400" : "text-neutral-500"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
