"use client";

import Link from "next/link";
import { ArrowUpRight, ListChecks } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { ListRowsSkeleton } from "@/components/common/SkeletonLoaders";
import { StatusBadge } from "@/features/tasks/StatusBadge";
import { PriorityBadge } from "@/features/tasks/PriorityBadge";
import { useAllTasksQuery } from "@/hooks/useTasks";
import { formatRelativeTime } from "@/utils/formatters";

export function RecentTasksList() {
  const { data: tasks, isLoading } = useAllTasksQuery();

  const recent = [...(tasks ?? [])]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Recent Tasks</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/tasks">
            View all
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ListRowsSkeleton rows={5} />
        ) : recent.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="No tasks yet"
            description="Tasks you create will show up here."
          />
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((task) => (
              <li key={task.id}>
                <Link
                  href={`/tasks/${task.id}`}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground group-hover:text-accent">
                      {task.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Created {formatRelativeTime(task.created_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
