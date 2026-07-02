"use client";

import { useEffect, useMemo, useState } from "react";
import { ListChecks, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { PaginationControl } from "@/components/common/PaginationControl";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { TaskFilters } from "@/features/tasks/TaskFilters";
import { TaskTable } from "@/features/tasks/TaskTable";
import { TaskFormDialog } from "@/features/tasks/TaskFormDialog";
import { AssignTaskDialog } from "@/features/tasks/AssignTaskDialog";
import { useTasksQuery, useAllTasksQuery, useDeleteTaskMutation } from "@/hooks/useTasks";
import { useAllProjectsQuery } from "@/hooks/useProjects";
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";

export function TaskListSection({ lockedProjectId = null }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [projectId, setProjectId] = useState("");

  const debouncedSearch = useDebounce(search, 300);
  const isSearching = Boolean(debouncedSearch.trim());
  const effectiveProjectId = lockedProjectId || projectId;

  const { page, skip, limit, nextPage, previousPage, reset } = usePagination();

  // Reset to page 1 whenever the active filters/search change.
  useEffect(() => {
    reset();
  }, [debouncedSearch, status, priority, effectiveProjectId, reset]);

  const { data: projects, isLoading: projectsLoading } = useAllProjectsQuery({
    enabled: !lockedProjectId,
  });
  const projectsById = useMemo(
    () => Object.fromEntries((projects ?? []).map((p) => [p.id, p])),
    [projects]
  );

  const serverParams = {
    project_id: effectiveProjectId || undefined,
    status: status || undefined,
    priority: priority || undefined,
  };

  // No free-text search param exists on GET /tasks/, so when the user is
  // searching we pull the full (filtered) result set and filter client-side.
  const pagedQuery = useTasksQuery({ ...serverParams, skip, limit }, { enabled: !isSearching });
  const searchQuery = useAllTasksQuery(serverParams, { enabled: isSearching });

  let tasks = [];
  let isLoading = false;
  let isFetching = false;

  if (isSearching) {
    const needle = debouncedSearch.trim().toLowerCase();
    const filtered = (searchQuery.data ?? []).filter(
      (t) =>
        t.title?.toLowerCase().includes(needle) ||
        t.description?.toLowerCase().includes(needle)
    );
    tasks = filtered.slice(skip, skip + limit);
    isLoading = searchQuery.isLoading;
    isFetching = searchQuery.isFetching;
  } else {
    tasks = pagedQuery.data ?? [];
    isLoading = pagedQuery.isLoading;
    isFetching = pagedQuery.isFetching;
  }

  const itemCount = isSearching
    ? Math.min(
        limit,
        Math.max(
          0,
          (searchQuery.data ?? []).filter(
            (t) =>
              t.title?.toLowerCase().includes(debouncedSearch.trim().toLowerCase()) ||
              t.description?.toLowerCase().includes(debouncedSearch.trim().toLowerCase())
          ).length - skip
        )
      )
    : tasks.length;

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [assigningTask, setAssigningTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  const deleteMutation = useDeleteTaskMutation();

  const openCreate = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    await deleteMutation.mutateAsync(deletingTask.id);
    setDeletingTask(null);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setProjectId("");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <TaskFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          priority={priority}
          onPriorityChange={setPriority}
          projectId={lockedProjectId ? undefined : projectId}
          onProjectChange={setProjectId}
          projects={lockedProjectId ? undefined : projects}
          projectsLoading={projectsLoading}
          onClear={clearFilters}
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus />
          New Task
        </Button>
      </div>

      {!isLoading && tasks.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No tasks found"
          description={
            search || status || priority || projectId
              ? "Try adjusting your filters or search."
              : "Create your first task to get started."
          }
          action={
            !search &&
            !status &&
            !priority &&
            !projectId && (
              <Button size="sm" onClick={openCreate}>
                <Plus />
                New Task
              </Button>
            )
          }
        />
      ) : (
        <TaskTable
          tasks={tasks}
          isLoading={isLoading}
          projectsById={projectsById}
          showProjectColumn={!lockedProjectId}
          onEdit={(task) => {
            setEditingTask(task);
            setFormOpen(true);
          }}
          onAssign={setAssigningTask}
          onDelete={setDeletingTask}
        />
      )}

      <PaginationControl
        page={page}
        pageSize={limit}
        itemCount={itemCount}
        isLoading={isFetching}
        onPrevious={previousPage}
        onNext={nextPage}
      />

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editingTask}
        defaultProjectId={lockedProjectId}
      />

      <AssignTaskDialog
        open={Boolean(assigningTask)}
        onOpenChange={(open) => !open && setAssigningTask(null)}
        task={assigningTask}
      />

      <ConfirmDialog
        open={Boolean(deletingTask)}
        onOpenChange={(open) => !open && setDeletingTask(null)}
        title="Delete this task?"
        description={
          deletingTask ? `"${deletingTask.title}" will be permanently deleted.` : ""
        }
        confirmLabel="Delete task"
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
