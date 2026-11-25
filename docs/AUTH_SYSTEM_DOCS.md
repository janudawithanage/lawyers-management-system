# SL-LMS Authentication System

## 📐 Architecture Overview

The authentication system is built with a feature-based architecture, following modern React best practices and enterprise-level security standards.

```
frontend/src/
├── features/auth/
│   ├── components/         # Reusable form components
│   │   ├── Input.jsx      # Premium input with validation states
│   │   └── Select.jsx     # Premium select dropdown
│   ├── pages/             # Authentication pages
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── hooks/             # Custom React hooks
│   │   └── useAuth.js     # Auth state management hook
│   ├── services/          # API integration layer
│   │   └── authService.js # Auth API calls
│   ├── validation/        # Form validation utilities
│   │   └── authValidation.js
│   └── index.js           # Feature exports
├── layouts/
│   └── AuthLayout.jsx     # Premium split-screen layout
└── routes/
    └── index.jsx          # Routing configuration
```

---

## 🎨 Design System Integration

### Color Palette (BASL Premium Dark Theme)

```css
Primary Background: #0B0B0C
Secondary Background: #121214
Surface Card: #1A1A1D
Elevated Surface: #202024
Input Background: #28282D

Accent Gold: #C6A75E
Text Primary: #F5F5F5
Text Secondary: #A3A3A3
Border: rgba(255,255,255,0.06)
```

### Typography

- **Headings**: Playfair Display (serif, authoritative)
- **Body**: Inter (sans-serif, modern, legible)

---

## 🔐 Authentication Pages

### 1. Login Page (`/login`)

**Features:**
- Email + Password authentication
- Remember Me checkbox
- Forgot Password link
- Password visibility toggle
- Real-time validation
- Error handling with shake animation
- Google OAuth placeholder (future-ready)
- Responsive design

**Navigation:**
- Success → Role-based dashboard redirect
- Link to Register page

### 2. Register Page (`/register`)

**Features:**
- Role selection (Client / Lawyer)
- Dynamic form fields based on role
- Password strength indicator
- Conditional lawyer fields with smooth animation
- Terms & Conditions acceptance
- Real-time field validation
- Comprehensive error states

**Fields:**

**Common:**
- Full Name
- Email
- Phone
- Password
- Confirm Password
- Role Selection

**Lawyer-Specific (Conditional):**
- Bar Registration Number
- Specialization (dropdown)
- District (25 districts of Sri Lanka)
- Years of Experience

---

## 🎬 Animations & Interactions

All animations follow Material Design principles and respect `prefers-reduced-motion`.

### Animation Types:

1. **Fade In** - Page/section entrance
2. **Slide Up** - Form entrance animation
3. **Slide Down** - Conditional field reveal
4. **Slide In** - Accent line animation
5. **Shake** - Error feedback
6. **Pulse** - Focus ring effect

### Timing:
- **Fast**: 150ms (micro-interactions)
- **Normal**: 300ms (standard transitions)
- **Slow**: 600ms (page transitions)
- **Cubic Bezier**: `cubic-bezier(0.4, 0, 0.2, 1)`

---

## 🧩 Reusable Components

### Input Component

```jsx
<Input
  label="Email Address"
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  error={errors.email}
  placeholder="lawyer@example.com"
  required
  showPasswordToggle={type === 'password'}
  showPassword={showPassword}
  onTogglePassword={() => setShowPassword(!showPassword)}
/>
```

**Features:**
- Floating validation states
- Gold focus ring
- Error state styling
- Password toggle
- Helper text support
- Left/right icon slots
- Accessible labels

### Select Component

```jsx
<Select
  label="Specialization"
  name="specialization"
  value={formData.specialization}
  onChange={handleChange}
  error={errors.specialization}
  required
>
  <option value="">Select specialization</option>
  <option value="criminal">Criminal Law</option>
  ...
</Select>
```

---

## ✅ Form Validation

### Validation Rules

**Email:**
- Required
- Valid email format

**Password:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

**Phone:**
- Sri Lankan format
- Accepts: `+94771234567`, `0771234567`, `+94 77 123 4567`

**Name:**
- Minimum 2 characters
- Letters, spaces, hyphens, apostrophes only

### Real-Time Validation
- Validates on blur
- Clears errors on change
- Shows error messages below fields
- Password strength indicator (6 levels)

---

## 🔐 Security Best Practices

### Frontend Security

1. **XSS Protection**
   - All user inputs are validated and sanitized
   - React's built-in XSS protection
   - No `dangerouslySetInnerHTML` usage

2. **CSRF Protection**
   - Implement CSRF tokens when backend is ready
   - Use `SameSite` cookie attribute

3. **Token Storage**
   - Current: `localStorage` (basic implementation)
   - **Recommended**: 
     - HttpOnly cookies for refresh tokens
     - Memory storage for access tokens
     - Or use libraries like `js-cookie` with secure flags

