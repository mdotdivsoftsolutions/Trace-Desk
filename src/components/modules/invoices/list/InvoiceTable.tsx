import React from 'react';
import Link from 'next/link';
import { Eye, DollarSign, Receipt, Plus } from 'lucide-react';
import { Invoice, Client, Project } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { InvoiceTableSkeleton } from '@/components/common/skeletons/InvoiceTableSkeleton';

interface InvoiceTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  onRecordPayment: (invoice: Invoice) => void;
}

const statusBadgeStyles: Record<string, string> = {
  draft: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
  sent: 'bg-neutral-100 dark:bg-[#334155] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-[#334155]',
  partially_paid: 'bg-amber-500/10 text-neutral-700 dark:text-neutral-300 border-amber-500/20',
  paid: 'bg-emerald-500/10 text-neutral-700 dark:text-neutral-300 border-emerald-500/20',
  overdue: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  cancelled: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
};

export function InvoiceTable({ invoices, isLoading, onRecordPayment }: InvoiceTableProps) {
  if (isLoading) {
    return <InvoiceTableSkeleton />;
  }

  if (invoices.length === 0) {
    return (
      <div className="p-12 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] text-center space-y-4">
        <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155] text-neutral-700 dark:text-neutral-300 flex items-center justify-center mx-auto">
          <Receipt className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">No invoices found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">Create a new invoice to record billings and manage payments.</p>
        </div>
        <Link href="/invoices/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
          <Plus className="w-4 h-4" /><span>Create First Invoice</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 dark:bg-[#0F172A] text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-[#334155]">
            <tr>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Invoice #</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Client & Project</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Dates</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Total</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Balance Due</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-[#334155] font-medium">
            {invoices.map((inv) => {
              const client = typeof inv.clientId === 'object' ? (inv.clientId as Client) : null;
              const project = typeof inv.projectId === 'object' ? (inv.projectId as Project) : null;
              return (
                <tr key={inv._id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <Link href={`/invoices/${inv._id}`} className="font-bold text-neutral-900 dark:text-white hover:underline font-mono">
                      {inv.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-neutral-900 dark:text-white">
                      {client?.companyName || client?.company || client?.name || 'Client'}
                    </div>
                    <div className="text-[11px] text-neutral-400 truncate">{project?.title || 'Project'}</div>
                  </td>
                  <td className="px-5 py-4 text-neutral-500">
                    <div>Issued: {formatDate(inv.issueDate)}</div>
                    <div>Due: {formatDate(inv.dueDate)}</div>
                  </td>
                  <td className="px-5 py-4 font-bold font-mono text-neutral-900 dark:text-white">{formatCurrency(inv.totalAmount)}</td>
                  <td className="px-5 py-4 font-bold font-mono text-neutral-700 dark:text-neutral-300">{formatCurrency(inv.balanceDue)}</td>
                  <td className="px-5 py-4">
                    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider', statusBadgeStyles[inv.status] || 'bg-neutral-500/10 text-neutral-400')}>
                      {inv.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {inv.balanceDue > 0 && inv.status !== 'cancelled' && (
                        <button onClick={() => onRecordPayment(inv)} className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800" title="Record Payment">
                          <DollarSign className="w-4 h-4" />
                        </button>
                      )}
                      <Link href={`/invoices/${inv._id}`} className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800" title="View Invoice">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InvoiceTable;
