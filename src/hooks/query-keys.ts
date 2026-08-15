export const queryKeys = {
  clients: {
    all: ['clients'] as const,
    lists: () => [...queryKeys.clients.all, 'list'] as const,
    list: (filters?: { status?: string; search?: string }) =>
      [...queryKeys.clients.lists(), filters || {}] as const,
    details: () => [...queryKeys.clients.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.clients.details(), id] as const,
  },
  projects: {
    all: ['projects'] as const,
    lists: () => [...queryKeys.projects.all, 'list'] as const,
    list: (filters?: { clientId?: string; status?: string; search?: string }) =>
      [...queryKeys.projects.lists(), filters || {}] as const,
    details: () => [...queryKeys.projects.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
  },
  tasks: {
    all: ['tasks'] as const,
    lists: () => [...queryKeys.tasks.all, 'list'] as const,
    byProject: (projectId: string, filters?: { milestoneId?: string; status?: string }) =>
      [...queryKeys.tasks.lists(), { projectId, ...(filters || {}) }] as const,
    details: () => [...queryKeys.tasks.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.tasks.details(), id] as const,
  },
  milestones: {
    all: ['milestones'] as const,
    byProject: (projectId: string) => [...queryKeys.milestones.all, 'project', projectId] as const,
    detail: (id: string) => [...queryKeys.milestones.all, 'detail', id] as const,
  },
  invoices: {
    all: ['invoices'] as const,
    lists: () => [...queryKeys.invoices.all, 'list'] as const,
    list: (filters?: { clientId?: string; projectId?: string; status?: string }) =>
      [...queryKeys.invoices.lists(), filters || {}] as const,
    details: () => [...queryKeys.invoices.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.invoices.details(), id] as const,
    payments: (invoiceId: string) => [...queryKeys.invoices.detail(invoiceId), 'payments'] as const,
  },
  dashboard: {
    metrics: ['dashboard', 'metrics'] as const,
  },
};
