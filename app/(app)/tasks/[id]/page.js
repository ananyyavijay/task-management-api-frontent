import { TaskDetails } from "@/features/tasks/TaskDetails";

export const metadata = { title: "Task details" };

export default async function TaskDetailPage({ params }) {
  const { id } = await params;
  return <TaskDetails taskId={id} />;
}
