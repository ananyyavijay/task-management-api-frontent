"use client";

import { useState } from "react";
import { Check, Copy, LogOut, Mail, ShieldCheck, Calendar as CalendarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useAuth } from "@/hooks/useAuth";
import { useAllProjectsQuery } from "@/hooks/useProjects";
import { useAllTasksQuery } from "@/hooks/useTasks";
import { getInitials, formatDate } from "@/utils/formatters";
import { USER_ROLE } from "@/lib/constants";

export function ProfileCard() {
  const { user, logout } = useAuth();
  const [copied, setCopied] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const { data: projects } = useAllProjectsQuery();
  const { data: tasks } = useAllTasksQuery();

  const ownedProjects = projects?.filter((p) => p.owner_id === user?.id).length ?? 0;
  const assignedTasks = tasks?.filter((t) => t.assigned_to === user?.id).length ?? 0;

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — silently ignore, ID is still visible on screen.
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{getInitials(user.username)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                {user.username}
              </h1>
              <Badge variant={user.role === USER_ROLE.ADMIN ? "accent" : "default"} className="capitalize">
                <ShieldCheck className="h-3 w-3" />
                {user.role}
              </Badge>
            </div>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">User ID</span>
            <button
              onClick={copyId}
              className="flex items-center gap-1.5 rounded-md border border-border bg-secondary/50 px-2.5 py-1 font-mono text-xs text-foreground hover:bg-secondary"
            >
              {user.id}
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Member since</span>
            <span className="flex items-center gap-1.5 text-sm text-foreground">
              <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
              {formatDate(user.created_at)}
            </span>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="rounded-lg bg-secondary/50 p-3 text-center">
              <p className="text-lg font-semibold text-foreground">{ownedProjects}</p>
              <p className="text-xs text-muted-foreground">Projects owned</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3 text-center">
              <p className="text-lg font-semibold text-foreground">{assignedTasks}</p>
              <p className="text-xs text-muted-foreground">Tasks assigned to you</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Sign out of TaskFlow on this device.
            </p>
            <Button variant="outline" onClick={() => setLogoutOpen(true)}>
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Log out of TaskFlow?"
        description="You'll need to sign in again to access your workspace."
        confirmLabel="Log out"
        destructive={false}
        onConfirm={logout}
      />
    </div>
  );
}
