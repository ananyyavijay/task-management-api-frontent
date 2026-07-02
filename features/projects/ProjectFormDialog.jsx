"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { projectSchema } from "@/lib/validations/project";
import { useCreateProjectMutation, useUpdateProjectMutation } from "@/hooks/useProjects";

/**
 * Controlled create/edit dialog for projects.
 * Pass `project` to edit (PUT /projects/{id}); omit it to create (POST /projects/).
 */
export function ProjectFormDialog({ open, onOpenChange, project = null, onSuccess }) {
  const isEdit = Boolean(project);
  const createMutation = useCreateProjectMutation();
  const updateMutation = useUpdateProjectMutation();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: project?.name ?? "",
        description: project?.description ?? "",
      });
    }
  }, [open, project, form]);

  const onSubmit = async (values) => {
    const payload = {
      name: values.name,
      description: values.description || undefined,
    };

    try {
      if (isEdit) {
        const updated = await updateMutation.mutateAsync({ id: project.id, payload });
        onSuccess?.(updated);
      } else {
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit project" : "Create a new project"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the project name or description."
              : "Give your project a clear name so your team can find it easily."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project name</FormLabel>
                  <FormControl>
                    <Input placeholder="Website Redesign" autoFocus {...field} />
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
                    <Textarea
                      placeholder="What is this project about?"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                <FolderPlus />
                {isEdit ? "Save changes" : "Create project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
