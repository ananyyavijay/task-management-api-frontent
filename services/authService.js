import { apiClient } from "./apiClient";

/**
 * POST /auth/register
 */
export async function registerUser(payload) {
  const { data } = await apiClient.post("/auth/register", payload);
  return data;
}

/**
 * POST /auth/login
 */
export async function loginUser(payload) {
  const formData = new URLSearchParams();

  formData.append("username", payload.username);
  formData.append("password", payload.password);

  const { data } = await apiClient.post(
    "/auth/login",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return data;
}