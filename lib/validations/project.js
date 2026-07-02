import { z } from "zod";

// Mirrors ProjectCreateRequest / ProjectUpdateRequest — name 1-200 chars,
// description optional free text.
export const projectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required.")
    .max(200, "Project name must be at most 200 characters."),
  description: z
    .string()
    .max(4000, "Description is too long.")
    .optional()
    .or(z.literal("")),
});
