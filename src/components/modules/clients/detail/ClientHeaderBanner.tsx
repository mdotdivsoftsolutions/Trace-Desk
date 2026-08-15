import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Edit, Plus, Trash2 } from 'lucide-react';
import { Client } from '@/types';
import { cn } from '@/lib/utils';

interface ClientHeaderBannerProps {
  client: Client;
  onEdit: () => void;
  onAddProject: () => void;
  onDelete: () => void;
}

export function ClientHeaderBanner({
  client,
  onEdit,
  onAddProject,
  onDelete,
}: ClientHeaderBannerProps) {
  return (
    <div className="space-y-4">
      <Link
        href="/clients"
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Client Directory</span>
      </Link>

      <div className="p-6 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-lg uppercase flex-shrink-0 shadow-sm">
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
                  client.status === 'active'
                    ? 'bg-emerald-500/10 text-neutral-700 dark:text-neutral-300 border-emerald-500/20'
                    : 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                )}
              >
                {client.status}
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

        <div className="flex items-center gap-2 self-start md:self-auto flex-shrink-0">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-neutral-100 dark:bg-[#0F172A] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-[#334155] transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={onAddProject}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Project</span>
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-colors"
            title="Delete Client"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClientHeaderBanner;
