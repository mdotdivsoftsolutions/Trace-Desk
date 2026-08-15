import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Edit, Plus, Trash2, RotateCcw, UserX } from 'lucide-react';
import { Client } from '@/types';
import { cn } from '@/lib/utils';

interface ClientHeaderBannerProps {
  client: Client;
  onEdit: () => void;
  onAddProject: () => void;
  onDeactivate: () => void;
  onReactivate: () => void;
  onDelete: () => void;
}

export function ClientHeaderBanner({
  client,
  onEdit,
  onAddProject,
  onDeactivate,
  onReactivate,
  onDelete,
}: ClientHeaderBannerProps) {
  const isActive = client.status === 'active';

  return (
    <div className="space-y-4">
      <Link
        href="/clients"
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Client Directory</span>
      </Link>

      <div className={cn(
        'p-6 rounded-lg bg-white dark:bg-[#1E293B] border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all',
        isActive ? 'border-neutral-200 dark:border-[#334155]' : 'border-amber-500/30 bg-amber-500/[0.02]'
      )}>
        <div className="flex items-start gap-4">
          <div className={cn(
            'w-14 h-14 rounded-lg flex items-center justify-center font-bold text-lg uppercase flex-shrink-0 shadow-sm border',
            isActive
              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-800 dark:border-neutral-200'
              : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700'
          )}>
            {(client.companyName || client.company || client.name || 'CL').substring(0, 2)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {client.companyName || client.company || client.name}
              </h1>
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
            </div>
            {(client.companyName || client.company) && client.name && (client.companyName || client.company) !== client.name && (
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Contact: {client.name}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 dark:text-neutral-300 pt-1">
              <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-neutral-400" /><span>{client.email}</span></div>
              {client.phone && <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-neutral-400" /><span>{client.phone}</span></div>}
              {client.country && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-neutral-400" /><span>{client.country}</span></div>}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto flex-shrink-0">
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-neutral-100 dark:bg-[#0F172A] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-[#334155] transition-colors cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          {isActive ? (
            <button
              type="button"
              onClick={onDeactivate}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold transition-colors cursor-pointer"
              title="Deactivate client (Soft Delete)"
            >
              <UserX className="w-3.5 h-3.5" />
              <span>Deactivate</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onReactivate}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold transition-colors cursor-pointer"
              title="Reactivate client account"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reactivate</span>
            </button>
          )}

          <button
            type="button"
            onClick={onAddProject}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Project</span>
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-2 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
            title="Permanently Delete Client"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClientHeaderBanner;
