import { apiClient } from "./apiClient";

/**
 * GET /health — no authentication required.
 * @returns {Promise<{status: string, timestamp: string}>}
 */
export async function getHealth() {
  const { data } = await apiClient.get("/health");
  return data;
}
