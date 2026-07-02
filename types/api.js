/**
 * Payload for POST /auth/register
 * @typedef {Object} RegisterRequest
 * @property {string} username - 3-50 characters; alphanumeric + underscore
 * @property {string} email
 * @property {string} password - minimum 8 characters
 */

/**
 * Payload for POST /auth/login
 * @typedef {Object} LoginRequest
 * @property {string} username
 * @property {string} password
 */

/**
 * Response from POST /auth/login
 * @typedef {Object} TokenResponse
 * @property {string} access_token
 * @property {string} token_type - always "bearer"
 */

/**
 * The consistent error body shape returned by every endpoint on failure.
 * @typedef {Object} ApiErrorBody
 * @property {string} detail
 */

/**
 * Common pagination query params (GET /projects/, GET /tasks/)
 * @typedef {Object} PaginationParams
 * @property {number} [skip] - default 0
 * @property {number} [limit] - default 20, max 100
 */

export {};
