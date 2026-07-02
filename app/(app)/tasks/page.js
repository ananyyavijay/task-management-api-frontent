import { PageHeader } from "@/components/common/PageHeader";
import { TaskListSection } from "@/features/tasks/TaskListSection";

export const metadata = { title: "Tasks" };

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Track, filter, and assign work across every project."
      />
      <TaskListSection />
    </div>
  );
}
