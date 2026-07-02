"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  FolderKanban,
  Pencil,
  RefreshCcw,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DetailSkeleton } from "@/components/common/SkeletonLoaders";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ProjectFormDialog } from "@/features/projects/ProjectFormDialog";
import { TaskListSection } from "@/features/tasks/TaskListSection";
import { AssigneeChip } from "@/features/tasks/AssigneeChip";
import { useProjectQuery, useDeleteProjectMutation } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/utils/formatters";

export function ProjectDetails({ projectId }) {
  const router = useRouter();
  const { user } = useAuth();
  const { data: project, isLoading, isError, error, refetch } = useProjectQuery(projectId);
  const deleteMutation = useDeleteProjectMutation();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError) {
    const isForbidden = error?.status === 403;
    const isNotFound = error?.status === 404;
    return (
      <EmptyState
        icon={isForbidden ? ShieldAlert : FolderKanban}
        title={
          isForbidden
            ? "You don't have access to this project"
            : isNotFound
            ? "Project not found"
            : "Couldn't load this project"
        }
        description={
          isForbidden
            ? "Ask the project owner to add you as a member."
            : isNotFound
            ? "It may have been deleted, or the link is incorrect."
            : error?.detail
        }
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/projects")}>
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to projects
            </Button>
            {!isForbidden && !isNotFound && (
              <Button size="sm" onClick={() => refetch()}>
                <RefreshCcw className="h-3.5 w-3.5" />
                Retry
              </Button>
            )}
          </div>
        }
      />
    );
  }

  const isOwner = user?.id === project.owner_id;

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(project.id);
    router.push("/projects");
  };

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/projects"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to projects
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-slate-600">
              <FolderKanban className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  {project.name}
                </h1>
                {isOwner && <Badge variant="outline">Owner</Badge>}
              </div>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                {project.description || "No description provided."}
              </p>
            </div>
          </div>

          {isOwner && (
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/5 hover:text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Created {formatDate(project.created_at)}
          </span>
          <span className="flex items-center gap-1.5">
            <RefreshCcw className="h-3.5 w-3.5" />
            Updated {formatDate(project.updated_at)}
          </span>
          <span className="flex items-center gap-1.5">
            Owner: <AssigneeChip userId={project.owner_id} />
          </span>
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground">
          Tasks in this project
        </h2>
        <TaskListSection lockedProjectId={project.id} />
      </div>

      <ProjectFormDialog open={editOpen} onOpenChange={setEditOpen} project={project} />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this project?"
        description={`"${project.name}" and its association with all tasks will be permanently deleted. This action cannot be undone.`}
        confirmLabel="Delete project"
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
