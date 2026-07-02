"use client";

import Link from "next/link";
import { MoreVertical, Pencil, Trash2, FolderKanban, Crown } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { formatRelativeTime } from "@/utils/formatters";

export function ProjectCard({ project, onEdit, onDelete }) {
  const { user } = useAuth();
  const isOwner = user?.id === project.owner_id;

  return (
    <Card className="group relative flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-elevated">
      <Link href={`/projects/${project.id}`} className="absolute inset-0 z-0" aria-label={project.name} />

      <CardHeader className="relative z-10 flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-slate-600">
          <FolderKanban className="h-5 w-5" />
        </div>

        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="relative z-10 -mr-1.5 -mt-1.5 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
                onClick={(e) => e.preventDefault()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(project)}>
                <Pencil className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem destructive onClick={() => onDelete?.(project)}>
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      <CardContent className="relative z-10 space-y-3">
        <div>
          <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
            {project.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {project.description || "No description provided."}
          </p>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">
            Updated {formatRelativeTime(project.updated_at)}
          </span>
          {isOwner && (
            <Badge variant="outline" className="gap-1 text-[11px]">
              <Crown className="h-3 w-3" />
              Owner
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
