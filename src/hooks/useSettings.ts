import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { SettingsType } from '@/types';

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => apiClient.get<SettingsType>('/settings'),
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SettingsType>) => apiClient.put<SettingsType>('/settings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}
