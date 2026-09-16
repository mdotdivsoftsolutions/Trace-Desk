import React, { useState } from 'react';
import Link from 'next/link';
import { Receipt, Eye, Plus, Download, Loader2, Pencil, Trash2 } from 'lucide-react';
import { Invoice, Project } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { useSettings } from '@/hooks/useSettings';
import { useDeleteInvoice } from '@/hooks/useInvoices';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { downloadInvoicePDF } from '@/lib/pdf-exporter';

interface ClientInvoicesTabProps {
  invoices: Invoice[];
  clientId: string;
  projects?: Project[];
}

const statusBadgeStyles: Record<string, string> = {
  draft: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
  sent: 'bg-neutral-100 dark:bg-[#334155] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-[#334155]',
  partially_paid: 'bg-amber-500/10 text-neutral-700 dark:text-neutral-300 border-amber-500/20',
  paid: 'bg-emerald-500/10 text-neutral-700 dark:text-neutral-300 border-emerald-500/20',
  overdue: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
};

export function ClientInvoicesTab({ invoices, clientId, projects = [] }: ClientInvoicesTabProps) {
  const { data: settings } = useSettings();
  const { confirm } = useConfirmDialog();
  const deleteInvoiceMutation = useDeleteInvoice();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (inv: Invoice) => {
    const confirmed = await confirm({
      title: `Delete Invoice ${inv.invoiceNumber}`,
      description: `Are you sure you want to delete invoice "${inv.invoiceNumber}"? This will permanently remove this invoice and its line items. This action cannot be undone.`,
      confirmText: 'Delete Invoice',
      variant: 'danger',
    });

    if (!confirmed) return;

    try {
      setDeletingId(inv._id);
      await deleteInvoiceMutation.mutateAsync(inv._id);
    } catch (err) {
      console.error('Failed to delete invoice:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (inv: Invoice) => {
    if (downloadingId === inv._id) return;
    try {
      setDownloadingId(inv._id);
      await downloadInvoicePDF({ invoice: inv, settings });
    } catch (err) {
      console.error('Failed to download invoice PDF:', err);
    } finally {
      setDownloadingId(null);
    }
  };

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
    <div className="space-y-3">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Invoices Raised ({invoices.length})
          </h3>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
            All invoices and billing settlements for this client
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {projects.length === 1 ? (
            <Link
              href={`/invoices/new?clientId=${clientId}&projectId=${projects[0]._id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-[#0F172A] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-[#334155] text-xs font-semibold transition-colors"
              title={`Invoice for ${projects[0].title}`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Bill {projects[0].title}</span>
            </Link>
          ) : null}

          <Link
            href={`/invoices/new?clientId=${clientId}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Invoice</span>
          </Link>
        </div>
      </div>

      <div className="rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm overflow-hidden">
      <table className="w-full text-left text-xs">
        <thead className="bg-neutral-50 dark:bg-[#0F172A] text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-[#334155]">
          <tr>
            <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Invoice #</th>
            <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Issued Date</th>
            <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Total</th>
            <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Balance Due</th>
            <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Status</th>
            <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-[#334155]">
          {invoices.map((inv) => {
            const currency = inv.currency || settings?.defaultCurrency || 'INR';
            const isItemDownloading = downloadingId === inv._id;

            return (
              <tr key={inv._id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors">
                <td className="px-5 py-3.5 font-bold font-mono text-neutral-900 dark:text-white">{inv.invoiceNumber}</td>
                <td className="px-5 py-3.5 text-neutral-500">{formatDate(inv.issueDate)}</td>
                <td className="px-5 py-3.5 font-bold font-mono text-neutral-900 dark:text-white">{formatCurrency(inv.totalAmount, currency)}</td>
                <td className="px-5 py-3.5 font-bold font-mono text-neutral-700 dark:text-neutral-300">{formatCurrency(inv.balanceDue, currency)}</td>
                <td className="px-5 py-3.5">
                  <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider', statusBadgeStyles[inv.status] || 'bg-neutral-500/10 text-neutral-400')}>
                    {inv.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleDownload(inv)}
                      disabled={isItemDownloading}
                      className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
                      title="Download Invoice PDF"
                    >
                      {isItemDownloading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>
                    <Link
                      href={`/invoices/${inv._id}/edit`}
                      className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="Edit Invoice"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <Link href={`/invoices/${inv._id}`} className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" title="View Invoice">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(inv)}
                      disabled={deletingId === inv._id}
                      className="p-1.5 rounded text-neutral-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete Invoice"
                    >
                      {deletingId === inv._id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
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

export default ClientInvoicesTab;
