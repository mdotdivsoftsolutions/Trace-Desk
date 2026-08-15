import React from 'react';
import Link from 'next/link';
import { Receipt, CheckCircle, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { DashboardMetrics } from '@/types';

interface UnbilledMilestonesWidgetProps {
  metrics: DashboardMetrics | undefined;
  isLoading: boolean;
}

export function UnbilledMilestonesWidget({ metrics, isLoading }: UnbilledMilestonesWidgetProps) {
  const unbilled = metrics?.financials.readyToInvoiceMilestones || [];
  const totalUnbilled = metrics?.financials.readyToInvoiceAmount || 0;

  return (
    <div className="p-5 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-[#334155] pb-3">
        <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Receipt className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
          <span>Ready to Invoice</span>
        </h3>
        <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 font-mono">
          {formatCurrency(totalUnbilled)}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <div className="h-10 bg-neutral-100 dark:bg-[#0F172A] rounded-md animate-pulse" />
          <div className="h-10 bg-neutral-100 dark:bg-[#0F172A] rounded-md animate-pulse" />
        </div>
      ) : unbilled.length === 0 ? (
        <div className="py-4 text-center text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
          <CheckCircle className="w-6 h-6 text-neutral-700 dark:text-neutral-300 mx-auto opacity-70" />
          <p>All completed milestones are invoiced.</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {unbilled.map((m: any) => (
            <div key={m._id} className="p-2.5 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155] flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">{m.title}</div>
                <div className="text-[10px] text-neutral-400 truncate">{m.projectId?.title || 'Project'}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-bold text-neutral-900 dark:text-white font-mono">{formatCurrency(m.amount)}</div>
                <Link href={`/invoices/new?projectId=${m.projectId?._id || m.projectId}&milestoneId=${m._id}`} className="text-[10px] text-neutral-700 dark:text-neutral-300 hover:underline font-semibold flex items-center gap-0.5 justify-end">
                  <Plus className="w-2.5 h-2.5" />
                  <span>Bill</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link href="/invoices" className="block w-full py-2 text-center rounded-md bg-neutral-100 dark:bg-[#334155] text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-[#334155] text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
        Manage Invoice Ledger →
      </Link>
    </div>
  );
}

export default UnbilledMilestonesWidget;
