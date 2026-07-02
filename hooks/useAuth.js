"use client";

import { useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";

/**
 * Access the current session (user, isAuthenticated, isLoading) and the
 * login / register / logout actions.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