4. **Password Handling**
   - Never log passwords
   - Use strong validation rules
   - Strength indicator guides users

5. **Environment Variables**
   - API URLs in `.env` files
   - Never commit secrets
   - Use `.env.local` for local development

### Backend Integration Checklist

- [ ] Implement JWT token refresh mechanism
- [ ] Add rate limiting for auth endpoints
- [ ] Implement email verification
- [ ] Add 2FA support (future)
- [ ] Implement password reset flow
- [ ] Add OAuth integration (Google)
- [ ] BASL verification for lawyers
- [ ] Secure session management
- [ ] Implement CORS properly
- [ ] Add audit logging

---

## 🚀 API Integration

### Current State: Mock Service

The `authService.js` currently uses mock responses for development.

### To Integrate Real API:

1. **Set API URL** in `.env`:
   ```env
   VITE_API_URL=https://api.sl-lms.com
   ```

2. **Uncomment API calls** in `authService.js`

3. **Add error handling** for network failures

4. **Implement token refresh** logic

### Expected API Endpoints:

```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
POST /api/auth/verify-email
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Expected Response Format:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-123",
    "email": "lawyer@example.com",
    "fullName": "John Attorney",
    "role": "lawyer",
    "verified": true,
    "barNumber": "BAR-2024-0001",
    "specialization": "criminal"
  }
}
```

---

## 🎯 Role-Based Access Control

### User Roles:

1. **Client** - End users seeking legal help
2. **Lawyer** - Legal professionals offering services
3. **Admin** - System administrators

### Dashboard Routes:

```
/dashboard/client  → Client Dashboard
/dashboard/lawyer  → Lawyer Dashboard
/dashboard/admin   → Admin Dashboard
```

### Implementation:

```jsx
import { useAuth } from '@features/auth/hooks/useAuth';

function ProtectedRoute() {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Role-based rendering
  if (user.role === 'lawyer') {
    return <LawyerDashboard />;
  }
  
  return <ClientDashboard />;
}
```

---

## 📱 Responsive Design

### Breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Layout Behavior:

**Desktop:**
- Split screen (50/50)
- Image on left, form on right
- Full-height sections

**Mobile:**
- Stacked layout
- Image becomes hero banner (12rem height)
- Form takes full width
- Optimized padding and spacing

---

## ♿ Accessibility

### Compliance:

- ✅ WCAG 2.1 AA compliant
- ✅ Keyboard navigation support
- ✅ Focus visible states
- ✅ Screen reader friendly
- ✅ Reduced motion support
- ✅ Proper ARIA labels

### Features:

- Semantic HTML
- Alt text for images
- Form labels properly associated
- Focus management
- Error announcements
- Color contrast meets 4.5:1 ratio

---

## 🧪 Testing Credentials (Mock)

### Client Account:
```
Email: test@example.com
Password: Test1234
```

### Lawyer Account:
```
Email: lawyer@example.com
Password: Lawyer1234
```

---

## 🔄 State Management

Currently using React's built-in state management:

- `useState` for component state
- Context API ready (`useAuth` hook)
- Can integrate Redux/Zustand if needed

---

## 📦 Dependencies

No additional dependencies required! Built with:

- ✅ React 18
- ✅ React Router v6
- ✅ Tailwind CSS
- ✅ Existing design tokens

---

## 🚀 Next Steps

### Immediate:
1. ✅ Login page
2. ✅ Register page
3. ✅ Auth layout
4. ✅ Form components
5. ✅ Validation utilities
6. ✅ Mock service

### Future Enhancements:
- [ ] Forgot Password page
- [ ] Email Verification page
- [ ] OAuth integration (Google)
- [ ] 2FA implementation
- [ ] BASL verification for lawyers
- [ ] Profile completion wizard
- [ ] Session timeout handling
- [ ] Remember device functionality

---

## 💡 Best Practices Implemented

✅ Component reusability
✅ Separation of concerns
✅ Feature-based architecture
✅ Consistent design tokens
✅ Accessible forms
✅ Responsive design
✅ Loading states
✅ Error handling
✅ Smooth animations
✅ Security-first approach
✅ Clean code structure
✅ Comprehensive documentation

---

## 🐛 Troubleshooting

### Issue: Routes not working
**Solution**: Ensure `LoginPage` and `RegisterPage` are properly imported in `routes/index.jsx`

### Issue: Animations not showing
**Solution**: Check that `index.css` includes the animation keyframes and utilities

### Issue: Token not persisting
**Solution**: Verify localStorage is not disabled in browser

### Issue: Form validation not working
**Solution**: Ensure `authValidation.js` functions are properly exported and imported

---

## 📞 Support

For questions or issues:
- Check this documentation first
- Review code comments in components
- Verify design tokens in `theme/tokens.js`
- Test with mock credentials provided

---

**Built with ❤️ for Bar Association of Sri Lanka**

*Secure. Trusted. Professional.*
