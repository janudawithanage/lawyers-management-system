/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS 404 — NOT FOUND PAGE
 * Branded, responsive 404 page with navigation options
 * ══════════════════════════════════════════════════════════════
 */

import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Visual */}
        <div className="relative mb-8">
          <h1 className="text-[120px] sm:text-[160px] font-bold text-dark-800/50 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl gradient-gold-btn opacity-20 animate-pulse" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100 mb-3">
          Page Not Found
        </h2>
        <p className="text-neutral-400 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-dark-700 border border-white/10 text-sm text-neutral-300 hover:text-neutral-100 hover:border-white/20 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Go Back
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-gold-btn text-sm font-medium text-dark-950 hover:opacity-90 transition-opacity duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Footer Note */}
        <p className="mt-12 text-xs text-neutral-600">
          If you believe this is an error, contact{" "}
          <a
            href="mailto:info@sl-lms.lk"
            className="text-gold-400 hover:text-gold-300 transition-colors"
          >
            info@sl-lms.lk
          </a>
        </p>
      </div>
    </div>
  );
}
