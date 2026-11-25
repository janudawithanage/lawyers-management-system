/**
 * SL-LMS Application Configuration
 * Central source of truth for environment-specific settings.
 *
 * Environment-derived values come from `./env.js`, which validates them at
 * boot. There are deliberately no `||` fallbacks here: a missing variable is
 * a configuration error, not a cue to substitute a plausible default.
 */

import env from "./env.js";

const config = {
  /** Application identity */
  app: {
    name: "SL-LMS",
    fullName: "Sri Lanka Lawyer Management System",
    tagline: "Connecting You with Verified Lawyers Across Sri Lanka",
    version: "1.0.0",
    url: env.appUrl,
    supportEmail: "info@sl-lms.lk",
    supportPhone: "+94 11 234 5678",
  },

  /** API settings */
  api: {
    baseUrl: env.apiUrl,
    timeout: 15000,
  },

  /** Auth */
  auth: {
    tokenKey: "sl_lms_token",
    refreshKey: "sl_lms_refresh",
    loginPath: "/auth/login",
    registerPath: "/auth/register",
    oauthProviders: ["google"],
  },

  /** Feature flags — toggle upcoming features */
  features: {
    videoConsultation: false,
    aiAssistant: false,
    payments: false,
    mobileApp: false,
    multiTenant: false,
  },

  /** Supported locales */
  i18n: {
    defaultLocale: "en",
    supportedLocales: ["en", "si", "ta"],
    localeLabels: {
      en: "English",
      si: "සිංහල",
      ta: "தமிழ்",
    },
  },

  /** User roles */
  roles: {
    CLIENT: "client",
    LAWYER: "lawyer",
    ADMIN: "admin",
    SUPER_ADMIN: "super_admin",
  },

  /** SEO defaults */
  seo: {
    title: "SL-LMS — Sri Lanka Lawyer Management System",
    description:
      "Connect with verified lawyers across Sri Lanka. Search by specialization, district, and language. Book appointments, upload documents, and track cases securely.",
    keywords:
      "Sri Lanka lawyers, legal services, lawyer management, BASL, legal tech, attorney, advocate, Sri Lanka legal platform",
    ogImage: "/og-image.jpg",
  },
};

export default config;
