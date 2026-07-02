import Cookies from "js-cookie";

export const AUTH_COOKIE_NAME =
  process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || "taskflow_token";

// The JWT lives ~60 minutes server-side (Section 4.1 of the API design doc).
// The cookie is given the same lifetime so a stale client can't outlive the token.
const COOKIE_EXPIRES_DAYS = 1 / 24; // ~60 minutes

/**
 * Persist the JWT access token returned by POST /auth/login.
 * Stored in a cookie (rather than only localStorage) so that Next.js
 * middleware can read it on the server to protect routes.
 * @param {string} token
 */
export function setAuthToken(token) {
  Cookies.set(AUTH_COOKIE_NAME, token, {
    expires: COOKIE_EXPIRES_DAYS,
    sameSite: "lax",
    secure: typeof window !== "undefined" && window.location.protocol === "https:",
    path: "/",
  });
}

/**
 * Read the currently stored JWT access token, if any.
 * @returns {string|undefined}
 */
export function getAuthToken() {
  return Cookies.get(AUTH_COOKIE_NAME);
}

/**
 * Clear the stored JWT access token (logout).
 */
export function clearAuthToken() {
  Cookies.remove(AUTH_COOKIE_NAME, { path: "/" });
}
