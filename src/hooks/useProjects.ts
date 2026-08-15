import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { queryKeys } from './query-keys';
import { CreateProjectInput, UpdateProjectInput } from '@/lib/validations';
import { ProjectType, PaginatedResponse } from '@/types';

export function useProjects(filters?: {
  clientId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: queryKeys.projects.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.clientId) params.append('clientId', filters.clientId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      const queryStr = params.toString() ? `?${params.toString()}` : '';
      return apiClient.get<PaginatedResponse<ProjectType>>(`/projects${queryStr}`);
    },
  });
}

export function useProject(id: string | undefined | null) {
  return useQuery({
    queryKey: queryKeys.projects.detail(id || ''),
    queryFn: async () => {
      if (!id) return null;
      return apiClient.get<ProjectType & { milestones: any[]; tasks: any[]; invoices: any[]; stats: any }>(
        `/projects/${id}`
      );
    },
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectInput) => apiClient.post<ProjectType>('/projects', data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      if (variables.clientId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.clients.detail(variables.clientId) });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectInput }) =>
      apiClient.put<ProjectType>(`/projects/${id}`, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete<{ id: string }>(`/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.milestones.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
    },
  });
}
