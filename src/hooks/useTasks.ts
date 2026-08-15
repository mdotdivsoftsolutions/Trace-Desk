import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { queryKeys } from './query-keys';
import { TaskType, TaskStatus } from '@/types';

export function useTasks(
  projectId: string | undefined | null,
  filters?: { milestoneId?: string; status?: string; priority?: string }
) {
  return useQuery({
    queryKey: projectId ? queryKeys.tasks.byProject(projectId, filters) : queryKeys.tasks.lists(),
    queryFn: async () => {
      if (!projectId) return [];
      const params = new URLSearchParams();
      if (filters?.milestoneId) params.append('milestoneId', filters.milestoneId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.priority) params.append('priority', filters.priority);
      const queryStr = params.toString() ? `?${params.toString()}` : '';
      return apiClient.get<TaskType[]>(`/projects/${projectId}/tasks${queryStr}`);
    },
    enabled: !!projectId,
  });
}

export function useTask(id: string | undefined | null) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id || ''),
    queryFn: async () => {
      if (!id) return null;
      return apiClient.get<TaskType>(`/tasks/${id}`);
    },
    enabled: !!id,
  });
}

export function useCreateTask(defaultProjectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, ...data }: { projectId?: string; [key: string]: any }) => {
      const pid = projectId || defaultProjectId;
      return apiClient.post<TaskType>(`/projects/${pid}/tasks`, data);
    },
    onSuccess: (_data, variables) => {
      const pid = variables.projectId || defaultProjectId;
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      if (pid) queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(pid) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
    },
  });
}

export function useUpdateTask(defaultProjectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, projectId, data }: { id: string; projectId?: string; data: any }) =>
      apiClient.patch<TaskType>(`/tasks/${id}`, data),
    onSuccess: (_data, variables) => {
      const pid = variables.projectId || defaultProjectId;
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(variables.id) });
      if (pid) queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(pid) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
    },
  });
}

export function useUpdateTaskStatus(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus; projectId?: string }) =>
      apiClient.patch<TaskType>(`/tasks/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      if (projectId) queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
    },
  });
}

export function useDeleteTask(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete<{ id: string }>(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      if (projectId) queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
    },
  });
}
