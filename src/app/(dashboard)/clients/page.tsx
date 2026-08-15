'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Building2,
  Globe,
  DollarSign,
  Eye,
  Edit2,
  Trash2,
  Filter,
  Layers,
} from 'lucide-react';
import { useClients, useDeleteClient, useConfirmDialog } from '@/hooks';
import { ClientFormDrawer } from '@/components/modules/clients/ClientFormDrawer';
import { ClientDrawer } from '@/components/modules/clients/client-drawer';
import { Pagination } from '@/components/common/pagination';
import { formatCurrency, cn } from '@/lib/utils';
import { ClientType } from '@/types';

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currencyFilter, setCurrencyFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientType | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const { confirm } = useConfirmDialog();
  const deleteClientMutation = useDeleteClient();

  const { data: clientsData, isLoading } = useClients({
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: search || undefined,
    page,
    limit: 10,
  });

  const clientsList = clientsData?.items || [];

  const filteredClients = clientsList.filter((c) => {
    if (currencyFilter !== 'all' && c.currency !== currencyFilter) return false;
    return true;
  });

  const handleOpenEdit = (client: ClientType) => {
    setEditingClient(client);
    setIsFormModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingClient(null);
    setIsFormModalOpen(true);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-neutral-800 dark:text-neutral-200" />
            <span>Client Management</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Maintain accounts, track linked projects, and manage client financial ledgers.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 active:scale-95 font-bold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-lg bg-white dark:bg-[#1C2029] border border-neutral-200 dark:border-[#2D333F] shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search clients by name, company, email, or country..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 rounded-md bg-neutral-50 dark:bg-[#111318] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Status Filter */}
          <div className="relative flex-1 md:flex-initial">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-36 px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#111318] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            >
              <option value="all">All Statuses</option>
              <option value="lead">Lead</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Currency Filter */}
          <div className="relative flex-1 md:flex-initial">
            <select
              value={currencyFilter}
              onChange={(e) => {
                setCurrencyFilter(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-36 px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#111318] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            >
              <option value="all">All Currencies</option>
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="AED">AED (AED)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      {isLoading ? (
        <div className="p-8 rounded-lg bg-white dark:bg-[#1C2029] border border-neutral-200 dark:border-[#2D333F] text-center space-y-3">
          <div className="inline-block w-8 h-8 border-2 border-neutral-900 dark:border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-neutral-500">Loading client registry...</p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="p-12 rounded-lg bg-white dark:bg-[#1C2029] border border-neutral-200 dark:border-[#2D333F] text-center space-y-4">
          <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-[#111318] border border-neutral-200 dark:border-[#2D333F] text-neutral-700 dark:text-neutral-300 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white">
              No clients found
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              {search || statusFilter !== 'all' || currencyFilter !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Get started by creating your first client account to track projects and billings.'}
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 active:scale-95 text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Client</span>
          </button>
        </div>
      ) : (
        <div className="rounded-lg bg-white dark:bg-[#1C2029] border border-neutral-200 dark:border-[#2D333F] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-[#111318] text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-[#2D333F]">
                <tr>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Client & Company</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Contact Info</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Location / Currency</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-[#2D333F] font-medium">
                {filteredClients.map((client) => (
                  <tr
                    key={client._id}
                    onClick={() => setSelectedClientId(client._id)}
                    className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer group"
                  >
                    {/* Name & Company */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-md bg-neutral-100 dark:bg-[#252B37] text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-[#2D333F] flex items-center justify-center font-bold text-xs uppercase border border-neutral-200 dark:border-[#2D333F] flex-shrink-0 group-hover:scale-105 transition-transform">
                          {client.name.charAt(0)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-neutral-900 dark:text-white truncate">
                            {client.name}
                          </span>
                          {client.companyName ? (
                            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1 truncate">
                              <Building2 className="w-3 h-3 flex-shrink-0" />
                              {client.companyName}
                            </span>
                          ) : (
                            <span className="text-[11px] text-neutral-400 italic">Individual</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email & Phone */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col space-y-1">
                        <span className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 truncate">
                          <Mail className="w-3.5 h-3.5 text-neutral-400" />
                          {client.email}
                        </span>
                        {client.phone && (
                          <span className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-[11px]">
                            <Phone className="w-3.5 h-3.5 text-neutral-400" />
                            {client.phone}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Country & Currency */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300/60 dark:border-neutral-700">
                          {client.currency || 'INR'}
                        </span>
                        {client.country && (
                          <span className="text-neutral-500 dark:text-neutral-400 text-xs">
                            {client.country}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 text-[10px] font-bold rounded-md border uppercase tracking-wider',
                          client.status === 'active'
                            ? 'bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155] border-emerald-500/20'
                            : 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                        )}
                      >
                        {client.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedClientId(client._id)}
                          className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          title="View Portfolio"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(client)}
                          className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          title="Edit Profile"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            const confirmed = await confirm({
                              title: `Delete Client "${client.name}"?`,
                              description:
                                'Are you sure you want to delete this client account? All linked project references and invoices will remain but will show as unassigned.',
                              variant: 'danger',
                              confirmText: 'Delete Client',
                            });
                            if (confirmed) {
                              await deleteClientMutation.mutateAsync(client._id);
                            }
                          }}
                          className="p-1.5 rounded-md text-neutral-700 dark:text-neutral-300 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete Client"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Backend Pagination Bar */}
          <Pagination
            pagination={clientsData?.pagination}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      {/* Create / Edit Client Drawer */}
      <ClientFormDrawer
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        client={editingClient}
      />

      {/* Slide-over Profile Drawer */}
      <ClientDrawer
        clientId={selectedClientId}
        onClose={() => setSelectedClientId(null)}
        onEdit={(client) => {
          setSelectedClientId(null);
          handleOpenEdit(client);
        }}
      />
    </div>
  );
}
