import { apiClient } from "./apiClient";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "@/lib/constants";

/**
 * GET /tasks/ — optional project_id, status, priority filters; skip/limit pagination.
 * @param {import('@/types/task').TaskListParams} params
 * @returns {Promise<import('@/types/task').Task[]>}
 */
export async function listTasks(params = {}) {
  const { project_id, status, priority, skip = 0, limit = DEFAULT_PAGE_SIZE } = params;
  const { data } = await apiClient.get("/tasks", {
    params: {
      ...(project_id ? { project_id } : {}),
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
      skip,
      limit,
    },
  });
  return data;
}

/**
 * GET /tasks/{id}
 * @param {string} id
 * @returns {Promise<import('@/types/task').Task>}
 */
export async function getTask(id) {
  const { data } = await apiClient.get(`/tasks${id}`);
  return data;
}

/**
 * POST /tasks/
 * @param {import('@/types/task').TaskCreateRequest} payload
 * @returns {Promise<import('@/types/task').Task>}
 */
export async function createTask(payload) {
  const { data } = await apiClient.post("/tasks", payload);
  return data;
}

/**
 * PUT /tasks/{id} — does NOT trigger a Service Bus notification.
 * @param {string} id
 * @param {import('@/types/task').TaskUpdateRequest} payload
 * @returns {Promise<import('@/types/task').Task>}
 */
export async function updateTask(id, payload) {
  const { data } = await apiClient.put(`/tasks${id}`, payload);
  return data;
}

/**
 * PATCH /tasks/{id}/assign — triggers the Service Bus task-assigned notification.
 * @param {string} id
 * @param {import('@/types/task').AssignTaskRequest} payload
 * @returns {Promise<import('@/types/task').Task>}
 */
export async function assignTask(id, payload) {
  const { data } = await apiClient.patch(`/tasks/${id}/assign`, payload);
  return data;
}

/**
 * DELETE /tasks/{id} — soft delete (sets deleted_at). 204 No Content.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteTask(id) {
  await apiClient.delete(`/tasks/${id}`);
}

/**
 * Walks GET /tasks/ with skip/limit until a short page is returned.
 * Used for dashboard aggregates and client-side search — it only calls
 * the documented, paginated list endpoint.
 * @param {{project_id?: string, status?: string, priority?: string, hardCap?: number}} [options]
 * @returns {Promise<import('@/types/task').Task[]>}
 */
export async function fetchAllTasks({ hardCap = 500, ...filters } = {}) {
  let skip = 0;
  const limit = MAX_PAGE_SIZE;
  let all = [];

  while (all.length < hardCap) {
    const page = await listTasks({ ...filters, skip, limit });
    all = all.concat(page);
    if (page.length < limit) break;
    skip += limit;
  }

  return all;
}
