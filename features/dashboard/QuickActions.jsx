"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderPlus, ListPlus, FolderKanban, ListChecks } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectFormDialog } from "@/features/projects/ProjectFormDialog";
import { TaskFormDialog } from "@/features/tasks/TaskFormDialog";

export function QuickActions() {
  const router = useRouter();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="h-auto flex-col items-start gap-2 p-4"
          onClick={() => setProjectDialogOpen(true)}
        >
          <FolderPlus className="h-5 w-5 text-accent" />
          <span className="text-sm font-medium">New Project</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto flex-col items-start gap-2 p-4"
          onClick={() => setTaskDialogOpen(true)}
        >
          <ListPlus className="h-5 w-5 text-accent" />
          <span className="text-sm font-medium">New Task</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto flex-col items-start gap-2 p-4"
          onClick={() => router.push("/projects")}
        >
          <FolderKanban className="h-5 w-5 text-slate-500" />
          <span className="text-sm font-medium">Browse Projects</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto flex-col items-start gap-2 p-4"
          onClick={() => router.push("/tasks")}
        >
          <ListChecks className="h-5 w-5 text-slate-500" />
          <span className="text-sm font-medium">Browse Tasks</span>
        </Button>
      </CardContent>

      <ProjectFormDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        onSuccess={(project) => router.push(`/projects/${project.id}`)}
      />
      <TaskFormDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onSuccess={(task) => router.push(`/tasks/${task.id}`)}
      />
    </Card>
  );
}
