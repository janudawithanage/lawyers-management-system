/**
 * SL-LMS API Service Layer
 *
 * Centralised HTTP client with interceptors for auth,
 * error handling, and request/response transformation.
 *
 * Ready for JWT/OAuth token flow and microservices backend.
 */

import config from "@config";
import { authStorage } from "@utils";

const { baseUrl, timeout } = config.api;

class ApiService {
  constructor() {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * Build headers with auth token if available.
   */
  _headers(extra = {}) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...extra,
    };

    const token = authStorage.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Core request method.
   */
  async _request(method, endpoint, { body, params, headers } = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, value);
        }
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url.toString(), {
        method,
        headers: this._headers(headers),
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        credentials: "include",
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new ApiError(response.status, error.message || response.statusText, error);
      }

      if (response.status === 204) return null;
      return response.json();
    } catch (err) {
      clearTimeout(timeoutId);

      if (err.name === "AbortError") {
        throw new ApiError(408, "Request timed out");
      }

      if (err instanceof ApiError) throw err;

      throw new ApiError(0, err.message || "Network error");
    }
  }

  get(endpoint, params) {
    return this._request("GET", endpoint, { params });
  }

  post(endpoint, body) {
    return this._request("POST", endpoint, { body });
  }

  put(endpoint, body) {
    return this._request("PUT", endpoint, { body });
  }

  patch(endpoint, body) {
    return this._request("PATCH", endpoint, { body });
  }

  delete(endpoint) {
    return this._request("DELETE", endpoint);
  }

  /**
   * Upload file with multipart/form-data.
   */
  async upload(endpoint, formData) {
    const token = authStorage.getToken();
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(response.status, error.message || "Upload failed", error);
    }

    return response.json();
  }
}

class ApiError extends Error {
  constructor(status, message, data = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/** Singleton instance */
const api = new ApiService();

export { ApiError };
export default api;
