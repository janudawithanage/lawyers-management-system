/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS AUTH LAYOUT
 * Premium Split Layout for Authentication Pages
 * ══════════════════════════════════════════════════════════════
 */

import { Link } from "react-router-dom";
import { Logo } from "../components/common";

export function AuthLayout({ children, title, subtitle, imageSide = "left" }) {
  const imageUrl =
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Left Side - Image (Desktop) */}
      {imageSide === "left" && (
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <ImageSection imageUrl={imageUrl} title={title} subtitle={subtitle} />
        </div>
      )}

      {/* Right Side - Form */}
      <div
        className={`flex-1 flex flex-col ${
          imageSide === "left" ? "lg:w-1/2" : "lg:w-1/2 lg:order-first"
        }`}
      >
        {/* Mobile Hero Banner */}
        <div className="lg:hidden relative h-48 overflow-hidden">
          <ImageSection
            imageUrl={imageUrl}
            title={title}
            subtitle={subtitle}
            isMobile
          />
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar — Back Button + Logo */}
          <div className="p-6 sm:p-8 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-gold-400 transition-colors duration-200 group"
            >
              <svg
                className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
            <Link to="/" className="inline-block">
              <Logo variant="compact" />
            </Link>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
            <div className="w-full max-w-2xl">{children}</div>
          </div>

          {/* Footer */}
          <div className="p-6 sm:p-8 text-center text-sm text-neutral-500">
            <p>© 2026 SL-LMS. Secured & Trusted by Bar Association of Sri Lanka</p>
          </div>
        </div>
      </div>

      {/* Right Side - Image (Desktop) */}
      {imageSide === "right" && (
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <ImageSection imageUrl={imageUrl} title={title} subtitle={subtitle} />
        </div>
      )}
    </div>
  );
}

function ImageSection({ imageUrl, title, subtitle, isMobile = false }) {
  return (
    <>
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        {/* Dark Overlay with Gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-dark-950/95 via-dark-950/90 to-dark-950/80" />
        <div className="absolute inset-0 bg-linear-to-t from-dark-950 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div
        className={`relative z-10 flex flex-col justify-end p-8 sm:p-12 ${
          isMobile ? "h-full" : "h-full"
        }`}
      >
        {/* Gold Accent Line */}
        <div className="w-16 h-1 bg-linear-to-r from-gold-500 to-gold-600 mb-6 animate-slide-in" />

        {/* Title */}
        <h2
          className={`font-serif font-bold text-neutral-100 mb-4 animate-fade-in ${
            isMobile ? "text-2xl" : "text-3xl lg:text-4xl"
          }`}
          style={{ animationDelay: "100ms" }}
        >
          {title}
        </h2>

        {/* Subtitle */}
        <p
          className={`text-neutral-300 max-w-md animate-fade-in ${
            isMobile ? "text-sm" : "text-base lg:text-lg"
          }`}
          style={{ animationDelay: "200ms" }}
        >
          {subtitle}
        </p>

        {/* Trust Badge */}
        {!isMobile && (
          <div
            className="mt-8 flex items-center gap-3 animate-fade-in"
            style={{ animationDelay: "300ms" }}
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <svg
                className="w-5 h-5 text-gold-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-neutral-300 font-medium">
                Verified & Secure
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
