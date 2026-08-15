import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { queryKeys } from './query-keys';
import { UpdateSettingsInput } from '@/lib/validations';
import { SettingsType } from '@/types';

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings.current(),
    queryFn: async () => apiClient.get<SettingsType>('/settings'),
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSettingsInput) => apiClient.put<SettingsType>('/settings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
    },
  });
}
