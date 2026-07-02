import axios from "axios";
import { getAuthToken, clearAuthToken } from "@/lib/auth-token";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://localhost:8000";

export const apiClient = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
});

// Attach the Bearer JWT to every outgoing request, per Section 4.1
// ("Authorization: Bearer <token>") of the API design document.
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * The API returns a consistent error body on every failure:
 *   { "detail": "<human-readable message>" }
 * This normalizes that (and network failures) into a single Error
 * with a `.status` and `.detail` attached, so calling code and
 * TanStack Query error boundaries can rely on one shape.
 */
function normalizeError(error) {
  const status = error.response?.status;
  const detail =
    error.response?.data?.detail ||
    (status
      ? `Request failed with status ${status}.`
      : "Network error — please check your connection and the API URL.");

  const normalized = new Error(detail);
  normalized.status = status;
  normalized.detail = detail;
  return normalized;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 401 Unauthorized: the token is missing, expired, or malformed.
    // Clear it and let the app-level auth guard redirect to /login.
    if (status === 401 && typeof window !== "undefined") {
      clearAuthToken();
      const isAuthPage =
        window.location.pathname.startsWith("/login") ||
        window.location.pathname.startsWith("/register");
      if (!isAuthPage) {
        const redirectTo = encodeURIComponent(
          window.location.pathname + window.location.search
        );
        window.location.href = `/login?redirect=${redirectTo}&reason=session_expired`;
      }
    }

    return Promise.reject(normalizeError(error));
  }
);
