import axios, { AxiosInstance } from "axios";
import axiosRetry from "axios-retry"; // Retry logic
import pThrottle from "p-throttle"; // Rate limiting
import { setupCache } from "axios-cache-interceptor"; // Caching

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://api.example.com";
const DEFAULT_LANGUAGE = "en-US";
const DEFAULT_CURRENCY = "USD";

// ✅ Step 1: Create a base Axios instance
const baseApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Step 2: Apply caching but ensure TypeScript sees it as `AxiosInstance`
const api = setupCache(baseApi) as unknown as AxiosInstance;

// === Rate Limiting ===
const throttle = pThrottle({
  limit: 5,
  interval: 1000,
});

if (process.env.NODE_ENV === "production") {
  api.request = throttle(api.request);
}

// === Retry Logic ===
axiosRetry(api, {
  retries: process.env.NODE_ENV === "production" ? 3 : 0,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return (
      axiosRetry.isNetworkError(error) ||
      error.response?.status === 429 // Too many requests
    );
  },
});

// === Request Interceptors ===
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const language = typeof window !== "undefined" ? localStorage.getItem("language") || DEFAULT_LANGUAGE : DEFAULT_LANGUAGE;
    const currency = typeof window !== "undefined" ? localStorage.getItem("currency") || DEFAULT_CURRENCY : DEFAULT_CURRENCY;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["Accept-Language"] = language;
    config.headers["X-Currency"] = currency;

    if (process.env.NODE_ENV === "development") {
      console.log(`[Request] ${config.method?.toUpperCase()} - ${config.url}`, config);
    }

    return config;
  },
  (error) => {
    console.error("[Request Error]", error);
    return Promise.reject(error);
  }
);

// === Response Interceptors ===
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[Response] ${response.config.method?.toUpperCase()} - ${response.config.url}`, response);
    }

    return response.data || response;
  },
  (error) => {
    console.error("[Response Error]", error.response || error.message);

    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.warn("Unauthorized access - redirecting to login...");
          if (!error.response.config.__isRedirecting) {
            error.response.config.__isRedirecting = true;
            localStorage.removeItem("authToken");
            window.location.href = "/login";
          }
          break;
        case 403:
          console.warn("Forbidden - you do not have permission.");
          break;
        case 404:
          console.warn("API endpoint not found:", error.response.config.url);
          break;
        case 429:
          console.warn("Rate limit exceeded. Retrying...");
          break;
        case 500:
          console.error("Server error - try again later.");
          break;
        default:
          console.warn("Unhandled HTTP error:", error.response.status);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
