import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { queryKeys } from './query-keys';
import { DashboardMetrics } from '@/services/dashboard.service';

export function useDashboardMetrics() {
  return useQuery({
    queryKey: queryKeys.dashboard.metrics,
    queryFn: () => apiClient.get<DashboardMetrics>('/dashboard/metrics'),
    refetchInterval: 60000, // Refresh every 60 seconds
  });
}
