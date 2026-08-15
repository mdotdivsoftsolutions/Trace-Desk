import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Printer, DollarSign, Send } from 'lucide-react';
import { Invoice } from '@/types';
import { cn } from '@/lib/utils';

interface InvoiceHeaderActionsProps {
  invoice: Invoice;
  onRecordPayment: () => void;
}

const statusBadgeStyles: Record<string, string> = {
  draft: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
  sent: 'bg-neutral-100 dark:bg-[#334155] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-[#334155]',
  partially_paid: 'bg-amber-500/10 text-neutral-700 dark:text-neutral-300 border-amber-500/20',
  paid: 'bg-emerald-500/10 text-neutral-700 dark:text-neutral-300 border-emerald-500/20',
  overdue: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
};

export function InvoiceHeaderActions({ invoice, onRecordPayment }: InvoiceHeaderActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <Link href="/invoices" className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
          <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Invoice Ledger</span>
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-2xl font-bold font-mono text-neutral-900 dark:text-white">
            {invoice.invoiceNumber}
          </h1>
          <span className={cn('px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider', statusBadgeStyles[invoice.status] || 'bg-neutral-500/10 text-neutral-400')}>
            {invoice.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-neutral-100 dark:bg-[#0F172A] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-[#334155]"
        >
          <Printer className="w-3.5 h-3.5" /><span>Print PDF</span>
        </button>
        {invoice.balanceDue > 0 && invoice.status !== 'cancelled' && (
          <button
            onClick={onRecordPayment}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold shadow-sm transition-all"
          >
            <DollarSign className="w-3.5 h-3.5" /><span>Record Payment</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default InvoiceHeaderActions;
