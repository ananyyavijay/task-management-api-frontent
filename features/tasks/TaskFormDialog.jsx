"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ListPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { taskCreateSchema, taskUpdateSchema } from "@/lib/validations/task";
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from "@/lib/constants";
import { useCreateTaskMutation, useUpdateTaskMutation } from "@/hooks/useTasks";
import { useAllProjectsQuery } from "@/hooks/useProjects";

/**
 * Controlled create/edit dialog for tasks.
 * Pass `task` to edit (PUT /tasks/{id} — title/description/status/priority only).
 * Omit it to create (POST /tasks/ — includes project_id and optional assigned_to).
 */
export function TaskFormDialog({
  open,
  onOpenChange,
  task = null,
  defaultProjectId = null,
  onSuccess,
}) {
  const isEdit = Boolean(task);
  const { data: projects, isLoading: projectsLoading } = useAllProjectsQuery({
    enabled: open && !isEdit,
  });

  const createMutation = useCreateTaskMutation();
  const updateMutation = useUpdateTaskMutation();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const form = useForm({
    resolver: zodResolver(isEdit ? taskUpdateSchema : taskCreateSchema),
    defaultValues: {
      project_id: defaultProjectId || "",
      title: "",
      description: "",
      status: "Todo",
      priority: "Normal",
      assigned_to: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        project_id: task?.project_id || defaultProjectId || "",
        title: task?.title ?? "",
        description: task?.description ?? "",
        status: task?.status ?? "Todo",
        priority: task?.priority ?? "Normal",
        assigned_to: "",
      });
    }
  }, [open, task, defaultProjectId, form]);

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        const payload = {
          title: values.title,
          description: values.description || undefined,
          status: values.status,
          priority: values.priority,
        };
        const updated = await updateMutation.mutateAsync({ id: task.id, payload });
        onSuccess?.(updated);
      } else {
        const payload = {
          project_id: values.project_id,
          title: values.title,
          description: values.description || undefined,
          status: values.status,
          priority: values.priority,
          assigned_to: values.assigned_to || undefined,
        };
        const created = await createMutation.mutateAsync(payload);
        onSuccess?.(created);
      }
      onOpenChange(false);
    } catch {
      // Errors are already surfaced via toast in the mutation hooks.
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit task" : "Create a new task"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the task details below."
              : "Add a task to a project and optionally assign it right away."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {!isEdit && (
              <FormField
                control={form.control}
                name="project_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={projectsLoading || Boolean(defaultProjectId)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects?.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Design the landing page hero" autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description <span className="font-normal text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add more context…" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TASK_STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TASK_PRIORITY_OPTIONS.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {!isEdit && (
              <FormField
                control={form.control}
                name="assigned_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Assign to{" "}
                      <span className="font-normal text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="User ID (UUID)" {...field} />
                    </FormControl>
                    <FormDescription>
                      Paste a registered user&apos;s ID. You can also assign this later
                      from the task details page.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                <ListPlus />
                {isEdit ? "Save changes" : "Create task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
