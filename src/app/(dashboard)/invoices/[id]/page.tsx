'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import {
  Receipt,
  Printer,
  CreditCard,
  Building2,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Share2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useInvoice, useUpdateInvoice, useInvoicePayments } from '@/hooks';
import { RecordPaymentDrawer } from '@/components/modules/payments/RecordPaymentDrawer';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: invoiceId } = use(params);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const { data: invoice, isLoading } = useInvoice(invoiceId);
  const { data: payments } = useInvoicePayments(invoiceId);
  const updateInvoiceMutation = useUpdateInvoice();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-20 rounded-3xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        <div className="h-[600px] rounded-3xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-12 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-neutral-700 dark:text-neutral-300 mx-auto" />
        <h2 className="text-lg font-bold">Invoice Not Found</h2>
        <Link href="/invoices" className="text-xs font-semibold text-neutral-900 dark:text-white hover:underline">
          ← Back to Invoices
        </Link>
      </div>
    );
  }

  const client = typeof invoice.clientId === 'object' ? (invoice.clientId as any) : null;
  const project = typeof invoice.projectId === 'object' ? (invoice.projectId as any) : null;

  const handlePrint = () => {
    window.print();
  };

  const handleMarkAsSent = async () => {
    if (invoice.status === 'draft') {
      await updateInvoiceMutation.mutateAsync({
        id: invoice._id,
        data: { status: 'sent' },
      });
    }
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20',
    sent: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    partially_paid: 'bg-amber-500/10 text-neutral-700 dark:text-neutral-300 border-amber-500/20',
    paid: 'bg-emerald-500/10 text-neutral-700 dark:text-neutral-300 border-emerald-500/20',
    overdue: 'bg-rose-500/10 text-neutral-700 dark:text-neutral-300 border-rose-500/20',
    cancelled: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-16">
      {/* Top Action Bar (Hidden on Print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
          <Link href="/invoices" className="hover:text-neutral-900 dark:text-white transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Invoices</span>
          </Link>
          <span>/</span>
          <span className="text-neutral-900 dark:text-white font-semibold font-mono">
            {invoice.invoiceNumber}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {invoice.status === 'draft' && (
            <button
              onClick={handleMarkAsSent}
              className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-200 dark:border-blue-800 transition-colors"
            >
              Mark as Sent
            </button>
          )}

          {invoice.balanceDue > 0 && invoice.status !== 'cancelled' && (
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>Record Payment</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 text-xs font-bold shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Download PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Paper Container */}
      <div className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white p-8 lg:p-12 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xl space-y-8 print:shadow-none print:border-none print:p-0 print:m-0 print:text-black print:bg-white">
        {/* Invoice Header: Brand & Meta */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-neutral-200 dark:border-neutral-800 pb-8 print:border-neutral-300">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 flex items-center justify-center text-white font-black text-sm shadow-md">
                TD
              </div>
              <span className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white print:text-black">
                Trace<span className="text-neutral-900 dark:text-white">Desk</span>
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 print:text-neutral-600">
              Agency & Freelancer Engineering Solutions
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <div className="flex sm:justify-end items-center gap-2">
              <h1 className="text-xl font-mono font-extrabold text-neutral-900 dark:text-white print:text-black">
                {invoice.invoiceNumber}
              </h1>
              <span
                className={cn(
                  'px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider',
                  statusColors[invoice.status] || 'bg-neutral-500/10 text-neutral-400'
                )}
              >
                {invoice.status.replace('_', ' ')}
              </span>
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 print:text-neutral-600">
              Issue Date: <span className="font-semibold text-neutral-800 dark:text-neutral-200 print:text-black">{formatDate(invoice.issueDate)}</span>
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 print:text-neutral-600">
              Due Date: <span className="font-semibold text-neutral-800 dark:text-neutral-200 print:text-black">{formatDate(invoice.dueDate)}</span>
            </div>
          </div>
        </div>

        {/* Client & Project Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
          {/* Billed To */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Billed To:
            </span>
            <div className="font-extrabold text-sm text-neutral-900 dark:text-white print:text-black">
              {client?.name || 'Client Name'}
            </div>
            {client?.companyName && (
              <div className="text-neutral-600 dark:text-neutral-400 font-medium">
                {client.companyName}
              </div>
            )}
            {client?.email && (
              <div className="text-neutral-500">{client.email}</div>
            )}
            {client?.country && (
              <div className="text-neutral-500">{client.country}</div>
            )}
          </div>

          {/* Project Details */}
          {project && (
            <div className="space-y-1.5 sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Project Reference:
              </span>
              <div className="font-extrabold text-sm text-neutral-900 dark:text-white print:text-black">
                {project.title}
              </div>
              <div className="text-neutral-500">
                Currency: <span className="font-semibold text-neutral-800 dark:text-neutral-200 print:text-black">{invoice.currency}</span>
              </div>
            </div>
          )}
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="py-3 px-2">Description</th>
                <th className="py-3 px-2 text-center">Qty / Hrs</th>
                <th className="py-3 px-2 text-right">Rate</th>
                <th className="py-3 px-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {invoice.items.map((item: any, idx: number) => (
                <tr key={idx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20">
                  <td className="py-3 px-2 font-medium text-neutral-900 dark:text-white print:text-black">
                    {item.description}
                  </td>
                  <td className="py-3 px-2 text-center text-neutral-600 dark:text-neutral-400 print:text-black">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-2 text-right text-neutral-600 dark:text-neutral-400 print:text-black">
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-neutral-900 dark:text-white print:text-black">
                    {formatCurrency(item.amount, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Math Summary Breakdown */}
        <div className="flex flex-col sm:flex-row justify-between gap-8 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          {/* Payment Terms & Remittance */}
          <div className="max-w-md space-y-2 text-xs text-neutral-500 dark:text-neutral-400">
            {invoice.paymentTerms && (
              <div>
                <span className="font-bold text-neutral-800 dark:text-neutral-200 print:text-black">Payment Terms: </span>
                <span>{invoice.paymentTerms}</span>
              </div>
            )}
            {invoice.notes && (
              <div>
                <span className="font-bold text-neutral-800 dark:text-neutral-200 print:text-black">Remittance Notes: </span>
                <span>{invoice.notes}</span>
              </div>
            )}
          </div>

          {/* Totals Box */}
          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between py-1 text-neutral-600 dark:text-neutral-400">
              <span>Subtotal:</span>
              <span className="font-semibold text-neutral-900 dark:text-white print:text-black">
                {formatCurrency(invoice.subtotal, invoice.currency)}
              </span>
            </div>

            {invoice.taxRate !== undefined && invoice.taxRate > 0 && (
              <div className="flex justify-between py-1 text-neutral-600 dark:text-neutral-400">
                <span>Tax ({invoice.taxRate}%):</span>
                <span className="font-semibold text-neutral-900 dark:text-white print:text-black">
                  +{formatCurrency(invoice.taxAmount || 0, invoice.currency)}
                </span>
              </div>
            )}

            {invoice.discountAmount !== undefined && invoice.discountAmount > 0 && (
              <div className="flex justify-between py-1 text-neutral-600 dark:text-neutral-400">
                <span>Discount:</span>
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  -{formatCurrency(invoice.discountAmount, invoice.currency)}
                </span>
              </div>
            )}

            <div className="flex justify-between py-2 border-t border-b border-neutral-200 dark:border-neutral-800 font-extrabold text-sm text-neutral-900 dark:text-white print:text-black">
              <span>Total Billed:</span>
              <span>{formatCurrency(invoice.totalAmount, invoice.currency)}</span>
            </div>

            <div className="flex justify-between py-1 text-neutral-700 dark:text-neutral-300 dark:text-emerald-400 font-semibold">
              <span>Amount Paid:</span>
              <span>{formatCurrency(invoice.paidAmount || invoice.amountPaid || 0, invoice.currency)}</span>
            </div>

            <div className="flex justify-between py-1.5 text-sm font-extrabold text-neutral-700 dark:text-neutral-300 dark:text-amber-400">
              <span>Balance Due:</span>
              <span>{formatCurrency(invoice.balanceDue, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {/* Payment History Audit Trail */}
        {payments && payments.length > 0 && (
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider print:text-black flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              <span>Settlement Audit History</span>
            </h3>

            <div className="space-y-2">
              {payments.map((p) => (
                <div
                  key={p._id}
                  className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between text-xs print:border-neutral-300"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-neutral-900 dark:text-white print:text-black">
                      {formatDate(p.paymentDate)} &mdash; <span className="capitalize font-mono">{p.paymentMethod.replace('_', ' ')}</span>
                    </div>
                    {p.transactionReference && (
                      <div className="text-[10px] text-neutral-500">Ref: {p.transactionReference}</div>
                    )}
                  </div>
                  <div className="font-extrabold text-neutral-700 dark:text-neutral-300 dark:text-emerald-400">
                    +{formatCurrency(p.amount, invoice.currency)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Record Payment Drawer */}
      <RecordPaymentDrawer
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        invoice={invoice}
      />
    </div>
  );
}
