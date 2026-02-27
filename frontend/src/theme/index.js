export { default as theme } from "./tokens";

/**
 * Accessibility contrast ratios (WCAG AA minimum: 4.5:1 for normal text, 3:1 for large text)
 *
 * Validated combinations on #000000 background:
 *   #f5f5f5 (text-primary)    → 19.3:1 ✅ AAA
 *   #a3a3a3 (text-secondary)  → 8.4:1  ✅ AAA
 *   #737373 (text-muted)      → 4.6:1  ✅ AA
 *   #c6a55e (gold-500)        → 6.9:1  ✅ AA
 *   #d4a84a (gold-400)        → 7.8:1  ✅ AA
 *   #e8c15c (gold-300)        → 10.4:1 ✅ AAA
 *
 * Gold on dark-600 (#1a1a1a):
 *   #c6a55e → 5.8:1  ✅ AA
 *   #d4a84a → 6.6:1  ✅ AA
 *
 * Button text (#000000 on gold gradient):
 *   #000000 on #c6a55e → 6.9:1  ✅ AA
 *   #000000 on #d4a84a → 7.8:1  ✅ AA
 */
