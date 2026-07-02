"use client";

import Link from "next/link";
import { ArrowUpRight, FolderKanban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { ListRowsSkeleton } from "@/components/common/SkeletonLoaders";
import { useAllProjectsQuery } from "@/hooks/useProjects";
import { formatRelativeTime } from "@/utils/formatters";

export function RecentProjectsList() {
  const { data: projects, isLoading } = useAllProjectsQuery();

  const recent = [...(projects ?? [])]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Recent Projects</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/projects">
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
            icon={FolderKanban}
            title="No projects yet"
            description="Create a project to start organizing tasks."
          />
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.id}`}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground group-hover:text-accent">
                      {project.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {project.description || "No description"}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatRelativeTime(project.created_at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
