"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createProject,
  deleteProject,
  fetchAllProjects,
  getProject,
  listProjects,
  updateProject,
} from "@/services/projectService";

const projectKeys = {
  all: ["projects"],
  lists: () => [...projectKeys.all, "list"],
  list: (params) => [...projectKeys.lists(), params],
  details: () => [...projectKeys.all, "detail"],
  detail: (id) => [...projectKeys.details(), id],
};

/** GET /projects/ — paginated list for the Projects page. */
export function useProjectsQuery(params, options = {}) {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: () => listProjects(params),
    placeholderData: (previousData) => previousData,
    ...options,
  });
}

/** All projects the user belongs to — used for dashboard stats and select inputs. */
export function useAllProjectsQuery(options = {}) {
  return useQuery({
    queryKey: [...projectKeys.lists(), "all"],
    queryFn: () => fetchAllProjects(),
    ...options,
  });
}

/** GET /projects/{id} */
export function useProjectQuery(id) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => getProject(id),
    enabled: Boolean(id),
  });
}

/** POST /projects/ */
export function useCreateProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      toast.success("Project created", {
        description: `"${project.name}" is ready to go.`,
      });
    },
    onError: (error) => {
      toast.error("Couldn't create project", { description: error.detail });
    },
  });
}

/** PUT /projects/{id} */
export function useUpdateProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateProject(id, payload),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.setQueryData(projectKeys.detail(project.id), project);
      toast.success("Project updated");
    },
    onError: (error) => {
      toast.error("Couldn't update project", { description: error.detail });
    },
  });
}

/** DELETE /projects/{id} */
export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Project deleted");
    },
    onError: (error) => {
      toast.error("Couldn't delete project", { description: error.detail });
    },
  });
}

export { projectKeys };
