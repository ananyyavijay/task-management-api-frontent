"use client";

import { FolderKanban, ListChecks, CheckCircle2, Clock, Flame } from "lucide-react";
import { StatCard } from "@/features/dashboard/StatCard";
import { StatCardSkeleton } from "@/components/common/SkeletonLoaders";
import { useAllProjectsQuery } from "@/hooks/useProjects";
import { useAllTasksQuery } from "@/hooks/useTasks";
import { TASK_PRIORITY, TASK_STATUS } from "@/lib/constants";

export function StatsGrid() {
  const { data: projects, isLoading: projectsLoading } = useAllProjectsQuery();
  const { data: tasks, isLoading: tasksLoading } = useAllTasksQuery();

  const isLoading = projectsLoading || tasksLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const totalProjects = projects?.length ?? 0;
  const totalTasks = tasks?.length ?? 0;
  const completedTasks = tasks?.filter((t) => t.status === TASK_STATUS.DONE).length ?? 0;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks =
    tasks?.filter(
      (t) =>
        (t.priority === TASK_PRIORITY.HIGH || t.priority === TASK_PRIORITY.CRITICAL) &&
        t.status !== TASK_STATUS.DONE
    ).length ?? 0;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard label="Total Projects" value={totalProjects} icon={FolderKanban} tone="slate" />
      <StatCard label="Total Tasks" value={totalTasks} icon={ListChecks} tone="blue" />
      <StatCard label="Completed" value={completedTasks} icon={CheckCircle2} tone="green" />
      <StatCard label="Pending" value={pendingTasks} icon={Clock} tone="amber" />
      <StatCard
        label="High Priority"
        value={highPriorityTasks}
        icon={Flame}
        tone="red"
        hint="Open High/Critical"
      />
    </div>
  );
}
