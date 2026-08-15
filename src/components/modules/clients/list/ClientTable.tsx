import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Eye, Edit, Trash2, Users, Plus, RotateCcw, UserX } from 'lucide-react';
import { Client } from '@/types';
import { cn } from '@/lib/utils';
import { ClientTableSkeleton } from '@/components/common/skeletons/ClientTableSkeleton';

interface ClientTableProps {
  clients: Client[];
  isLoading: boolean;
  onEdit: (client: Client) => void;
  onDeactivate: (client: Client) => void;
  onReactivate: (client: Client) => void;
  onDelete: (client: Client) => void;
  onAddNew: () => void;
}

export function ClientTable({
  clients,
  isLoading,
  onEdit,
  onDeactivate,
  onReactivate,
  onDelete,
  onAddNew,
}: ClientTableProps) {
  if (isLoading) {
    return <ClientTableSkeleton />;
  }

  if (clients.length === 0) {
    return (
      <div className="p-12 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] text-center space-y-4">
        <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155] text-neutral-700 dark:text-neutral-300 flex items-center justify-center mx-auto">
          <Users className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">No clients found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Get started by adding your first agency client to link projects and invoices.
          </p>
        </div>
        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add First Client</span>
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 dark:bg-[#0F172A] text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-[#334155]">
            <tr>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Client & Company</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Contact Details</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Location</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-[#334155] font-medium">
            {clients.map((client) => {
              const isActive = client.status === 'active';
              return (
                <tr
                  key={client._id}
                  className={cn(
                    'transition-colors group',
                    isActive
                      ? 'hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40'
                      : 'bg-neutral-50/40 dark:bg-neutral-900/40 opacity-85 hover:opacity-100 hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40'
                  )}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-9 h-9 rounded-md border flex items-center justify-center font-bold text-xs uppercase flex-shrink-0',
                        isActive
                          ? 'bg-neutral-100 dark:bg-[#334155] text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-[#334155]'
                          : 'bg-neutral-200/60 dark:bg-neutral-800 text-neutral-500 border-neutral-300 dark:border-neutral-700'
                      )}>
                        {(client.companyName || client.company || client.name || 'CL').substring(0, 2)}
                      </div>
                      <div>
                        <Link href={`/clients/${client._id}`} className="font-bold text-neutral-900 dark:text-white hover:underline block">
                          {client.companyName || client.company || client.name}
                        </Link>
                        {(client.companyName || client.company) && client.name && (client.companyName || client.company) !== client.name && (
                          <div className="text-[11px] text-neutral-500">{client.name}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-neutral-600 dark:text-neutral-300">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-neutral-400" /><span>{client.email}</span></div>
                      {client.phone && <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-neutral-400" /><span>{client.phone}</span></div>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-neutral-600 dark:text-neutral-300">
                    <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-neutral-400" /><span>{client.country || 'Global'}</span></div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider',
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                      )}
                    >
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/clients/${client._id}`}
                        className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onEdit(client)}
                        className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Edit Client"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {isActive ? (
                        <button
                          type="button"
                          onClick={() => onDeactivate(client)}
                          className="p-1.5 rounded text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
                          title="Deactivate Client (Soft Delete)"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onReactivate(client)}
                          className="p-1.5 rounded text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                          title="Reactivate Client"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onDelete(client)}
                        className="p-1.5 rounded text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Delete Permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientTable;
