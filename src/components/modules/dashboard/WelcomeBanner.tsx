import React from 'react';
import Link from 'next/link';
import { Receipt, Plus } from 'lucide-react';

export function WelcomeBanner() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm relative overflow-hidden">
      <div className="space-y-1 relative z-10">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-neutral-100 dark:bg-[#334155] text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-[#334155] uppercase tracking-wider">
            Live Operations
          </span>
          <span className="text-xs text-neutral-400">{currentDate}</span>
        </div>
        <h1 className="font-heading text-2xl lg:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Executive Command Center
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Real-time project velocity, milestone progression, and cash flow ledger.
        </p>
      </div>

      <div className="flex items-center gap-2.5 relative z-10">
        <Link
          href="/invoices"
          className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-white dark:bg-[#0F172A] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 transition-all shadow-sm"
        >
          <Receipt className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
          <span>Create Invoice</span>
        </Link>
        <Link
          href="/projects/new"
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 active:scale-95 text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>
    </div>
  );
}

export default WelcomeBanner;
