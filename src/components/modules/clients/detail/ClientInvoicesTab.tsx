import React from 'react';
import Link from 'next/link';
import { Receipt, Eye, Plus } from 'lucide-react';
import { Invoice } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface ClientInvoicesTabProps {
  invoices: Invoice[];
  clientId: string;
}

const statusBadgeStyles: Record<string, string> = {
  draft: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
  sent: 'bg-neutral-100 dark:bg-[#334155] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-[#334155]',
  partially_paid: 'bg-amber-500/10 text-neutral-700 dark:text-neutral-300 border-amber-500/20',
  paid: 'bg-emerald-500/10 text-neutral-700 dark:text-neutral-300 border-emerald-500/20',
  overdue: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
};

export function ClientInvoicesTab({ invoices, clientId }: ClientInvoicesTabProps) {
  if (invoices.length === 0) {
    return (
      <div className="p-12 text-center rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] space-y-3">
        <Receipt className="w-8 h-8 text-neutral-400 mx-auto" />
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">No invoices raised</h3>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto">No invoices have been billed for this client yet.</p>
        <Link href={`/invoices/new?clientId=${clientId}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
          <Plus className="w-3.5 h-3.5" /><span>Create New Invoice</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm overflow-hidden">
      <table className="w-full text-left text-xs">
        <thead className="bg-neutral-50 dark:bg-[#0F172A] text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-[#334155]">
          <tr>
            <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Invoice #</th>
            <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Issued Date</th>
            <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Total</th>
            <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Balance Due</th>
            <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Status</th>
            <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-right">View</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-[#334155]">
          {invoices.map((inv) => (
            <tr key={inv._id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors">
              <td className="px-5 py-3.5 font-bold font-mono text-neutral-900 dark:text-white">{inv.invoiceNumber}</td>
              <td className="px-5 py-3.5 text-neutral-500">{formatDate(inv.issueDate)}</td>
              <td className="px-5 py-3.5 font-bold font-mono text-neutral-900 dark:text-white">{formatCurrency(inv.totalAmount)}</td>
              <td className="px-5 py-3.5 font-bold font-mono text-neutral-700 dark:text-neutral-300">{formatCurrency(inv.balanceDue)}</td>
              <td className="px-5 py-3.5">
                <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider', statusBadgeStyles[inv.status] || 'bg-neutral-500/10 text-neutral-400')}>
                  {inv.status.replace('_', ' ')}
                </span>
              </td>
              <td className="px-5 py-3.5 text-right">
                <Link href={`/invoices/${inv._id}`} className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 inline-block">
                  <Eye className="w-4 h-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClientInvoicesTab;
