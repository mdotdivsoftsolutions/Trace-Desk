'use client';

import React from 'react';
import { DollarSign, TrendingUp, Receipt, Clock, FolderKanban, AlertCircle, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { DashboardMetrics } from '@/types';
import { DashboardMetricsSkeleton } from '@/components/common/skeletons/DashboardMetricsSkeleton';

interface KpiGridProps {
  metrics: DashboardMetrics | undefined;
  isLoading: boolean;
}

// Fixed-height card wrapper — prevents any card from collapsing during data load.
function KpiCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    // min-h-[116px] reserves space so the grid row never collapses when data arrives.
    <div className="min-h-[116px] p-5 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">{title}</span>
        {/* Fixed w-8 h-8 so icon box never shifts layout */}
        <div className="w-8 h-8 shrink-0 rounded-md bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155] flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export function KpiGrid({ metrics, isLoading }: KpiGridProps) {
  if (isLoading) {
    return <DashboardMetricsSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard title="Collected Revenue" icon={<DollarSign className="w-4 h-4" />}>
        <div className="h-8 flex items-center">
          <span className="text-2xl font-extrabold text-neutral-900 dark:text-white font-mono nums">{formatCurrency(metrics?.financials.totalRevenue || 0)}</span>
        </div>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1 h-4">
          <TrendingUp className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300 shrink-0" />
          <span>Settled milestone payouts</span>
        </p>
      </KpiCard>

      <KpiCard title="Pending Invoices" icon={<Receipt className="w-4 h-4" />}>
        <div className="h-8 flex items-center">
          <span className="text-2xl font-extrabold text-neutral-900 dark:text-white font-mono nums">{formatCurrency(metrics?.financials.pendingReceivables || 0)}</span>
        </div>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 h-4">
          <span>{metrics?.financials.pendingInvoicesCount || 0} unpaid sent invoices</span>
        </p>
      </KpiCard>

      <KpiCard title="Active Projects" icon={<FolderKanban className="w-4 h-4" />}>
        <div className="h-8 flex items-center gap-2">
          <span className="text-2xl font-extrabold text-neutral-900 dark:text-white font-mono nums">{metrics?.projects.activeCount || 0}</span>
          <span className="text-xs font-normal text-neutral-400 nums">of {metrics?.projects.totalCount || 0} total</span>
        </div>
        <div className="mt-2 flex items-center gap-2 h-4">
          <div className="flex-1 bg-neutral-100 dark:bg-[#0F172A] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-neutral-900 dark:bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics?.projects.averageCompletionRate || 0}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300 font-mono nums shrink-0">
            {metrics?.projects.averageCompletionRate || 0}% avg
          </span>
        </div>
      </KpiCard>

      <KpiCard title="Open Tasks" icon={<Clock className="w-4 h-4" />}>
        <div className="h-8 flex items-center">
          <span className="text-2xl font-extrabold text-neutral-900 dark:text-white font-mono nums">{metrics?.tasks.totalOpenTasks || 0}</span>
        </div>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1 h-4">
          {(metrics?.tasks.overdueTasks?.length || 0) > 0 ? (
            <span className="text-rose-500 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="nums">{metrics?.tasks.overdueTasks.length} overdue</span>
            </span>
          ) : (
            <span className="text-emerald-500 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              All deadlines on track
            </span>
          )}
        </p>
      </KpiCard>
    </div>
  );
}

export default KpiGrid;
