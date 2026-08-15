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
  Filter,
  Layers,
} from 'lucide-react';
import { useClients } from '@/hooks';
import { ClientFormModal } from '@/components/modules/clients/client-form-modal';
import { ClientDrawer } from '@/components/modules/clients/client-drawer';
import { formatCurrency, cn } from '@/lib/utils';
import { ClientType } from '@/types';

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currencyFilter, setCurrencyFilter] = useState<string>('all');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientType | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const { data: clients, isLoading } = useClients({
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: search || undefined,
  });

  const filteredClients = clients?.filter((c) => {
    if (currencyFilter !== 'all' && c.currency !== currencyFilter) return false;
    return true;
  }) || [];

  const handleOpenEdit = (client: ClientType) => {
    setEditingClient(client);
    setIsFormModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingClient(null);
    setIsFormModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-7 h-7 text-indigo-500" />
            <span>Client Management</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Directory of agency clients, company contacts, and aggregate billing portfolios.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, company, email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 overflow-x-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Currency Filter */}
          <select
            value={currencyFilter}
            onChange={(e) => setCurrencyFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Currencies</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="INR">INR (₹)</option>
            <option value="AED">AED (د.إ)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
      </div>

      {/* Client Table / Grid */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 rounded-2xl bg-neutral-200/60 dark:bg-neutral-800/40 animate-pulse border border-neutral-200 dark:border-neutral-800"
            />
          ))}
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="p-12 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 text-center space-y-3 bg-white/50 dark:bg-neutral-900/50">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 mx-auto flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
            No clients found
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            {search || statusFilter !== 'all' || currencyFilter !== 'all'
              ? 'No clients matched your current filter criteria.'
              : 'Add your first client to link projects, assign tasks, and generate invoices.'}
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Client</span>
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/75 dark:bg-neutral-800/40 text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-bold text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Client & Company</th>
                  <th className="px-5 py-3.5">Contact Info</th>
                  <th className="px-5 py-3.5">Country & Currency</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60">
                {filteredClients.map((client) => (
                  <tr
                    key={client._id}
                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors group cursor-pointer"
                    onClick={() => setSelectedClientId(client._id)}
                  >
                    {/* Client & Company */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm">
                        {client.name}
                      </div>
                      {client.companyName ? (
                        <div className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-indigo-500" />
                          <span>{client.companyName}</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-neutral-400">Independent Client</div>
                      )}
                    </td>

                    {/* Contact Info */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <a
                          href={`mailto:${client.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                        >
                          <Mail className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{client.email}</span>
                        </a>
                        {client.phone && (
                          <a
                            href={`tel:${client.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-neutral-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                          >
                            <Phone className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{client.phone}</span>
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Country & Currency */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                          <Globe className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{client.country || 'Global'}</span>
                        </div>
                        <span className="font-semibold text-[11px] text-indigo-600 dark:text-indigo-400">
                          {client.currency}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider',
                          client.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
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
                          className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          title="View Portfolio"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(client)}
                          className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          title="Edit Profile"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Client Modal */}
      <ClientFormModal
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
