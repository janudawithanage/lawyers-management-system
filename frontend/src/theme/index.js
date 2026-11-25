export { default as theme } from "./tokens";

/**
 * Accessibility contrast ratios (WCAG AA minimum: 4.5:1 for normal text, 3:1 for large text)
 *
 * Validated combinations on #0B0B0C background (Level 0):
 *   #f5f5f5 (text-primary)    → 18.8:1 ✅ AAA
 *   #a3a3a3 (text-secondary)  → 7.8:1  ✅ AAA
 *   #737373 (text-muted)      → 4.15:1 ❌ FAILS AA (4.5:1 required)
 *
 *   ⚠️  text-muted (#737373) was previously documented here as 4.5:1. The
 *       measured ratio on the #0B0B0C base is 4.15:1, and on the #121214
 *       alternating section background it drops to 3.95:1 — so it fails AA
 *       for body text in both places. Several landing-page sections had
 *       adopted it for card descriptions on the strength of this table.
 *       Use it only for genuinely non-essential text (disabled hints,
 *       decorative labels); #a3a3a3 is the correct choice for body copy.
 *   #c6a75e (gold-500)        → 6.7:1  ✅ AA
 *   #d4a84a (gold-400)        → 7.6:1  ✅ AA
 *   #e8c15c (gold-300)        → 10.1:1 ✅ AAA
 *
 * Gold on Level 2 (#1A1A1D):
 *   #c6a75e → 5.6:1  ✅ AA
 *   #d4a84a → 6.4:1  ✅ AA
 *
 * Button text (#0B0B0C on gold gradient):
 *   #0B0B0C on #c6a75e → 6.7:1  ✅ AA
 *   #0B0B0C on #d4a84a → 7.6:1  ✅ AA
 *
 * Surface Elevation Map:
 *   Level 0: #0B0B0C — Page base (dark-950)
 *   Level 1: #121214 — Alternating sections (dark-900)
 *   Level 2: #1A1A1D — Cards, panels (dark-800)
 *   Level 3: #202024 — Dropdowns, elevated (dark-700)
 *   Level 4: #28282D — Inputs, interactive (dark-600)
 *   Level 5: #313136 — Hover states (dark-500)
 */
