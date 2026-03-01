/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS AUTH SERVICE
 * API integration for authentication
 * ══════════════════════════════════════════════════════════════
 */

// This is a mock implementation. Replace with actual API calls.

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Simulate API delay
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock API responses for development
 * TODO: Replace with actual API integration
 */
export const authService = {
  /**
   * Login user
   */
  async login({ email, password, rememberMe }) {
    await delay(1500); // Simulate network delay

    // Mock validation
    if (email === "test@example.com" && password === "Test1234") {
      return {
        token: "mock-jwt-token-" + Date.now(),
        user: {
          id: "USR-2026-0001",
          email: email,
          fullName: "Ashan Bandara",
          role: "client",
          verified: true,
        },
      };
    }

    // Mock lawyer login
    if (email === "lawyer@example.com" && password === "Lawyer1234") {
      return {
        token: "mock-jwt-token-" + Date.now(),
        user: {
          id: "LWR-003",
          email: email,
          fullName: "Atty. Ranjan de Silva",
          role: "lawyer",
          verified: true,
          barNumber: "BASL/2015/3284",
          specialization: "Civil Law",
        },
      };
    }

    // Mock admin login
    if (email === "admin@example.com" && password === "Admin1234") {
      return {
        token: "mock-jwt-token-" + Date.now(),
        user: {
          id: "user-789",
          email: email,
          fullName: "Platform Admin",
          role: "admin",
          verified: true,
        },
      };
    }

    throw new Error("Invalid email or password");

    /* 
    // Actual API implementation:
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
    */
  },

  /**
   * Register new user
   */
  async register(formData) {
    await delay(2000); // Simulate network delay

    // Mock successful registration
    const userData = {
      token: "mock-jwt-token-" + Date.now(),
      user: {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        role: formData.role,
        verified: false,
        ...(formData.role === "lawyer" && {
          barNumber: formData.barRegistrationNumber,
          specialization: formData.specialization,
          district: formData.district,
          yearsOfExperience: formData.yearsOfExperience,
        }),
      },
    };

    return userData;

    /* 
    // Actual API implementation:
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
    */
  },

  /**
   * Logout user
   */
  async logout() {
    await delay(500);
    // Token cleanup is handled by AuthContext.logout() → tokenStorage.clearSession()
    // No direct storage access here.

    /* 
    // Actual API implementation:
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
    }
    */
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    // Session restoration is now handled by AuthContext hydration
    // via tokenStorage. This method is kept for future backend integration.
    return null;

    /* 
    // Actual API implementation:
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      return await response.json();
    } catch (error) {
      return null;
    }
    */
  },

  /**
   * Refresh token
   */
  async refreshToken() {
    // Mock implementation
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    await delay(500);
    const newToken = "mock-jwt-token-" + Date.now();
    localStorage.setItem("token", newToken);
    return { token: newToken };

    /* 
    // Actual API implementation:
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      throw error;
    }
    */
  },

  /**
   * Verify email
   */
  async verifyEmail(token) {
    await delay(1000);
    return { success: true, message: "Email verified successfully" };

    /* 
    // Actual API implementation:
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error("Email verification failed");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
    */
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email) {
    await delay(1000);
    return { success: true, message: "Password reset email sent" };

    /* 
    // Actual API implementation:
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send reset email");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
    */
  },

  /**
   * Reset password
   */
  async resetPassword({ token, password }) {
    await delay(1000);
    return { success: true, message: "Password reset successful" };

    /* 
    // Actual API implementation:
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        throw new Error("Password reset failed");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
    */
  },
};
