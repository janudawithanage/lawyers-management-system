/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS TOKEN STORAGE — Abstraction Layer
 * ══════════════════════════════════════════════════════════════
 *
 * SECURITY ARCHITECTURE:
 * ─────────────────────────────────────────────────────────────
 * This module abstracts ALL token persistence so that no other
 * module ever touches localStorage/sessionStorage directly.
 *
 * Current Strategy:
 *   • Access token  → sessionStorage (tab-scoped, cleared on close)
 *   • Refresh token → sessionStorage (same — safest SPA option)
 *   • User payload  → sessionStorage (derived from JWT decode)
 *
 * Why NOT localStorage?
 *   • localStorage is accessible to ANY JS on the same origin,
 *     making it vulnerable to XSS attacks.
 *   • sessionStorage limits exposure to the active tab.
 *
 * Ideal Production Strategy:
 *   • Access token  → in-memory variable (never persisted)
 *   • Refresh token → httpOnly, Secure, SameSite=Strict cookie
 *   • Silent refresh on mount via /auth/refresh endpoint
 *   This eliminates ALL JS-accessible token storage.
 *
 * The abstraction layer here means switching strategy requires
 * changing ONLY this file — zero impact on the rest of the app.
 * ─────────────────────────────────────────────────────────────
 */

const KEYS = Object.freeze({
  ACCESS_TOKEN: "sl_lms_access_token",
  REFRESH_TOKEN: "sl_lms_refresh_token",
  USER: "sl_lms_user",
  SESSION_ID: "sl_lms_session_id",
});

/** Pick storage engine — sessionStorage by default for security */
const engine = () => {
  try {
    return window.sessionStorage;
  } catch {
    // SSR or restricted context fallback
    return null;
  }
};

// ── Private helpers ──────────────────────────────────────────

function _get(key) {
  try {
    return engine()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function _set(key, value) {
  try {
    engine()?.setItem(key, value);
  } catch {
    // Storage quota exceeded or restricted — silent fail
  }
}

function _remove(key) {
  try {
    engine()?.removeItem(key);
  } catch {
    // silent
  }
}

function _getJSON(key) {
  try {
    const raw = _get(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    _remove(key); // corrupted data — clear it
    return null;
  }
}

function _setJSON(key, value) {
  try {
    _set(key, JSON.stringify(value));
  } catch {
    // silent
  }
}

// ── Public API ───────────────────────────────────────────────

export const tokenStorage = Object.freeze({
  // ── Access Token ──
  getAccessToken() {
    return _get(KEYS.ACCESS_TOKEN);
  },

  setAccessToken(token) {
    if (typeof token !== "string" || !token) return;
    _set(KEYS.ACCESS_TOKEN, token);
  },

  // ── Refresh Token ──
  getRefreshToken() {
    return _get(KEYS.REFRESH_TOKEN);
  },

  setRefreshToken(token) {
    if (typeof token !== "string" || !token) return;
    _set(KEYS.REFRESH_TOKEN, token);
  },

  // ── User Payload ──
  getUser() {
    return _getJSON(KEYS.USER);
  },

  setUser(user) {
    if (!user || typeof user !== "object") return;
    _setJSON(KEYS.USER, user);
  },

  // ── Session ID (for multi-tab tracking) ──
  getSessionId() {
    return _get(KEYS.SESSION_ID);
  },

  setSessionId(id) {
    _set(KEYS.SESSION_ID, id);
  },

  // ── Bulk Operations ──

  /** Persist full auth response (token + user) */
  persistSession({ token, refreshToken, user }) {
    if (token) this.setAccessToken(token);
    if (refreshToken) this.setRefreshToken(refreshToken);
    if (user) this.setUser(user);
  },

  /** Wipe all auth data — used on logout / forced expiry */
  clearSession() {
    _remove(KEYS.ACCESS_TOKEN);
    _remove(KEYS.REFRESH_TOKEN);
    _remove(KEYS.USER);
    _remove(KEYS.SESSION_ID);
  },

  /** Check if a session exists at all */
  hasSession() {
    return !!_get(KEYS.ACCESS_TOKEN) && !!_getJSON(KEYS.USER);
  },

  /**
   * Simulate JWT decode for development.
   * In production, replace with real jose/jwt-decode library.
   */
  decodeToken(token) {
    if (!token) return null;
    try {
      const payload = token.split(".")[1];
      if (!payload) return null;
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  },
});

export default tokenStorage;
