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
    onMutate: async ({ id, status }) => {
      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all });

      // Snapshot previous query data across all task queries for rollback if needed
      const previousQueries = queryClient.getQueriesData<TaskType[]>({ queryKey: queryKeys.tasks.all });

      // Optimistically update all task query lists in cache
      queryClient.setQueriesData<TaskType[]>(
        { queryKey: queryKeys.tasks.all },
        (oldTasks) => {
          if (!oldTasks || !Array.isArray(oldTasks)) return oldTasks;
          return oldTasks.map((t) => (t._id === id ? { ...t, status } : t));
        }
      );

      return { previousQueries };
    },
    onError: (_err, _vars, context) => {
      // Rollback on error
      if (context?.previousQueries) {
        context.previousQueries.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      if (projectId) queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
    },
  });
}

export function useReorderTasks(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ items }: { items: Array<{ id: string; order: number; status?: TaskStatus }> }) =>
      apiClient.patch<{ success: boolean; count: number }>('/tasks/reorder', { items }),
    onMutate: async ({ items }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all });

      const previousQueries = queryClient.getQueriesData<TaskType[]>({ queryKey: queryKeys.tasks.all });
      const itemMap = new Map(items.map((i) => [i.id, i]));

      queryClient.setQueriesData<TaskType[]>(
        { queryKey: queryKeys.tasks.all },
        (oldTasks) => {
          if (!oldTasks || !Array.isArray(oldTasks)) return oldTasks;
          const updated = oldTasks.map((t) => {
            const reordered = itemMap.get(t._id);
            if (reordered) {
              return {
                ...t,
                order: reordered.order,
                ...(reordered.status ? { status: reordered.status } : {}),
              };
            }
            return t;
          });
          return updated.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        }
      );

      return { previousQueries };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
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
