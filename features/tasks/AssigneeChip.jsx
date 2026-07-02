"use client";

import { UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { shortenId } from "@/utils/formatters";
import { cn } from "@/lib/utils";

/**
 * The API only exposes GET /users/me — there is no user-directory endpoint
 * to resolve a UUID into a name. So we show "You" for the current user and
 * a shortened, copyable ID for everyone else (full ID on hover).
 */
export function AssigneeChip({ userId, className }) {
  const { user } = useAuth();

  if (!userId) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-sm text-muted-foreground", className)}>
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-border">
          <UserRound className="h-3.5 w-3.5" />
        </span>
        Unassigned
      </span>
    );
  }

  const isCurrentUser = user?.id === userId;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn("inline-flex items-center gap-1.5 text-sm text-foreground", className)}>
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-[10px]">
              {isCurrentUser ? user.username.slice(0, 2).toUpperCase() : userId.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isCurrentUser ? "You" : shortenId(userId)}
        </span>
      </TooltipTrigger>
      <TooltipContent>{isCurrentUser ? user.username : userId}</TooltipContent>
    </Tooltip>
  );
}
