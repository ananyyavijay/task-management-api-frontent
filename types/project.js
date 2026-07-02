/**
 * Mirrors the backend `ProjectResponse` schema.
 * @typedef {Object} Project
 * @property {string} id - UUID
 * @property {string} name
 * @property {string|null} description
 * @property {string} owner_id - UUID
 * @property {string} created_at - ISO 8601 UTC timestamp
 * @property {string} updated_at - ISO 8601 UTC timestamp
 */

/**
 * Payload for POST /projects/
 * @typedef {Object} ProjectCreateRequest
 * @property {string} name - 1-200 characters
 * @property {string} [description]
 */

/**
 * Payload for PUT /projects/{id}
 * @typedef {Object} ProjectUpdateRequest
 * @property {string} [name]
 * @property {string} [description]
 */

export {};
