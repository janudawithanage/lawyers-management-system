# 🔐 SL-LMS Security Guidelines & Implementation Checklist

## Frontend Security Best Practices

### 1. Authentication Token Management

#### Current Implementation (Basic)
```javascript
// ❌ Current (Not recommended for production)
localStorage.setItem('token', response.token);
```

#### Recommended Implementation

**Option A: HttpOnly Cookies (Recommended)**
```javascript
// Backend sets HttpOnly cookie
// Frontend automatically sends cookie with requests
// Token is NOT accessible to JavaScript (XSS-safe)

// API call example:
fetch('/api/auth/login', {
  method: 'POST',
  credentials: 'include', // Important!
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

**Option B: Memory + SessionStorage**
```javascript
// Store access token in memory (component state)
// Store refresh token in sessionStorage
// Access token expires quickly (5-15 min)
// Refresh token used to get new access token

class TokenService {
  static #accessToken = null;

  static setAccessToken(token) {
    this.#accessToken = token;
  }

  static getAccessToken() {
    return this.#accessToken;
  }

  static setRefreshToken(token) {
    sessionStorage.setItem('refreshToken', token);
  }

  static getRefreshToken() {
    return sessionStorage.getItem('refreshToken');
  }

  static clearTokens() {
    this.#accessToken = null;
    sessionStorage.removeItem('refreshToken');
  }
}
```

---

### 2. XSS (Cross-Site Scripting) Prevention

✅ **Already Protected (React)**
- React escapes all values by default
- Never use `dangerouslySetInnerHTML` unless absolutely necessary

❌ **Avoid:**
```jsx
// NEVER DO THIS
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

✅ **Do This:**
```jsx
// React automatically escapes
<div>{userInput}</div>
```

**Additional Protection:**
```javascript
// Sanitize user input if needed
import DOMPurify from 'dompurify';

const cleanInput = DOMPurify.sanitize(userInput);
```

---

### 3. CSRF (Cross-Site Request Forgery) Protection

#### Implementation Steps:

**Backend:**
```javascript
// Generate CSRF token on login
const csrfToken = generateToken();
res.cookie('XSRF-TOKEN', csrfToken, {
  httpOnly: false, // Must be readable by JS
  sameSite: 'strict',
  secure: true
});
```

**Frontend:**
```javascript
// Read CSRF token from cookie
const getCsrfToken = () => {
  const cookies = document.cookie.split(';');
  const csrfCookie = cookies.find(c => c.trim().startsWith('XSRF-TOKEN='));
  return csrfCookie ? csrfCookie.split('=')[1] : null;
};

// Include in requests
fetch('/api/protected', {
  method: 'POST',
  headers: {
    'X-XSRF-TOKEN': getCsrfToken(),
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});
```

---

### 4. Input Validation

✅ **Always Validate:**
- Email format
- Password strength
- Phone number format
- Name characters
- Special fields (Bar registration, etc.)

```javascript
// Example validation
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Whitelist allowed characters
export function sanitizeInput(input, allowedChars = /^[a-zA-Z0-9\s-_]+$/) {
  return allowedChars.test(input);
}
```

---

### 5. Password Security

#### Client-Side:
✅ **Enforce Strong Passwords**
```javascript
// Minimum requirements:
- 8+ characters
- 1 uppercase letter
- 1 lowercase letter
- 1 number
- (Optional) 1 special character
```

❌ **Never:**
- Store passwords in plain text
- Log passwords
- Send passwords in URLs
- Display passwords in error messages

✅ **Password Strength Indicator**
- Already implemented in RegisterPage
- 6-level strength meter
- Visual feedback to users

---

### 6. Secure Communication

#### Environment Configuration

**.env.production**
```env
VITE_API_URL=https://api.sl-lms.com
VITE_USE_HTTPS=true
VITE_SECURE_COOKIES=true
```

**.env.development**
```env
VITE_API_URL=http://localhost:5000
VITE_USE_HTTPS=false
VITE_SECURE_COOKIES=false
```

#### API Configuration
```javascript
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Only use HTTPS in production
if (import.meta.env.PROD) {
  API_CONFIG.protocol = 'https';
}
```

---

### 7. Session Management

#### Implement Token Refresh
```javascript
// Auto-refresh tokens before expiry
let refreshTimer;

function scheduleTokenRefresh(expiresIn) {
  // Refresh 1 minute before expiry
  const refreshTime = (expiresIn - 60) * 1000;
  
  refreshTimer = setTimeout(async () => {
    try {
      const newToken = await authService.refreshToken();
      TokenService.setAccessToken(newToken.token);
      scheduleTokenRefresh(newToken.expiresIn);
    } catch (error) {
      // Refresh failed, redirect to login
      window.location.href = '/login';
    }
  }, refreshTime);
}

// Clear timer on logout
function clearRefreshTimer() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }
}
```

#### Session Timeout
```javascript
let inactivityTimer;
const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    authService.logout();
    alert('Session expired due to inactivity');
    window.location.href = '/login';
  }, TIMEOUT_DURATION);
}

// Reset on user activity
['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
  document.addEventListener(event, resetInactivityTimer);
});
```

---

### 8. Error Handling

❌ **Never Expose:**
```javascript
// DON'T show detailed errors to users
catch (error) {
  alert(error.stack); // ❌ Exposes system details
}
```

✅ **Show Generic Messages:**
```javascript
catch (error) {
  console.error('Login error:', error); // Log for debugging
  setError('Login failed. Please check your credentials.'); // ✅ Generic user message
}
```

---

### 9. Rate Limiting (Frontend Helper)

