import { apiClient } from "./apiClient";

/**
 * GET /auth/me
 * @returns {Promise<import('@/types/user').User>}
 */
export async function getCurrentUser() {
  const { data } = await apiClient.get("/auth/me");
  return data;
}
