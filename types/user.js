/**
 * @typedef {"user"|"admin"} UserRole
 */

/**
 * Mirrors the backend `UserResponse` schema.
 * @typedef {Object} User
 * @property {string} id - UUID
 * @property {string} username
 * @property {string} email
 * @property {UserRole} role
 * @property {string} created_at - ISO 8601 UTC timestamp
 */

export {};
