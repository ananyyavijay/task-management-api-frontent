"use client";

import { SlidersHorizontal, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/common/SearchBar";
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from "@/lib/constants";

const ALL = "__all__";

/**
 * Filter panel for the task list. `status` and `priority` map directly to
 * GET /tasks/ query params. `search` is a client-side title/description
 * filter layered on top, since the API has no free-text search param.
 * `project` is only rendered when `projects` is provided (hidden when the
 * list is already scoped to a single project).
 */
export function TaskFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  projectId,
  onProjectChange,
  projects,
  projectsLoading,
  onClear,
}) {
  const hasActiveFilters = Boolean(search || status || priority || projectId);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-white p-4 shadow-soft sm:flex-row sm:flex-wrap sm:items-center">
      <SearchBar
        value={search}
        onChange={onSearchChange}
        placeholder="Search tasks by title or description…"
        className="w-full sm:max-w-xs"
      />

      {projects && (
        <Select
          value={projectId || ALL}
          onValueChange={(v) => onProjectChange(v === ALL ? "" : v)}
          disabled={projectsLoading}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select value={status || ALL} onValueChange={(v) => onStatusChange(v === ALL ? "" : v)}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All statuses</SelectItem>
          {TASK_STATUS_OPTIONS.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={priority || ALL} onValueChange={(v) => onPriorityChange(v === ALL ? "" : v)}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All priorities</SelectItem>
          {TASK_PRIORITY_OPTIONS.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClear} className="sm:ml-auto">
          <X className="h-3.5 w-3.5" />
          Clear filters
        </Button>
      )}

      {!hasActiveFilters && (
        <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:ml-auto sm:flex">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filter tasks
        </span>
      )}
    </div>
  );
}
