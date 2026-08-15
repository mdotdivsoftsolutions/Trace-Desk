import React from 'react';
import { Plus } from 'lucide-react';

interface ClientStatsHeaderProps {
  totalClients: number;
  onAddNew: () => void;
}

export function ClientStatsHeader({ totalClients, onAddNew }: ClientStatsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Client Directory
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Manage agency client accounts, contact profiles, linked projects, and billing ledgers.
        </p>
      </div>

      <button
        onClick={onAddNew}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 active:scale-95 text-xs font-bold shadow-sm transition-all self-start sm:self-auto"
      >
        <Plus className="w-4 h-4" />
        <span>Add New Client</span>
      </button>
    </div>
  );
}

export default ClientStatsHeader;
