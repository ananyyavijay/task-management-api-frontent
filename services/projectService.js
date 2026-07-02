import { apiClient } from "./apiClient";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "@/lib/constants";

/**
 * GET /projects/  — skip (default 0), limit (default 20, max 100)
 * @param {{skip?: number, limit?: number}} params
 * @returns {Promise<import('@/types/project').Project[]>}
 */
export async function listProjects(params = {}) {
  const { skip = 0, limit = DEFAULT_PAGE_SIZE } = params;
  const { data } = await apiClient.get("/projects/", {
    params: { skip, limit },
  });
  return data;
}

/**
 * GET /projects/{id}
 * @param {string} id
 * @returns {Promise<import('@/types/project').Project>}
 */
export async function getProject(id) {
  const { data } = await apiClient.get(`/projects/${id}`);
  return data;
}

/**
 * POST /projects/
 * @param {import('@/types/project').ProjectCreateRequest} payload
 * @returns {Promise<import('@/types/project').Project>}
 */
export async function createProject(payload) {
  const { data } = await apiClient.post("/projects/", payload);
  return data;
}

/**
 * PUT /projects/{id} — owner only
 * @param {string} id
 * @param {import('@/types/project').ProjectUpdateRequest} payload
 * @returns {Promise<import('@/types/project').Project>}
 */
export async function updateProject(id, payload) {
  const { data } = await apiClient.put(`/projects/${id}`, payload);
  return data;
}

/**
 * DELETE /projects/{id} — owner only. 204 No Content.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteProject(id) {
  await apiClient.delete(`/projects/${id}`);
}

/**
 * Walks GET /projects/ with skip/limit until a short page is returned.
 * Used for dashboard aggregates — it only ever calls the documented,
 * paginated list endpoint, it does not add a new endpoint.
 * @param {{hardCap?: number}} [options]
 * @returns {Promise<import('@/types/project').Project[]>}
 */
export async function fetchAllProjects({ hardCap = 500 } = {}) {
  let skip = 0;
  const limit = MAX_PAGE_SIZE;
  let all = [];

  while (all.length < hardCap) {
    const page = await listProjects({ skip, limit });
    all = all.concat(page);
    if (page.length < limit) break;
    skip += limit;
  }

  return all;
}
