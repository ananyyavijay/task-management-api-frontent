"use client";

import { useAuth } from "@/hooks/useAuth";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function WelcomeSection() {
  const { user } = useAuth();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm text-muted-foreground">{today}</p>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {getGreeting()}
        {user?.username ? `, ${user.username}` : ""}
      </h1>
      <p className="text-sm text-muted-foreground">
        Here&apos;s what&apos;s happening across your projects today.
      </p>
    </div>
  );
}
