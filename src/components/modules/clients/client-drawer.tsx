'use client';

import React from 'react';
import Link from 'next/link';
import {
  X,
  Building2,
  Mail,
  Phone,
  Globe,
  DollarSign,
  FolderKanban,
  Receipt,
  Edit2,
  Trash2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useClient, useDeleteClient } from '@/hooks';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { ClientType } from '@/types';

interface ClientDrawerProps {
  clientId: string | null;
  onClose: () => void;
  onEdit: (client: ClientType) => void;
}

export function ClientDrawer({ clientId, onClose, onEdit }: ClientDrawerProps) {
  const { data: client, isLoading } = useClient(clientId);
  const deleteClientMutation = useDeleteClient();

  if (!clientId) return null;

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this client? Linked projects will remain.')) {
      await deleteClientMutation.mutateAsync(clientId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className="w-screen max-w-xl bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-start justify-between gap-4 bg-neutral-50/50 dark:bg-neutral-900/50">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white truncate">
                  {client?.name || 'Loading Client...'}
                </h2>
                {client?.status && (
                  <span
                    className={cn(
                      'px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider',
                      client.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20'
                    )}
                  >
                    {client.status}
                  </span>
                )}
              </div>
              {client?.companyName && (
                <p className="text-xs font-semibold text-neutral-500 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{client.companyName}</span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {client && (
                <button
                  onClick={() => onEdit(client)}
                  className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Edit Client"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-24 bg-neutral-100 dark:bg-neutral-800 rounded-2xl animate-pulse" />
                <div className="h-36 bg-neutral-100 dark:bg-neutral-800 rounded-2xl animate-pulse" />
              </div>
            ) : (
              <>
                {/* Financial Summary Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-neutral-500/5 border border-indigo-500/20">
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    Financial Ledger
                  </span>
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div>
                      <div className="text-[10px] text-neutral-500">Total Billed</div>
                      <div className="text-sm font-extrabold text-neutral-900 dark:text-white mt-0.5">
                        {formatCurrency(client?.financialSummary?.totalBilled || 0, client?.currency)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-500">Total Paid</div>
                      <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {formatCurrency(client?.financialSummary?.totalPaid || 0, client?.currency)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-500">Outstanding</div>
                      <div className="text-sm font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
                        {formatCurrency(client?.financialSummary?.outstanding || 0, client?.currency)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800/60 space-y-3">
                  <h3 className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    Contact Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <Mail className="w-3.5 h-3.5 text-neutral-400" />
                      <a href={`mailto:${client?.email}`} className="hover:text-indigo-500 truncate">
                        {client?.email}
                      </a>
                    </div>
                    {client?.phone && (
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <Phone className="w-3.5 h-3.5 text-neutral-400" />
                        <a href={`tel:${client.phone}`} className="hover:text-indigo-500 truncate">
                          {client.phone}
                        </a>
                      </div>
                    )}
                    {client?.country && (
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <Globe className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{client.country}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <DollarSign className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Currency: {client?.currency}</span>
                    </div>
                  </div>
                  {client?.notes && (
                    <div className="mt-2 pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60 text-xs text-neutral-600 dark:text-neutral-400">
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300">Notes: </span>
                      {client.notes}
                    </div>
                  )}
                </div>

                {/* Linked Projects */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <FolderKanban className="w-4 h-4 text-indigo-500" />
                      <span>Linked Projects ({client?.projects?.length || 0})</span>
                    </h3>
                  </div>

                  {(!client?.projects || client.projects.length === 0) ? (
                    <div className="p-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 text-center text-xs text-neutral-500">
                      No projects associated with this client yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {client.projects.map((project: any) => (
                        <Link
                          key={project._id}
                          href={`/projects/${project._id}`}
                          onClick={onClose}
                          className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 transition-all flex items-center justify-between group"
                        >
                          <div className="min-w-0 space-y-1">
                            <div className="font-semibold text-xs text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                              {project.title}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                              <span className="capitalize">{project.status.replace('_', ' ')}</span>
                              <span>•</span>
                              <span>{project.progressPercentage || 0}% complete</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-indigo-500 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Linked Invoices */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-emerald-500" />
                    <span>Invoices ({client?.invoices?.length || 0})</span>
                  </h3>

                  {(!client?.invoices || client.invoices.length === 0) ? (
                    <div className="p-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 text-center text-xs text-neutral-500">
                      No invoices recorded for this client.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {client.invoices.map((inv: any) => (
                        <div
                          key={inv._id}
                          className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-semibold text-neutral-900 dark:text-white">
                              {inv.invoiceNumber}
                            </div>
                            <div className="text-[10px] text-neutral-500">
                              Due: {formatDate(inv.dueDate)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-neutral-900 dark:text-white">
                              {formatCurrency(inv.totalAmount, inv.currency)}
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
                              {inv.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50">
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Client</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
