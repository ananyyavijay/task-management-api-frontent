"use client";

import { createContext, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/services/authService";
import { getCurrentUser } from "@/services/userService";
import { getAuthToken, setAuthToken, clearAuthToken } from "@/lib/auth-token";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const hasToken = typeof window !== "undefined" && Boolean(getAuthToken());

  const {
    data: user,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  /**
   * POST /auth/login → store JWT → hydrate the current-user session.
   * @param {{username: string, password: string}} credentials
   */
  const login = useCallback(
  async (credentials) => {
    const { access_token } = await loginUser(credentials);

    setAuthToken(access_token);

    // Remove previous user's cached profile
    queryClient.removeQueries({
      queryKey: ["auth", "me"],
    });

    // Fetch profile using the new token
    const me = await queryClient.fetchQuery({
      queryKey: ["auth", "me"],
      queryFn: getCurrentUser,
      staleTime: 0,
    });

    return me;
  },
  [queryClient]
);
  /**
   * POST /auth/register. The endpoint returns a UserResponse (no token),
   * so the caller is redirected to /login to authenticate afterwards.
   * @param {{username: string, email: string, password: string}} payload
   */
  const register = useCallback(async (payload) => {
    return registerUser(payload);
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    queryClient.clear();
    router.push("/login");
  }, [queryClient, router]);

  const value = useMemo(
    () => ({
      user: user ?? null,
      isAuthenticated: Boolean(user),
      isLoading: hasToken && isLoading,
      isFetching,
      authError: error,
      login,
      register,
      logout,
    }),
    [user, hasToken, isLoading, isFetching, error, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
