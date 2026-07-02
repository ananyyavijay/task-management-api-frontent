import { PageHeader } from "@/components/common/PageHeader";
import { ProjectList } from "@/features/projects/ProjectList";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Organize your work into focused projects."
      />
      <ProjectList />
    </div>
  );
}
