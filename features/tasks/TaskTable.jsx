"use client";

import Link from "next/link";
import { MoreVertical, Pencil, Trash2, UserCog, Paperclip } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/features/tasks/StatusBadge";
import { PriorityBadge } from "@/features/tasks/PriorityBadge";
import { AssigneeChip } from "@/features/tasks/AssigneeChip";
import { TableRowsSkeleton } from "@/components/common/SkeletonLoaders";
import { formatRelativeTime } from "@/utils/formatters";

function TaskActionsMenu({ task, onEdit, onAssign, onDelete }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" onClick={(e) => e.preventDefault()}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(task)}>
          <Pencil className="h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAssign(task)}>
          <UserCog className="h-4 w-4" />
          Assign
        </DropdownMenuItem>
        <DropdownMenuItem destructive onClick={() => onDelete(task)}>
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TaskTable({
  tasks,
  isLoading,
  projectsById,
  showProjectColumn = true,
  onEdit,
  onAssign,
  onDelete,
}) {
  if (isLoading) {
    return (
      <>
        {/* Desktop skeleton */}
        <div className="hidden overflow-hidden rounded-xl border border-border md:block">
          <table className="w-full text-sm">
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                {showProjectColumn && <TableHead>Project</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRowsSkeleton rows={6} columns={showProjectColumn ? 6 : 5} />
            </TableBody>
          </table>
        </div>
        <div className="space-y-3 md:hidden">
          <TableRowsSkeleton rows={4} columns={1} />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Desktop / tablet table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              {showProjectColumn && <TableHead>Project</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} className="group">
                <TableCell className="max-w-xs">
                  <Link
                    href={`/tasks/${task.id}`}
                    className="line-clamp-1 font-medium text-foreground group-hover:text-accent"
                  >
                    {task.title}
                  </Link>
                  {task.description && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {task.description}
                    </p>
                  )}
                </TableCell>
                {showProjectColumn && (
                  <TableCell>
                    <Link
                      href={`/projects/${task.project_id}`}
                      className="text-xs font-medium text-slate-600 hover:text-accent"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {projectsById?.[task.project_id]?.name || "—"}
                    </Link>
                  </TableCell>
                )}
                <TableCell>
                  <StatusBadge status={task.status} />
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={task.priority} />
                </TableCell>
                <TableCell>
                  <AssigneeChip userId={task.assigned_to} />
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatRelativeTime(task.updated_at)}
                </TableCell>
                <TableCell>
                  <TaskActionsMenu
                    task={task}
                    onEdit={onEdit}
                    onAssign={onAssign}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile stacked cards */}
      <div className="space-y-3 md:hidden">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="rounded-xl border border-border bg-white p-4 shadow-soft"
          >
            <div className="flex items-start justify-between gap-2">
              <Link href={`/tasks/${task.id}`} className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-semibold text-foreground">
                  {task.title}
                </p>
                {showProjectColumn && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {projectsById?.[task.project_id]?.name || "—"}
                  </p>
                )}
              </Link>
              <TaskActionsMenu
                task={task}
                onEdit={onEdit}
                onAssign={onAssign}
                onDelete={onDelete}
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <AssigneeChip userId={task.assigned_to} />
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Paperclip className="h-3 w-3" />
                {formatRelativeTime(task.updated_at)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
