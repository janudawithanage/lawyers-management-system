/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS VALIDATION UTILITIES
 * Form validation helpers for authentication
 * ══════════════════════════════════════════════════════════════
 */

/**
 * Validate email address
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export function validatePassword(password) {
  if (password.length < 8) return false;
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return hasUpperCase && hasLowerCase && hasNumber;
}

/**
 * Validate Sri Lankan phone number
 * Accepts formats:
 * - +94771234567
 * - 0771234567
 * - +94 77 123 4567
 * - 077 123 4567
 */
export function validatePhone(phone) {
  // Remove all spaces and hyphens
  const cleaned = phone.replace(/[\s-]/g, "");
  
  // Check Sri Lankan phone patterns
  const patterns = [
    /^\+947[0-9]{8}$/, // +94771234567
    /^07[0-9]{8}$/,    // 0771234567
  ];
  
  return patterns.some((pattern) => pattern.test(cleaned));
}

/**
 * Validate full name
 * Requirements:
 * - At least 2 characters
 * - Only letters, spaces, and common punctuation
 */
export function validateName(name) {
  if (name.length < 2) return false;
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  return nameRegex.test(name);
}

/**
 * Validate Bar Registration Number
 * Format: BAR-YYYY-XXXX
 */
export function validateBarNumber(barNumber) {
  const barRegex = /^BAR-\d{4}-\d{4}$/;
  return barRegex.test(barNumber);
}

/**
 * Calculate password strength score
 * Returns 0-6
 */
export function calculatePasswordStrength(password) {
  let score = 0;
  
  if (!password) return 0;
  
  // Length
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // Character variety
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  return Math.min(score, 6);
}

/**
 * Get password strength details
 */
export function getPasswordStrengthDetails(password) {
  const score = calculatePasswordStrength(password);
  
  const strengths = [
    { score: 0, label: "Very Weak", color: "bg-red-500", textColor: "text-red-400" },
    { score: 1, label: "Weak", color: "bg-orange-500", textColor: "text-orange-400" },
    { score: 2, label: "Fair", color: "bg-yellow-500", textColor: "text-yellow-400" },
    { score: 3, label: "Good", color: "bg-lime-500", textColor: "text-lime-400" },
    { score: 4, label: "Strong", color: "bg-green-500", textColor: "text-green-400" },
    { score: 5, label: "Very Strong", color: "bg-emerald-500", textColor: "text-emerald-400" },
    { score: 6, label: "Excellent", color: "bg-gold-500", textColor: "text-gold-400" },
  ];
  
  return strengths[Math.min(score, 6)];
}

/**
 * Validate form field
 */
export function validateField(name, value, formData = {}) {
  switch (name) {
    case "email":
      if (!value) return "Email is required";
      if (!validateEmail(value)) return "Please enter a valid email";
      return "";
      
    case "password":
      if (!value) return "Password is required";
      if (!validatePassword(value))
        return "Password must be at least 8 characters with uppercase, lowercase, and number";
      return "";
      
    case "confirmPassword":
      if (!value) return "Please confirm your password";
      if (value !== formData.password) return "Passwords do not match";
      return "";
      
    case "phone":
      if (!value) return "Phone number is required";
      if (!validatePhone(value)) return "Please enter a valid phone number";
      return "";
      
    case "fullName":
      if (!value) return "Full name is required";
      if (!validateName(value)) return "Please enter a valid name";
      return "";
      
    case "barRegistrationNumber":
      if (!value) return "Bar registration number is required";
      // Add more specific validation if needed
      return "";
      
    case "specialization":
      if (!value) return "Specialization is required";
      return "";
      
    case "district":
      if (!value) return "District is required";
      return "";
      
    case "yearsOfExperience":
      if (!value) return "Years of experience is required";
      if (isNaN(value) || value < 0) return "Please enter a valid number";
      return "";
      
    default:
      return "";
  }
}
