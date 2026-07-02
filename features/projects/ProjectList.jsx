"use client";

import { useState } from "react";
import { FolderKanban, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { CardGridSkeleton } from "@/components/common/SkeletonLoaders";
import { PaginationControl } from "@/components/common/PaginationControl";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ProjectCard } from "@/features/projects/ProjectCard";
import { ProjectFormDialog } from "@/features/projects/ProjectFormDialog";
import { useProjectsQuery, useDeleteProjectMutation } from "@/hooks/useProjects";
import { usePagination } from "@/hooks/usePagination";

export function ProjectList() {
  const { page, skip, limit, nextPage, previousPage } = usePagination();
  const { data: projects, isLoading, isFetching } = useProjectsQuery({ skip, limit });

  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);

  const deleteMutation = useDeleteProjectMutation();

  const openCreate = () => {
    setEditingProject(null);
    setFormOpen(true);
  };

  const openEdit = (project) => {
    setEditingProject(project);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingProject) return;
    await deleteMutation.mutateAsync(deletingProject.id);
    setDeletingProject(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus />
          New Project
        </Button>
      </div>

      {isLoading ? (
        <CardGridSkeleton count={6} />
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={openEdit}
              onDelete={setDeletingProject}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderKanban}
          title={page > 1 ? "No more projects" : "No projects yet"}
          description={
            page > 1
              ? "You've reached the end of the list."
              : "Create your first project to start organizing tasks."
          }
          action={
            page === 1 && (
              <Button size="sm" onClick={openCreate}>
                <Plus />
                New Project
              </Button>
            )
          }
        />
      )}

      <PaginationControl
        page={page}
        pageSize={limit}
        itemCount={projects?.length ?? 0}
        isLoading={isFetching}
        onPrevious={previousPage}
        onNext={nextPage}
      />

      <ProjectFormDialog open={formOpen} onOpenChange={setFormOpen} project={editingProject} />

      <ConfirmDialog
        open={Boolean(deletingProject)}
        onOpenChange={(open) => !open && setDeletingProject(null)}
        title="Delete this project?"
        description={
          deletingProject
            ? `"${deletingProject.name}" will be permanently deleted. This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete project"
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