```javascript
// Prevent rapid form submissions
class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 60000) {
    this.attempts = [];
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  canAttempt() {
    const now = Date.now();
    this.attempts = this.attempts.filter(time => now - time < this.windowMs);
    return this.attempts.length < this.maxAttempts;
  }

  recordAttempt() {
    this.attempts.push(Date.now());
  }

  getRemainingTime() {
    if (this.attempts.length < this.maxAttempts) return 0;
    const oldestAttempt = Math.min(...this.attempts);
    return this.windowMs - (Date.now() - oldestAttempt);
  }
}

// Usage in login
const loginLimiter = new RateLimiter(5, 60000); // 5 attempts per minute

async function handleLogin() {
  if (!loginLimiter.canAttempt()) {
    const remainingTime = Math.ceil(loginLimiter.getRemainingTime() / 1000);
    setError(`Too many attempts. Please try again in ${remainingTime} seconds.`);
    return;
  }

  loginLimiter.recordAttempt();
  // Proceed with login...
}
```

---

### 10. Dependency Security

#### Regular Audits
```bash
# Check for vulnerabilities
npm audit

# Auto-fix
npm audit fix

# Update dependencies
npm update
```

#### Use Exact Versions
```json
// package.json
{
  "dependencies": {
    "react": "18.2.0",  // ✅ Exact version
    "react-dom": "18.2.0"
  }
}
```

---

### 11. Content Security Policy (CSP)

#### Add to `index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        font-src 'self' https://fonts.gstatic.com;
        img-src 'self' https: data:;
        connect-src 'self' https://api.sl-lms.com;
      ">
```

---

### 12. Secure Headers (Backend)

Backend should set these headers:

```javascript
// Express.js example
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
```

---

## Backend Integration Checklist

### Authentication Endpoints

- [ ] **POST /api/auth/register**
  - Validate all inputs server-side
  - Hash passwords with bcrypt (min 12 rounds)
  - Send verification email
  - Return JWT token

- [ ] **POST /api/auth/login**
  - Rate limit: 5 attempts per 15 minutes
  - Check email verification status
  - Return access token + refresh token
  - Log login attempts

- [ ] **POST /api/auth/logout**
  - Invalidate refresh token
  - Clear session
  - Log logout

- [ ] **POST /api/auth/refresh**
  - Validate refresh token
  - Generate new access token
  - Rotate refresh token (optional)

- [ ] **GET /api/auth/me**
  - Require valid access token
  - Return user profile

- [ ] **POST /api/auth/verify-email**
  - Validate token
  - Mark email as verified
  - Update user status

- [ ] **POST /api/auth/forgot-password**
  - Rate limit: 3 attempts per hour
  - Send reset email
  - Token expires in 1 hour

- [ ] **POST /api/auth/reset-password**
  - Validate reset token
  - Hash new password
  - Invalidate all existing tokens

---

## Database Security

### User Schema
```javascript
{
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    select: false  // Don't return in queries by default
  },
  role: {
    type: String,
    enum: ['client', 'lawyer', 'admin'],
    default: 'client'
  },
  verified: {
    type: Boolean,
    default: false
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  lastLogin: {
    type: Date
  }
}
```

---

## Monitoring & Logging

### Log These Events:
- ✅ Login attempts (success & failure)
- ✅ Registration
- ✅ Password changes
- ✅ Email verification
- ✅ Role changes
- ✅ Suspicious activities

### Don't Log:
- ❌ Passwords
- ❌ Tokens (full)
- ❌ Credit card numbers
- ❌ Personal identification numbers

---

## 2FA Implementation (Future)

### Flow:
1. User enters email + password
2. Backend sends OTP via SMS/Email
3. User enters OTP
4. Backend validates and returns tokens

### Implementation:
```javascript
// Enable 2FA
async function enable2FA() {
  const response = await fetch('/api/auth/2fa/enable', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const { qrCode, secret } = await response.json();
  // Show QR code to user
}

// Verify 2FA code
async function verify2FA(code) {
  const response = await fetch('/api/auth/2fa/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });
}
```

---

## OAuth Integration (Google)

### Setup Steps:

1. **Get Google OAuth Credentials**
   - Go to Google Cloud Console
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

2. **Frontend Implementation**
```javascript
// Using @react-oauth/google
import { GoogleLogin } from '@react-oauth/google';

function LoginPage() {
  const handleGoogleSuccess = async (response) => {
    const { credential } = response;
    // Send credential to backend
    const result = await authService.googleLogin(credential);
    // Handle result
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => console.error('Login Failed')}
    />
  );
}
```

3. **Backend Verification**
```javascript
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();
  return payload; // Contains email, name, etc.
}
```

---

## Security Checklist

### Before Production:

- [ ] Switch from localStorage to secure token storage
- [ ] Implement CSRF protection
- [ ] Add rate limiting
- [ ] Enable HTTPS only
- [ ] Set secure cookie flags
- [ ] Add Content Security Policy
- [ ] Implement session timeout
- [ ] Add token refresh mechanism
- [ ] Enable audit logging
- [ ] Set up error monitoring (Sentry)
- [ ] Run security audit (npm audit)
- [ ] Test all validation rules
- [ ] Review all API endpoints
- [ ] Implement proper CORS
- [ ] Add input sanitization
- [ ] Test XSS vulnerabilities
- [ ] Test CSRF vulnerabilities
- [ ] Implement password reset flow
- [ ] Add email verification
- [ ] Test role-based access control
- [ ] Review error messages (no info leakage)

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [React Security](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)
- [Web Security Guide](https://developer.mozilla.org/en-US/docs/Web/Security)

---

**Remember: Security is not a feature, it's a continuous process.**

*Built with security-first mindset for Bar Association of Sri Lanka*
