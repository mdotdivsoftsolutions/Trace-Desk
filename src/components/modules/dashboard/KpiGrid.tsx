import React from 'react';
import { DollarSign, TrendingUp, Receipt, Clock, FolderKanban, AlertCircle, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { DashboardMetrics } from '@/types';

interface KpiGridProps {
  metrics: DashboardMetrics | undefined;
  isLoading: boolean;
}

export function KpiGrid({ metrics, isLoading }: KpiGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Revenue */}
      <div className="p-5 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Collected Revenue</span>
          <div className="w-8 h-8 rounded-md bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155] flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-1">
          <div className="text-2xl font-extrabold text-neutral-900 dark:text-white font-mono">
            {isLoading ? <div className="h-8 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" /> : formatCurrency(metrics?.financials.totalRevenue || 0)}
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
            <span>Settled milestone payouts</span>
          </p>
        </div>
      </div>

      {/* Pending Receivables */}
      <div className="p-5 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Pending Invoices</span>
          <div className="w-8 h-8 rounded-md bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155] flex items-center justify-center">
            <Receipt className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-1">
          <div className="text-2xl font-extrabold text-neutral-900 dark:text-white font-mono">
            {isLoading ? <div className="h-8 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" /> : formatCurrency(metrics?.financials.pendingReceivables || 0)}
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
            {metrics?.financials.pendingInvoicesCount || 0} unpaid sent invoices
          </p>
        </div>
      </div>

      {/* Active Projects */}
      <div className="p-5 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Active Projects</span>
          <div className="w-8 h-8 rounded-md bg-neutral-100 dark:bg-[#334155] text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-[#334155] flex items-center justify-center">
            <FolderKanban className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-1">
          <div className="text-2xl font-extrabold text-neutral-900 dark:text-white flex items-baseline gap-2 font-mono">
            {isLoading ? <div className="h-8 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" /> : (
              <>
                <span>{metrics?.projects.activeCount || 0}</span>
                <span className="text-xs font-normal text-neutral-400">of {metrics?.projects.totalCount || 0} total</span>
              </>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 bg-neutral-100 dark:bg-[#0F172A] h-1.5 rounded-full overflow-hidden">
              <div className="bg-neutral-900 dark:bg-white h-full rounded-full transition-all duration-500" style={{ width: `${metrics?.projects.averageCompletionRate || 0}%` }} />
            </div>
            <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300 font-mono">
              {metrics?.projects.averageCompletionRate || 0}% avg
            </span>
          </div>
        </div>
      </div>

      {/* Open Tasks */}
      <div className="p-5 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Open Tasks</span>
          <div className="w-8 h-8 rounded-md bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155] flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-1">
          <div className="text-2xl font-extrabold text-neutral-900 dark:text-white font-mono">
            {isLoading ? <div className="h-8 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" /> : (metrics?.tasks.totalOpenTasks || 0)}
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1">
            {(metrics?.tasks.overdueTasks?.length || 0) > 0 ? (
              <span className="text-rose-500 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {metrics?.tasks.overdueTasks.length} overdue tasks
              </span>
            ) : (
              <span className="text-emerald-500 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                All deadlines on track
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default KpiGrid;
