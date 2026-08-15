'use client';

import React, { useState } from 'react';
import { useClients, useDeleteClient } from '@/hooks/useClients';
import { useDebounce } from '@/hooks/useDebounce';
import { ClientType } from '@/types';
import { ClientStatsHeader } from '@/components/modules/clients/list/ClientStatsHeader';
import { ClientSearchFilter } from '@/components/modules/clients/list/ClientSearchFilter';
import { ClientTable } from '@/components/modules/clients/list/ClientTable';
import { Pagination } from '@/components/common/pagination';
import { ClientFormDrawer } from '@/components/modules/clients/ClientFormDrawer';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientType | null>(null);
  const [deletingClient, setDeletingClient] = useState<ClientType | null>(null);

  const { data, isLoading, isFetching } = useClients({
    search: debouncedSearch || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    page,
    limit,
  });

  const deleteClientMutation = useDeleteClient();

  const handleConfirmDelete = async () => {
    if (!deletingClient) return;
    await deleteClientMutation.mutateAsync(deletingClient._id);
    setDeletingClient(null);
  };

  const isTableLoading = isLoading || isFetching || search !== debouncedSearch;

  return (
    <div className="space-y-6">
      <ClientStatsHeader
        totalClients={data?.pagination?.total || 0}
        onAddNew={() => { setEditingClient(null); setIsDrawerOpen(true); }}
      />

      <ClientSearchFilter
        search={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        statusFilter={statusFilter}
        onStatusChange={(val) => { setStatusFilter(val); setPage(1); }}
      />

      <ClientTable
        clients={data?.items || []}
        isLoading={isTableLoading}
        onEdit={(client) => { setEditingClient(client); setIsDrawerOpen(true); }}
        onDelete={(client) => setDeletingClient(client)}
        onAddNew={() => { setEditingClient(null); setIsDrawerOpen(true); }}
      />

      {data?.pagination && data.pagination.totalPages > 1 && (
        <Pagination
          pagination={data.pagination}
          onPageChange={setPage}
        />
      )}

      <ClientFormDrawer
        isOpen={isDrawerOpen}
        onClose={() => { setIsDrawerOpen(false); setEditingClient(null); }}
        client={editingClient}
      />

      <ConfirmDialog
        isOpen={!!deletingClient}
        title="Delete Client Account"
        description={`Are you sure you want to delete "${deletingClient?.name}"? All associated historical data will be removed.`}
        confirmText="Delete Client"
        variant="danger"
        isLoading={deleteClientMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingClient(null)}
      />
    </div>
  );
}
