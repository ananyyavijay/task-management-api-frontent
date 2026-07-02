"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  assignTask,
  createTask,
  deleteTask,
  fetchAllTasks,
  getTask,
  listTasks,
  updateTask,
} from "@/services/taskService";

const taskKeys = {
  all: ["tasks"],
  lists: () => [...taskKeys.all, "list"],
  list: (params) => [...taskKeys.lists(), params],
  details: () => [...taskKeys.all, "detail"],
  detail: (id) => [...taskKeys.details(), id],
};

/** GET /tasks/ — filterable, paginated list for the Tasks page. */
export function useTasksQuery(params, options = {}) {
  return useQuery({
    queryKey: taskKeys.list(params),
    queryFn: () => listTasks(params),
    placeholderData: (previousData) => previousData,
    ...options,
  });
}

/** All tasks (optionally filtered) — used for dashboard aggregates. */
export function useAllTasksQuery(filters = {}, options = {}) {
  return useQuery({
    queryKey: [...taskKeys.lists(), "all", filters],
    queryFn: () => fetchAllTasks(filters),
    ...options,
  });
}

/** GET /tasks/{id} */
export function useTaskQuery(id) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => getTask(id),
    enabled: Boolean(id),
  });
}

/** POST /tasks/ */
export function useCreateTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success("Task created", { description: task.title });
    },
    onError: (error) => {
      toast.error("Couldn't create task", { description: error.detail });
    },
  });
}

/** PUT /tasks/{id} — does not trigger a notification (see PATCH /assign for that). */
export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateTask(id, payload),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.setQueryData(taskKeys.detail(task.id), task);
      toast.success("Task updated");
    },
    onError: (error) => {
      toast.error("Couldn't update task", { description: error.detail });
    },
  });
}

/** PATCH /tasks/{id}/assign */
export function useAssignTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => assignTask(id, payload),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.setQueryData(taskKeys.detail(task.id), task);
      toast.success("Task assigned", {
        description: "The assignee will be notified.",
      });
    },
    onError: (error) => {
      toast.error("Couldn't assign task", { description: error.detail });
    },
  });
}

/** DELETE /tasks/{id} — soft delete. */
export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success("Task deleted");
    },
    onError: (error) => {
      toast.error("Couldn't delete task", { description: error.detail });
    },
  });
}

export { taskKeys };
