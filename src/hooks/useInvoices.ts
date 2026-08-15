import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { queryKeys } from './query-keys';
import { CreateInvoiceInput, UpdateInvoiceInput, CreatePaymentInput } from '@/lib/validations';
import { InvoiceType, PaymentType, PaginatedResponse } from '@/types';

export function useInvoices(filters?: {
  clientId?: string;
  projectId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: queryKeys.invoices.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.clientId) params.append('clientId', filters.clientId);
      if (filters?.projectId) params.append('projectId', filters.projectId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      const queryStr = params.toString() ? `?${params.toString()}` : '';
      return apiClient.get<PaginatedResponse<InvoiceType>>(`/invoices${queryStr}`);
    },
  });
}

export function useInvoice(id: string | undefined | null) {
  return useQuery({
    queryKey: queryKeys.invoices.detail(id || ''),
    queryFn: async () => {
      if (!id) return null;
      return apiClient.get<InvoiceType>(`/invoices/${id}`);
    },
    enabled: !!id,
  });
}

export function useInvoicePayments(invoiceId: string | undefined | null) {
  return useQuery({
    queryKey: queryKeys.invoices.payments(invoiceId || ''),
    queryFn: async () => {
      if (!invoiceId) return [];
      return apiClient.get<PaymentType[]>(`/invoices/${invoiceId}/payments`);
    },
    enabled: !!invoiceId,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvoiceInput) => apiClient.post<InvoiceType>('/invoices', data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      if (variables.clientId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.clients.detail(variables.clientId) });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
      queryClient.invalidateQueries({ queryKey: queryKeys.milestones.all });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInvoiceInput }) =>
      apiClient.put<InvoiceType>(`/invoices/${id}`, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete<{ id: string }>(`/invoices/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
    },
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentInput) =>
      apiClient.post<{ payment: PaymentType; invoice: InvoiceType }>(
        `/invoices/${data.invoiceId}/payments`,
        data
      ),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.detail(variables.invoiceId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.payments(variables.invoiceId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
    },
  });
}
