/**
 * @typedef {"Todo"|"In Progress"|"In Review"|"Done"} TaskStatus
 * @typedef {"Low"|"Normal"|"High"|"Critical"} TaskPriority
 */

/**
 * Mirrors the backend `TaskResponse` schema.
 * @typedef {Object} Task
 * @property {string} id - UUID
 * @property {string} project_id - UUID
 * @property {string} title
 * @property {string|null} description
 * @property {TaskStatus} status
 * @property {TaskPriority} priority
 * @property {string|null} assigned_to - UUID, nullable
 * @property {string} created_by - UUID
 * @property {string} created_at - ISO 8601 UTC timestamp
 * @property {string} updated_at - ISO 8601 UTC timestamp
 */

/**
 * Payload for POST /tasks/
 * @typedef {Object} TaskCreateRequest
 * @property {string} project_id - UUID
 * @property {string} title - 1-500 characters
 * @property {string} [description]
 * @property {TaskStatus} [status] - defaults to "Todo"
 * @property {TaskPriority} [priority] - defaults to "Normal"
 * @property {string} [assigned_to] - UUID
 */

/**
 * Payload for PUT /tasks/{id}
 * @typedef {Object} TaskUpdateRequest
 * @property {string} [title]
 * @property {string} [description]
 * @property {TaskStatus} [status]
 * @property {TaskPriority} [priority]
 */

/**
 * Payload for PATCH /tasks/{id}/assign
 * @typedef {Object} AssignTaskRequest
 * @property {string} assigned_to - UUID, required
 */

/**
 * Query params for GET /tasks/
 * @typedef {Object} TaskListParams
 * @property {string} [project_id]
 * @property {TaskStatus} [status]
 * @property {TaskPriority} [priority]
 * @property {number} [skip] - default 0
 * @property {number} [limit] - default 20, max 100
 */

export {};
