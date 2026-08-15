import React from 'react';
import Link from 'next/link';
import { DollarSign, CheckCircle2, Clock, Plus, Receipt } from 'lucide-react';
import { Invoice } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface ProjectFinancialsTabProps {
  invoices: Invoice[];
  projectId: string;
  totalBudget: number;
}

export function ProjectFinancialsTab({
  invoices,
  projectId,
  totalBudget,
}: ProjectFinancialsTabProps) {
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);
  const totalCollected = totalBilled - totalOutstanding;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Total Contract Budget</span>
          <div className="text-xl font-extrabold text-neutral-900 dark:text-white font-mono">{formatCurrency(totalBudget)}</div>
        </div>
        <div className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Collected Payments</span>
          <div className="text-xl font-extrabold text-neutral-900 dark:text-white font-mono">{formatCurrency(totalCollected)}</div>
        </div>
        <div className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Outstanding Due</span>
          <div className="text-xl font-extrabold text-neutral-900 dark:text-white font-mono">{formatCurrency(totalOutstanding)}</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Invoices Raised ({invoices.length})</h3>
          <Link href={`/invoices/new?projectId=${projectId}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-bold shadow-sm transition-all">
            <Plus className="w-3.5 h-3.5" /><span>+ Create Invoice</span>
          </Link>
        </div>

        {invoices.length === 0 ? (
          <div className="p-8 text-center rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] text-neutral-500 text-xs">
            No invoices have been billed for this project yet.
          </div>
        ) : (
          <div className="rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-[#0F172A] text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-[#334155]">
                <tr>
                  <th className="px-5 py-3.5 font-bold uppercase">Invoice #</th>
                  <th className="px-5 py-3.5 font-bold uppercase">Issued</th>
                  <th className="px-5 py-3.5 font-bold uppercase">Total</th>
                  <th className="px-5 py-3.5 font-bold uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-[#334155]">
                {invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40">
                    <td className="px-5 py-3.5 font-bold font-mono text-neutral-900 dark:text-white">{inv.invoiceNumber}</td>
                    <td className="px-5 py-3.5 text-neutral-500">{formatDate(inv.issueDate)}</td>
                    <td className="px-5 py-3.5 font-bold font-mono text-neutral-900 dark:text-white">{formatCurrency(inv.totalAmount)}</td>
                    <td className="px-5 py-3.5 uppercase text-[10px] font-bold text-neutral-500">{inv.status.replace('_', ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectFinancialsTab;
