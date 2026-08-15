import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { queryKeys } from './query-keys';
import { CreateTaskInput, UpdateTaskInput } from '@/lib/validations';
import { TaskType } from '@/types';

export function useTasks(
  projectId: string | undefined | null,
  filters?: { milestoneId?: string; status?: string; priority?: string }
) {
  return useQuery({
    queryKey: projectId
      ? queryKeys.tasks.byProject(projectId, filters)
      : queryKeys.tasks.lists(),
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

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskInput) =>
      apiClient.post<TaskType>(`/projects/${projectId}/tasks`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
    },
  });
}

export function useUpdateTask(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      apiClient.patch<TaskType>(`/tasks/${id}`, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(variables.id) });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
    },
  });
}

/**
 * Optimistic Task Status Transition Hook for Kanban drag-and-drop.
 * Immediately updates the UI cache and rolls back if the network request fails.
 */
export function useUpdateTaskStatus(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: 'todo' | 'in_progress' | 'review' | 'done';
    }) => apiClient.patch<TaskType>(`/tasks/${id}`, { status }),

    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all });

      // Snapshot previous cache state
      const targetQueryKey = projectId
        ? queryKeys.tasks.byProject(projectId)
        : queryKeys.tasks.lists();

      const previousTasks = queryClient.getQueryData<TaskType[]>(targetQueryKey);

      // Optimistically update task status in any active task list cache
      queryClient.setQueriesData<TaskType[]>({ queryKey: queryKeys.tasks.all }, (old) => {
        if (!old) return [];
        return old.map((t) => (t._id === id ? { ...t, status } : t));
      });

      return { previousTasks, targetQueryKey };
    },

    onError: (_err, _variables, context) => {
      // Rollback to previous state if mutation fails
      if (context?.previousTasks && context.targetQueryKey) {
        queryClient.setQueryData(context.targetQueryKey, context.previousTasks);
      }
    },

    onSettled: () => {
      // Invalidate queries to guarantee server sync and progress recalculation
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
      }
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
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
    },
  });
}
