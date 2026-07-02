"use client";

import { useQuery } from "@tanstack/react-query";
import { getHealth } from "@/services/healthService";
import { MobileNav } from "@/components/layout/MobileNav";
import { UserMenu } from "@/components/layout/UserMenu";
import { cn } from "@/lib/utils";

function ApiStatusPill() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    retry: false,
    refetchInterval: 60_000,
    refetchOnWindowFocus: false,
  });

  const online = !isError && Boolean(data);

  return (
    <div
      className={cn(
        "hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium sm:flex",
        isLoading
          ? "border-border bg-secondary text-muted-foreground"
          : online
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-700"
      )}
      title={online ? "API is reachable" : "API is unreachable"}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isLoading ? "bg-slate-400" : online ? "bg-green-500" : "bg-red-500"
        )}
      />
      {isLoading ? "Checking API…" : online ? "API Connected" : "API Offline"}
    </div>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:pl-6">
      <MobileNav />
      <div className="flex-1" />
      <ApiStatusPill />
      <UserMenu />
    </header>
  );
}
