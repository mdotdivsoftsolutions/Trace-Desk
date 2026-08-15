'use client';

import React, { useState } from 'react';
import { useClients, useDeleteClient, useDeactivateClient, useReactivateClient } from '@/hooks/useClients';
import { useDebounce } from '@/hooks/useDebounce';
import { ClientType } from '@/types';
import { DatePreset } from '@/components/common/DateRangeFilter';
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
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientType | null>(null);
  const [deactivatingClient, setDeactivatingClient] = useState<ClientType | null>(null);
  const [reactivatingClient, setReactivatingClient] = useState<ClientType | null>(null);
  const [deletingClient, setDeletingClient] = useState<ClientType | null>(null);

  const { data, isLoading, isFetching } = useClients({
    search: debouncedSearch || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    startDate,
    endDate,
    page,
    limit,
  });

  const deactivateMutation = useDeactivateClient();
  const reactivateMutation = useReactivateClient();
  const deleteClientMutation = useDeleteClient();

  const handleConfirmDeactivate = async () => {
    if (!deactivatingClient) return;
    await deactivateMutation.mutateAsync(deactivatingClient._id);
    setDeactivatingClient(null);
  };

  const handleConfirmReactivate = async () => {
    if (!reactivatingClient) return;
    await reactivateMutation.mutateAsync(reactivatingClient._id);
    setReactivatingClient(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingClient) return;
    await deleteClientMutation.mutateAsync({ id: deletingClient._id, soft: false });
    setDeletingClient(null);
  };

  const isTableLoading = isLoading || isFetching || search !== debouncedSearch;

  const handleDateChange = ({ startDate: start, endDate: end, preset }: { startDate?: string; endDate?: string; preset: DatePreset }) => {
    setStartDate(start);
    setEndDate(end);
    setDatePreset(preset);
    setPage(1);
  };

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
        startDate={startDate}
        endDate={endDate}
        datePreset={datePreset}
        onDateChange={handleDateChange}
      />

      <ClientTable
        clients={data?.items || []}
        isLoading={isTableLoading}
        onEdit={(client) => { setEditingClient(client); setIsDrawerOpen(true); }}
        onDeactivate={(client) => setDeactivatingClient(client)}
        onReactivate={(client) => setReactivatingClient(client)}
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

      {/* Deactivate (Soft-Delete) Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deactivatingClient}
        title="Deactivate Client Account"
        description={`Are you sure you want to deactivate "${deactivatingClient?.name}"? All associated historical projects, invoices, and payment records will remain safely preserved in your workspace.`}
        confirmText="Deactivate Client"
        variant="warning"
        isLoading={deactivateMutation.isPending}
        onConfirm={handleConfirmDeactivate}
        onCancel={() => setDeactivatingClient(null)}
      />

      {/* Reactivate Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!reactivatingClient}
        title="Reactivate Client Account"
        description={`Reactivate "${reactivatingClient?.name}" as an active client account?`}
        confirmText="Reactivate Client"
        variant="info"
        isLoading={reactivateMutation.isPending}
        onConfirm={handleConfirmReactivate}
        onCancel={() => setReactivatingClient(null)}
      />

      {/* Permanent Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingClient}
        title="Permanently Delete Client"
        description={`Are you sure you want to permanently delete "${deletingClient?.name}"? This action cannot be undone.`}
        confirmText="Delete Permanently"
        variant="danger"
        isLoading={deleteClientMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingClient(null)}
      />
    </div>
  );
}
