import { z } from "zod";
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from "@/lib/constants";

// Mirrors TaskCreateRequest — project_id required UUID, title 1-500 chars,
// description/status/priority/assigned_to optional.
export const taskCreateSchema = z.object({
  project_id: z.string().uuid("Select a valid project."),
  title: z
    .string()
    .min(1, "Title is required.")
    .max(500, "Title must be at most 500 characters."),
  description: z.string().max(8000, "Description is too long.").optional().or(z.literal("")),
  status: z.enum(TASK_STATUS_OPTIONS).optional(),
  priority: z.enum(TASK_PRIORITY_OPTIONS).optional(),
  assigned_to: z
    .string()
    .trim()
    .uuid("Assignee must be a valid user ID (UUID).")
    .optional()
    .or(z.literal("")),
});

// Mirrors TaskUpdateRequest — all fields optional.
export const taskUpdateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required.")
    .max(500, "Title must be at most 500 characters.")
    .optional(),
  description: z.string().max(8000, "Description is too long.").optional().or(z.literal("")),
  status: z.enum(TASK_STATUS_OPTIONS).optional(),
  priority: z.enum(TASK_PRIORITY_OPTIONS).optional(),
});

// Mirrors AssignTaskRequest — assigned_to required UUID.
export const assignTaskSchema = z.object({
  assigned_to: z
    .string()
    .trim()
    .min(1, "Enter a user ID to assign this task.")
    .uuid("Enter a valid user ID (UUID)."),
});
