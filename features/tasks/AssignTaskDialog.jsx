"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { assignTaskSchema } from "@/lib/validations/task";
import { useAssignTaskMutation } from "@/hooks/useTasks";
import { useAuth } from "@/hooks/useAuth";

/**
 * Assigns a task via PATCH /tasks/{id}/assign, which — per the API design
 * doc — is the endpoint that triggers the Service Bus assignment notification.
 * There is no user-directory endpoint in the contract, so the assignee is
 * entered as a raw user ID (UUID).
 */
export function AssignTaskDialog({ open, onOpenChange, task }) {
  const { user } = useAuth();
  const assignMutation = useAssignTaskMutation();

  const form = useForm({
    resolver: zodResolver(assignTaskSchema),
    defaultValues: { assigned_to: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({ assigned_to: task?.assigned_to || "" });
    }
  }, [open, task, form]);

  const onSubmit = async (values) => {
    try {
      await assignMutation.mutateAsync({ id: task.id, payload: values });
      onOpenChange(false);
    } catch {
      // Surfaced via toast in the mutation hook.
    }
  };

  const assignToMe = () => {
    if (user?.id) form.setValue("assigned_to", user.id, { shouldValidate: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign task</DialogTitle>
          <DialogDescription>
            Enter the user ID of the teammate this task should be assigned to.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="assigned_to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 3f1e2d4c-89a0-4b1a-9c2f-7d6e5a4b3c21" {...field} />
                  </FormControl>
                  <FormDescription>
                    Must be a registered user&apos;s ID (UUID).{" "}
                    <button
                      type="button"
                      onClick={assignToMe}
                      className="font-medium text-accent hover:underline"
                    >
                      Assign to me
                    </button>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={assignMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" loading={assignMutation.isPending}>
                <UserCog />
                Assign task
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
