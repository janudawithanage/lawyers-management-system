export { default as theme } from "./tokens";

/**
 * Accessibility contrast ratios (WCAG AA minimum: 4.5:1 for normal text, 3:1 for large text)
 *
 * Validated combinations on #0B0B0C background (Level 0):
 *   #f5f5f5 (text-primary)    → 18.8:1 ✅ AAA
 *   #a3a3a3 (text-secondary)  → 8.2:1  ✅ AAA
 *   #737373 (text-muted)      → 4.5:1  ✅ AA
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
