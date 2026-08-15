import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { queryKeys } from './query-keys';
import { TaskType, TaskStatus } from '@/types';

export function useTasks(
  projectId?: string | null,
  filters?: { milestoneId?: string; status?: string; priority?: string; search?: string }
) {
  const isAll = !projectId || projectId === 'all';
  return useQuery({
    queryKey: isAll ? [...queryKeys.tasks.lists(), filters || {}] : queryKeys.tasks.byProject(projectId, filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (!isAll && projectId) params.append('projectId', projectId);
      if (filters?.milestoneId) params.append('milestoneId', filters.milestoneId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.priority) params.append('priority', filters.priority);
      if (filters?.search) params.append('search', filters.search);
      const queryStr = params.toString() ? `?${params.toString()}` : '';

      if (isAll) {
        return apiClient.get<TaskType[]>(`/tasks${queryStr}`);
      }
      return apiClient.get<TaskType[]>(`/projects/${projectId}/tasks${queryStr}`);
    },
  });
}

export function useAllTasks(filters?: { projectId?: string; milestoneId?: string; status?: string; priority?: string; search?: string }) {
  return useTasks(filters?.projectId || undefined, filters);
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
    mutationFn: ({ projectId, ...data }: { projectId?: string; [key: string]: unknown }) => {
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
    mutationFn: ({ id, data }: { id: string; projectId?: string; data: Record<string, unknown> }) =>
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
