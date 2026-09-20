import axios from "axios";

/**
 * Shared Axios instance for all API calls to the (separately built) Express
 * backend. Base URL comes from VITE_API_URL — never hardcode a production
 * URL here. withCredentials is enabled so the admin session cookie (set by
 * the backend on login) is sent with requests automatically.
 */
const configuredApiUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");
const apiBaseUrl = configuredApiUrl.endsWith("/api")
  ? configuredApiUrl
  : `${configuredApiUrl}/api`;

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Normalise error messages so calling code can just read err.message.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      (error.request && !error.response
        ? "Could not reach the server. Please check your connection and try again."
        : "Something went wrong. Please try again.");
    return Promise.reject(new Error(message));
  }
);

export default api;
