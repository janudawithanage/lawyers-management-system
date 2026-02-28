/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS REGISTER PAGE
 * Premium SaaS Registration — Legal Tech Edition
 * ══════════════════════════════════════════════════════════════
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../../../layouts/AuthLayout";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Button } from "../../../components/ui";
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateName,
} from "../validation/authValidation";
import { useAuth, getDashboardPath } from "@context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "client",
    // Lawyer-specific fields
    barRegistrationNumber: "",
    specialization: "",
    district: "",
    yearsOfExperience: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error on field change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Calculate password strength
    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (!password) {
      setPasswordStrength({ score: 0, label: "", color: "" });
      return;
    }

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Character variety
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const strengths = [
      { score: 0, label: "Very Weak", color: "bg-red-500" },
      { score: 1, label: "Weak", color: "bg-orange-500" },
      { score: 2, label: "Fair", color: "bg-yellow-500" },
      { score: 3, label: "Good", color: "bg-lime-500" },
      { score: 4, label: "Strong", color: "bg-green-500" },
      { score: 5, label: "Very Strong", color: "bg-emerald-500" },
      { score: 6, label: "Excellent", color: "bg-gold-500" },
    ];

    setPasswordStrength(strengths[Math.min(score, 6)]);
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic fields
    if (!formData.fullName) {
      newErrors.fullName = "Full name is required";
    } else if (!validateName(formData.fullName)) {
      newErrors.fullName = "Please enter a valid name";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Lawyer-specific validation
    if (formData.role === "lawyer") {
      if (!formData.barRegistrationNumber) {
        newErrors.barRegistrationNumber = "Bar registration number is required";
      }
      if (!formData.specialization) {
        newErrors.specialization = "Specialization is required";
      }
      if (!formData.district) {
        newErrors.district = "District is required";
      }
      if (!formData.yearsOfExperience) {
        newErrors.yearsOfExperience = "Years of experience is required";
      } else if (isNaN(formData.yearsOfExperience) || formData.yearsOfExperience < 0) {
        newErrors.yearsOfExperience = "Please enter a valid number";
      }
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authRegister(formData);

      // Redirect to role-specific dashboard
      const destination = getDashboardPath(response.user.role);
      navigate(destination, { replace: true });
    } catch (error) {
      setErrors({
        submit: error.message || "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isLawyer = formData.role === "lawyer";

  return (
    <AuthLayout
      title="Join the Network"
      subtitle="Become part of Sri Lanka's premier legal platform. Trusted by lawyers and clients nationwide."
      imageSide="left"
    >
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-100 mb-3">
            Create Your Account
          </h1>
          <p className="text-neutral-400">
            Join thousands of legal professionals and clients
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 animate-slide-up"
          style={{ animationDelay: "150ms" }}
        >
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: "client" }))}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                formData.role === "client"
                  ? "border-gold-500 bg-gold-500/10"
                  : "border-white/10 bg-dark-600 hover:border-white/20"
              }`}
            >
              <div className="text-2xl mb-2">👤</div>
              <div className="font-semibold text-neutral-100">Client</div>
              <div className="text-xs text-neutral-500">Seeking legal help</div>
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: "lawyer" }))}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                formData.role === "lawyer"
                  ? "border-gold-500 bg-gold-500/10"
                  : "border-white/10 bg-dark-600 hover:border-white/20"
              }`}
            >
              <div className="text-2xl mb-2">⚖️</div>
              <div className="font-semibold text-neutral-100">Lawyer</div>
              <div className="text-xs text-neutral-500">Offering services</div>
            </button>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              placeholder="John Doe"
              autoComplete="name"
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="john@example.com"
              autoComplete="email"
              required
            />
          </div>

          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="+94 77 123 4567"
            autoComplete="tel"
            required
          />

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Create a strong password"
                autoComplete="new-password"
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                required
              />
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i < passwordStrength.score
                            ? passwordStrength.color
                            : "bg-dark-500"
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-xs ${
                      passwordStrength.score >= 4
                        ? "text-green-400"
                        : passwordStrength.score >= 2
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    Strength: {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              autoComplete="new-password"
              showPasswordToggle
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              required
            />
          </div>

          {/* Lawyer-Specific Fields */}
          {isLawyer && (
            <div
              className="space-y-4 pt-4 border-t border-white/6 animate-slide-down"
              key="lawyer-fields"
            >
              <h3 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
                <span className="text-gold-400">⚖️</span>
                Professional Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Bar Registration Number"
                  type="text"
                  name="barRegistrationNumber"
                  value={formData.barRegistrationNumber}
                  onChange={handleChange}
                  error={errors.barRegistrationNumber}
                  placeholder="BAR-2024-XXXX"
                  required={isLawyer}
                />

                <Select
                  label="Specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  error={errors.specialization}
                  required={isLawyer}
                >
                  <option value="">Select specialization</option>
                  <option value="criminal">Criminal Law</option>
                  <option value="civil">Civil Law</option>
                  <option value="corporate">Corporate Law</option>
                  <option value="family">Family Law</option>
                  <option value="property">Property Law</option>
                  <option value="intellectual">Intellectual Property</option>
                  <option value="labor">Labor Law</option>
                  <option value="tax">Tax Law</option>
                  <option value="other">Other</option>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="District"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  error={errors.district}
                  required={isLawyer}
                >
                  <option value="">Select district</option>
                  <option value="colombo">Colombo</option>
                  <option value="gampaha">Gampaha</option>
                  <option value="kalutara">Kalutara</option>
                  <option value="kandy">Kandy</option>
                  <option value="matale">Matale</option>
                  <option value="nuwara-eliya">Nuwara Eliya</option>
                  <option value="galle">Galle</option>
                  <option value="matara">Matara</option>
                  <option value="hambantota">Hambantota</option>
                  <option value="jaffna">Jaffna</option>
                  <option value="kilinochchi">Kilinochchi</option>
                  <option value="mannar">Mannar</option>
                  <option value="vavuniya">Vavuniya</option>
                  <option value="mullaitivu">Mullaitivu</option>
                  <option value="batticaloa">Batticaloa</option>
                  <option value="ampara">Ampara</option>
                  <option value="trincomalee">Trincomalee</option>
                  <option value="kurunegala">Kurunegala</option>
                  <option value="puttalam">Puttalam</option>
                  <option value="anuradhapura">Anuradhapura</option>
                  <option value="polonnaruwa">Polonnaruwa</option>
                  <option value="badulla">Badulla</option>
                  <option value="moneragala">Moneragala</option>
                  <option value="ratnapura">Ratnapura</option>
                  <option value="kegalle">Kegalle</option>
                </Select>

                <Input
                  label="Years of Experience"
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  error={errors.yearsOfExperience}
                  placeholder="5"
                  min="0"
                  required={isLawyer}
                />
              </div>
            </div>
          )}

          {/* Terms & Conditions */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="w-4 h-4 mt-0.5 rounded border border-white/10 bg-dark-600 text-gold-500 focus:ring-2 focus:ring-gold-500/40 focus:ring-offset-2 focus:ring-offset-dark-950 transition-all cursor-pointer"
              />
              <span className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                I agree to the{" "}
                <Link to="/terms" className="text-gold-400 hover:text-gold-300">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-gold-400 hover:text-gold-300">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-xs text-red-400 mt-1">{errors.acceptTerms}</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 animate-shake">
              <p className="text-sm text-red-400">{errors.submit}</p>
            </div>
          )}

          {/* Register Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          {/* Login Link */}
          <p className="text-center text-sm text-neutral-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
