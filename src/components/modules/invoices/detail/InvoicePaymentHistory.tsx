import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Payment } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';

interface InvoicePaymentHistoryProps {
  payments: Payment[];
}

export function InvoicePaymentHistory({ payments }: InvoicePaymentHistoryProps) {
  if (payments.length === 0) return null;

  return (
    <div className="p-6 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-4">
      <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        <span>Payment Settlement Ledger ({payments.length})</span>
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 dark:bg-[#0F172A] text-neutral-500 border-y border-neutral-200 dark:border-[#334155]">
            <tr>
              <th className="px-4 py-2 font-bold uppercase">Date</th>
              <th className="px-4 py-2 font-bold uppercase">Method</th>
              <th className="px-4 py-2 font-bold uppercase">Reference #</th>
              <th className="px-4 py-2 font-bold uppercase text-right">Amount Paid</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-[#334155]">
            {payments.map((p) => (
              <tr key={p._id}>
                <td className="px-4 py-2.5 text-neutral-500">{formatDate(p.paymentDate)}</td>
                <td className="px-4 py-2.5 uppercase font-bold text-[10px] text-neutral-700 dark:text-neutral-300">{p.paymentMethod}</td>
                <td className="px-4 py-2.5 font-mono text-neutral-500">{p.referenceNumber || '—'}</td>
                <td className="px-4 py-2.5 text-right font-mono font-bold text-neutral-900 dark:text-white">{formatCurrency(p.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InvoicePaymentHistory;
