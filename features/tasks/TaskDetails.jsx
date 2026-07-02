"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  ListChecks,
  Pencil,
  RefreshCcw,
  ShieldAlert,
  Trash2,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DetailSkeleton } from "@/components/common/SkeletonLoaders";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { StatusBadge } from "@/features/tasks/StatusBadge";
import { PriorityBadge } from "@/features/tasks/PriorityBadge";
import { AssigneeChip } from "@/features/tasks/AssigneeChip";
import { TaskFormDialog } from "@/features/tasks/TaskFormDialog";
import { AssignTaskDialog } from "@/features/tasks/AssignTaskDialog";
import { AttachmentUploader } from "@/features/attachments/AttachmentUploader";
import { AttachmentList } from "@/features/attachments/AttachmentList";
import { useTaskQuery, useDeleteTaskMutation } from "@/hooks/useTasks";
import { useProjectQuery } from "@/hooks/useProjects";
import { formatDate } from "@/utils/formatters";

export function TaskDetails({ taskId }) {
  const router = useRouter();
  const { data: task, isLoading, isError, error, refetch } = useTaskQuery(taskId);
  const { data: project } = useProjectQuery(task?.project_id);
  const deleteMutation = useDeleteTaskMutation();

  const [editOpen, setEditOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError) {
    const isForbidden = error?.status === 403;
    const isNotFound = error?.status === 404;
    return (
      <EmptyState
        icon={isForbidden ? ShieldAlert : ListChecks}
        title={
          isForbidden
            ? "You don't have access to this task"
            : isNotFound
            ? "Task not found"
            : "Couldn't load this task"
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
            <Button variant="outline" size="sm" onClick={() => router.push("/tasks")}>
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to tasks
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

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(task.id);
    router.push("/tasks");
  };

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/tasks"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to tasks
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {task.title}
              </h1>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
            {project && (
              <Link
                href={`/projects/${project.id}`}
                className="mt-2 inline-flex items-center text-sm text-accent hover:underline"
              >
                {project.name}
              </Link>
            )}
          </div>

          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="sm" onClick={() => setAssignOpen(true)}>
              <UserCog className="h-3.5 w-3.5" />
              Assign
            </Button>
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
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-border bg-white p-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Assignee</p>
            <div className="mt-1.5">
              <AssigneeChip userId={task.assigned_to} />
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Created by</p>
            <div className="mt-1.5">
              <AssigneeChip userId={task.created_by} />
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Created</p>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-foreground">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              {formatDate(task.created_at)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Last updated</p>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-foreground">
              <RefreshCcw className="h-3.5 w-3.5 text-muted-foreground" />
              {formatDate(task.updated_at)}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          {task.description ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {task.description}
            </p>
          ) : (
            <p className="text-sm italic text-muted-foreground">No description provided.</p>
          )}
        </CardContent>
      </Card>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Attachments</h2>
        <AttachmentUploader taskId={task.id} />
        <AttachmentList taskId={task.id} />
      </div>

      <TaskFormDialog open={editOpen} onOpenChange={setEditOpen} task={task} />
      <AssignTaskDialog open={assignOpen} onOpenChange={setAssignOpen} task={task} />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this task?"
        description={`"${task.title}" will be permanently deleted.`}
        confirmLabel="Delete task"
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
