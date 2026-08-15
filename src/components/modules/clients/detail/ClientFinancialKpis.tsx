import React from 'react';
import { DollarSign, CheckCircle2, Clock, FolderKanban } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

interface ClientFinancialKpisProps {
  totalBilled: number;
  totalCollected: number;
  totalOutstanding: number;
  activeProjectsCount: number;
}

export function ClientFinancialKpis({
  totalBilled,
  totalCollected,
  totalOutstanding,
  activeProjectsCount,
}: ClientFinancialKpisProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Billed */}
      <div className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Total Billed</span>
          <div className="w-8 h-8 rounded-md bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155] flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-extrabold text-neutral-900 dark:text-white font-mono">{formatCurrency(totalBilled)}</div>
        <p className="text-[10px] text-neutral-500">Cumulative invoice total</p>
      </div>

      {/* Total Collected */}
      <div className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Collected Revenue</span>
          <div className="w-8 h-8 rounded-md bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155] flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-extrabold text-neutral-900 dark:text-white font-mono">{formatCurrency(totalCollected)}</div>
        <p className="text-[10px] text-neutral-500">Settled client payments</p>
      </div>

      {/* Outstanding Balance */}
      <div className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Outstanding Balance</span>
          <div className="w-8 h-8 rounded-md bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155] flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-extrabold text-neutral-900 dark:text-white font-mono">{formatCurrency(totalOutstanding)}</div>
        <p className="text-[10px] text-neutral-500">Pending receivables</p>
      </div>

      {/* Active Projects */}
      <div className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Active Projects</span>
          <div className="w-8 h-8 rounded-md bg-neutral-100 dark:bg-[#334155] text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-[#334155] flex items-center justify-center">
            <FolderKanban className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-extrabold text-neutral-900 dark:text-white font-mono">{activeProjectsCount}</div>
        <p className="text-[10px] text-neutral-500">Currently in execution</p>
      </div>
    </div>
  );
}

export default ClientFinancialKpis;
