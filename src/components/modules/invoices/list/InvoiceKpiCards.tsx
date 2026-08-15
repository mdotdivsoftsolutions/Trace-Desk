import React from 'react';
import { FileSpreadsheet, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

interface InvoiceKpiCardsProps {
  totalBilled: number;
  totalCollected: number;
  pendingReceivables: number;
  overdueCount: number;
}

export function InvoiceKpiCards({
  totalBilled,
  totalCollected,
  pendingReceivables,
  overdueCount,
}: InvoiceKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-md bg-neutral-100 dark:bg-[#0F172A] text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-[#334155] flex items-center justify-center font-bold">
          <FileSpreadsheet className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-neutral-400">Total Billed</span>
          <div className="text-lg font-bold text-neutral-900 dark:text-white font-mono">{formatCurrency(totalBilled)}</div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-md bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155] flex items-center justify-center font-bold">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-neutral-400">Collected Revenue</span>
          <div className="text-lg font-bold text-neutral-900 dark:text-white font-mono">{formatCurrency(totalCollected)}</div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-md bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155] flex items-center justify-center font-bold">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-neutral-400">Pending Receivables</span>
          <div className="text-lg font-bold text-neutral-700 dark:text-neutral-300 font-mono">{formatCurrency(pendingReceivables)}</div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-md bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155] flex items-center justify-center font-bold">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-neutral-400">Overdue Invoices</span>
          <div className="text-lg font-bold text-neutral-700 dark:text-neutral-300 font-mono">{overdueCount}</div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceKpiCards;
