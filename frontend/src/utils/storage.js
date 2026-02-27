/**
 * SL-LMS Storage Utilities
 * Secure localStorage/sessionStorage wrappers with JSON support.
 */

const TOKEN_KEY = "sl_lms_token";
const REFRESH_KEY = "sl_lms_refresh";
const THEME_KEY = "sl_lms_theme";
const LANG_KEY = "sl_lms_lang";

/** ── Generic helpers ── */
function safeGet(storage, key) {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function safeSet(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded – silent fail */
  }
}

function safeRemove(storage, key) {
  try {
    storage.removeItem(key);
  } catch {
    /* silent */
  }
}

/** ── Auth tokens (sessionStorage for XSS mitigation) ── */
export const authStorage = {
  getToken: () => sessionStorage.getItem(TOKEN_KEY),
  setToken: (token) => sessionStorage.setItem(TOKEN_KEY, token),
  getRefresh: () => sessionStorage.getItem(REFRESH_KEY),
  setRefresh: (token) => sessionStorage.setItem(REFRESH_KEY, token),
  clear: () => {
    safeRemove(sessionStorage, TOKEN_KEY);
    safeRemove(sessionStorage, REFRESH_KEY);
  },
};

/** ── Preferences (localStorage for persistence) ── */
export const prefStorage = {
  getTheme: () => safeGet(localStorage, THEME_KEY) ?? "dark",
  setTheme: (mode) => safeSet(localStorage, THEME_KEY, mode),
  getLang: () => safeGet(localStorage, LANG_KEY) ?? "en",
  setLang: (lang) => safeSet(localStorage, LANG_KEY, lang),
};
