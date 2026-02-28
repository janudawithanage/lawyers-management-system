/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS INPUT COMPONENT
 * Premium form input with validation states
 * ══════════════════════════════════════════════════════════════
 */

import { forwardRef, useState } from "react";
import { cn } from "../../../utils/cn";

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      className = "",
      showPasswordToggle = false,
      showPassword = false,
      onTogglePassword,
      leftIcon,
      rightIcon,
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

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            className={cn(
              // Base styles
              "w-full px-4 py-3 rounded-lg",
              "bg-dark-600 border transition-all duration-300",
              "text-neutral-100 placeholder:text-neutral-500",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950",

              // Border states
              error
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/40"
                : isFocused || hasValue
                ? "border-gold-500/30 focus:border-gold-500 focus:ring-gold-500/40"
                : "border-white/10 focus:border-gold-500 focus:ring-gold-500/40",

              // Hover state
              !error && "hover:border-white/20",

              // Padding adjustments for icons
              leftIcon && "pl-10",
              (rightIcon || showPasswordToggle) && "pr-10",

              // Disabled state
              "disabled:opacity-50 disabled:cursor-not-allowed",

              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {/* Password Toggle */}
          {showPasswordToggle && (
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
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
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          )}

          {/* Right Icon */}
          {rightIcon && !showPasswordToggle && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {rightIcon}
            </div>
          )}

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

Input.displayName = "Input";
