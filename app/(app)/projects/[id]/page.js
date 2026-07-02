import { ProjectDetails } from "@/features/projects/ProjectDetails";

export const metadata = { title: "Project details" };

export default async function ProjectDetailPage({ params }) {
  const { id } = await params;
  return <ProjectDetails projectId={id} />;
}
