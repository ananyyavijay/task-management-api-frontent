"use client";

import { AppShell } from "@/components/layout/AppShell";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";

export default function AppLayout({ children }) {
  const { isLoading, user } = useAuth();

  // Middleware already guarantees a token cookie exists to reach this layout.
  // This covers the brief window where we're verifying that token against
  // GET /users/me (and the case where it turned out to be expired/invalid —
  // the API client's 401 handler will redirect to /login once that resolves).
  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingSpinner label="Loading your workspace…" size={28} />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
