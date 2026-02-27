/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS DESIGN TOKENS — BASL PREMIUM DARK THEME
 * Bar Association of Sri Lanka Brand Alignment
 * ══════════════════════════════════════════════════════════════
 *
 * Centralised design tokens for programmatic access.
 * All visual decisions live here so components stay token-agnostic.
 *
 * Structure:
 *  1. Color System    — Surfaces, accents, text, borders, semantic
 *  2. Typography      — Font families, sizes, weights, line heights
 *  3. Spacing         — Consistent spacing scale
 *  4. Border Radius   — Corner rounding system
 *  5. Shadows         — Elevation & glow system
 *  6. Transitions     — Motion timing
 *  7. Breakpoints     — Responsive design
 *  8. Z-Index         — Stacking order
 */

const theme = {
  /* ─────────────────────────── 1. COLOR SYSTEM ─────────────────────────── */
  colors: {
    /** Surface / Background hierarchy (darkest → lightest) */
    bg: {
      primary: "#000000",       // Page base — true black (BASL identity)
      secondary: "#0a0a0a",     // Alternating sections
      tertiary: "#0f0f0f",      // Elevated surfaces
      elevated: "#141414",      // Cards, dropdowns
      muted: "#1a1a1a",         // Input backgrounds
      card: "rgba(255,255,255,0.02)",
      cardHover: "rgba(255,255,255,0.04)",
    },

    /** BASL Gold — Primary accent (authority, prestige, trust) */
    gold: {
      50: "#fdf8ed",
      100: "#f9edcc",
      200: "#f2d994",
      300: "#e8c15c",
      400: "#d4a84a",           // Primary interactive gold
      500: "#c6a55e",           // Brand gold
      600: "#b08d3e",           // Hover state
      700: "#8f7030",
      800: "#6b5424",
      900: "#4a3a19",
    },

    /** Silver — Secondary accent (subtle elegance) */
    silver: {
      400: "#c0c0c0",
      500: "#a8a8a8",
      600: "#8a8a8a",
    },

    /** Text hierarchy (lightest → darkest) */
    text: {
      primary: "#f5f5f5",       // Headings, primary content
      secondary: "#a3a3a3",     // Body text, descriptions
      muted: "#737373",         // Captions, timestamps
      disabled: "#525252",      // Disabled states
      inverse: "#000000",       // Text on gold backgrounds
    },

    /** Border system */
    border: {
      subtle: "rgba(255,255,255,0.06)",    // Default dividers
      default: "rgba(255,255,255,0.10)",   // Input borders
      strong: "rgba(255,255,255,0.15)",    // Active borders
      gold: "rgba(198,165,94,0.20)",       // Gold accent borders
      goldStrong: "rgba(198,165,94,0.40)", // Gold hover borders
    },

    /** Glassmorphism surfaces */
    glass: {
      white: "rgba(255,255,255,0.03)",
      whiteBorder: "rgba(255,255,255,0.06)",
      gold: "rgba(198,165,94,0.06)",
      goldBorder: "rgba(198,165,94,0.12)",
    },

    /** Semantic / Feedback */
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#3b82f6",
  },

  /* ─────────────────────────── 2. TYPOGRAPHY ─────────────────────────── */
  fonts: {
    /** Inter — Modern, clean, highly legible UI font */
    sans: "'Inter', system-ui, -apple-system, sans-serif",
    /** Playfair Display — Authoritative, serif for headings */
    serif: "'Playfair Display', Georgia, 'Times New Roman', serif",
    /** Mono — Code/data display */
    mono: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
  },

  fontSize: {
    xs: "0.75rem",      // 12px — captions, badges
    sm: "0.875rem",     // 14px — body small, labels
    base: "1rem",       // 16px — body
    lg: "1.125rem",     // 18px — lead text
    xl: "1.25rem",      // 20px — card headings
    "2xl": "1.5rem",    // 24px — section subheads
    "3xl": "1.875rem",  // 30px — section headings (mobile)
    "4xl": "2.25rem",   // 36px — section headings (tablet)
    "5xl": "3rem",      // 48px — hero headings
    "6xl": "3.75rem",   // 60px — hero headings (desktop)
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  lineHeight: {
    tight: 1.1,       // Headings
    snug: 1.3,        // Subheadings
    normal: 1.5,      // UI text
    relaxed: 1.7,     // Body text
    loose: 2,         // Spacious reading
  },

  /* ─────────────────────────── 3. SPACING ─────────────────────────── */
  spacing: {
    px: "1px",
    0.5: "0.125rem",   // 2px
    1: "0.25rem",      // 4px
    1.5: "0.375rem",   // 6px
    2: "0.5rem",       // 8px
    3: "0.75rem",      // 12px
    4: "1rem",         // 16px
    5: "1.25rem",      // 20px
    6: "1.5rem",       // 24px
    8: "2rem",         // 32px
    10: "2.5rem",      // 40px
    12: "3rem",        // 48px
    16: "4rem",        // 64px
    20: "5rem",        // 80px (section padding mobile)
    24: "6rem",        // 96px
    28: "7rem",        // 112px (section padding desktop)
    32: "8rem",        // 128px
  },

  /* ─────────────────────────── 4. BORDER RADIUS ─────────────────────────── */
  radius: {
    sm: "0.5rem",      // 8px  — small elements, badges
    md: "0.75rem",     // 12px — buttons, inputs
    lg: "1rem",        // 16px — cards
    xl: "1.25rem",     // 20px — large cards
    "2xl": "1.5rem",   // 24px — hero cards, modals
    "3xl": "1.875rem", // 30px — feature sections
    full: "9999px",    // Pills, avatars
  },

  /* ─────────────────────────── 5. SHADOWS ─────────────────────────── */
  shadows: {
    /** Card resting state */
    card: "0 4px 24px rgba(0,0,0,0.5)",
    /** Card hover state */
    cardHover: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(198,165,94,0.1)",
    /** Gold glow — premium accent */
    gold: "0 0 20px rgba(198,165,94,0.15), 0 0 60px rgba(198,165,94,0.05)",
    /** Gold button shadow */
    button: "0 4px 16px rgba(198,165,94,0.25)",
    /** Dropdown / popover */
    dropdown: "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
    /** Modal overlay */
    modal: "0 24px 64px rgba(0,0,0,0.7)",
    /** Inner shadow (inputs) */
    inner: "inset 0 2px 4px rgba(0,0,0,0.3)",
  },

  /* ─────────────────────────── 6. TRANSITIONS ─────────────────────────── */
  transition: {
    fast: "150ms ease",
    base: "200ms ease",
    normal: "300ms ease",
    slow: "500ms ease",
    spring: "500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
  },

  /* ─────────────────────────── 7. BREAKPOINTS ─────────────────────────── */
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  /* ─────────────────────────── 8. Z-INDEX ─────────────────────────── */
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    overlay: 30,
    modal: 40,
    navbar: 50,
    toast: 60,
  },
};

export default theme;
