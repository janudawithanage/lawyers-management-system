/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS LOGIN PAGE
 * Premium SaaS Authentication — Legal Tech Edition
 * ══════════════════════════════════════════════════════════════
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../../../layouts/AuthLayout";
import { Input } from "../components/Input";
import { Button } from "../../../components/ui";
import { validateEmail, validatePassword } from "../validation/authValidation";
import { authService } from "../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error on field change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      // Store token (basic implementation - enhance with secure storage)
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Redirect based on role
      const dashboardRoutes = {
        client: "/dashboard/client",
        lawyer: "/dashboard/lawyer",
        admin: "/dashboard/admin",
      };
      navigate(dashboardRoutes[response.user.role] || "/dashboard");
    } catch (error) {
      setErrors({
        submit: error.message || "Login failed. Please check your credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Secure Legal Access"
      subtitle="Connecting Sri Lanka's legal community with trusted, verified professionals."
      imageSide="left"
    >
      <div className="w-full max-w-md mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-100 mb-3">
            Welcome Back
          </h1>
          <p className="text-neutral-400">
            Sign in to access your legal dashboard
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 animate-slide-up"
          style={{ animationDelay: "150ms" }}
        >
          {/* Email */}
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="lawyer@example.com"
            autoComplete="email"
            required
          />

          {/* Password */}
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Enter your password"
            autoComplete="current-password"
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            required
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded border border-white/10 bg-dark-600 text-gold-500 focus:ring-2 focus:ring-gold-500/40 focus:ring-offset-2 focus:ring-offset-dark-950 transition-all cursor-pointer"
              />
              <span className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                Remember me
              </span>
            </label>

            <Link
              to="/forgot-password"
              className="text-sm text-gold-400 hover:text-gold-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 animate-shake">
              <p className="text-sm text-red-400">{errors.submit}</p>
            </div>
          )}

          {/* Login Button */}
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
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/6"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark-700 text-neutral-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign In (Placeholder) */}
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full"
            disabled
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
            <span className="text-xs text-neutral-500">(Coming Soon)</span>
          </Button>

          {/* Register Link */}
          <p className="text-center text-sm text-neutral-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
