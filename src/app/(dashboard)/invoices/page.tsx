'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Receipt,
  Search,
  Plus,
  Building2,
  Calendar,
  DollarSign,
  CreditCard,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';
import { useInvoices } from '@/hooks';
import { RecordPaymentDrawer } from '@/components/modules/payments/RecordPaymentDrawer';
import { Pagination } from '@/components/common/pagination';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { InvoiceType } from '@/types';

export default function InvoicesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [selectedPaymentInvoice, setSelectedPaymentInvoice] = useState<InvoiceType | null>(null);

  const { data: invoicesData, isLoading } = useInvoices({
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: search || undefined,
    page,
    limit: 10,
  });

  const invoices = invoicesData?.items || [];

  // Summary KPI math
  const totalBilled = invoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
  const totalPaid = invoices.reduce((acc, inv) => acc + (inv.paidAmount || inv.amountPaid || 0), 0);
  const pendingReceivables = invoices.reduce((acc, inv) => acc + (inv.balanceDue || 0), 0);
  const overdueCount = invoices.filter((inv) => inv.status === 'overdue').length;

  const statusColors: Record<string, string> = {
    draft: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
    sent: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    partially_paid: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    paid: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    overdue: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    cancelled: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-neutral-800 dark:text-neutral-200" />
            <span>Invoices & Billing Hub</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Accounts receivable, milestone invoice generator, and payment ledger.
          </p>
        </div>

        <Link
          href="/invoices/new"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 active:scale-95 font-bold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Invoice</span>
        </Link>
      </div>

      {/* KPI Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Billed */}
        <div className="p-4 rounded-lg bg-white dark:bg-[#1C2029] border border-neutral-200 dark:border-[#2D333F] shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-md bg-neutral-100 dark:bg-[#111318] text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-[#2D333F] flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
              Total Invoiced
            </span>
            <span className="text-lg font-bold text-neutral-900 dark:text-white font-mono">
              {formatCurrency(totalBilled, 'INR')}
            </span>
          </div>
        </div>

        {/* Collected Revenue */}
        <div className="p-4 rounded-lg bg-white dark:bg-[#1C2029] border border-neutral-200 dark:border-[#2D333F] shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
              Collected
            </span>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {formatCurrency(totalPaid, 'INR')}
            </span>
          </div>
        </div>

        {/* Pending Receivables */}
        <div className="p-4 rounded-lg bg-white dark:bg-[#1C2029] border border-neutral-200 dark:border-[#2D333F] shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
              Outstanding
            </span>
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono">
              {formatCurrency(pendingReceivables, 'INR')}
            </span>
          </div>
        </div>

        {/* Overdue Count */}
        <div className="p-4 rounded-lg bg-white dark:bg-[#1C2029] border border-neutral-200 dark:border-[#2D333F] shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
              Overdue
            </span>
            <span className="text-lg font-bold text-rose-600 dark:text-rose-400 font-mono">
              {overdueCount} {overdueCount === 1 ? 'Invoice' : 'Invoices'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-lg bg-white dark:bg-[#1C2029] border border-neutral-200 dark:border-[#2D333F] shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by invoice number (e.g. MDIV-2026-0001)..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 rounded-md bg-neutral-50 dark:bg-[#111318] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#111318] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent (Unpaid)</option>
            <option value="paid">Fully Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      {isLoading ? (
        <div className="p-8 rounded-lg bg-white dark:bg-[#1C2029] border border-neutral-200 dark:border-[#2D333F] text-center space-y-3">
          <div className="inline-block w-8 h-8 border-2 border-neutral-900 dark:border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-neutral-500">Loading invoice ledger...</p>
        </div>
      ) : invoices.length === 0 ? (
        <div className="p-12 rounded-lg bg-white dark:bg-[#1C2029] border border-neutral-200 dark:border-[#2D333F] text-center space-y-4">
          <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-[#111318] border border-neutral-200 dark:border-[#2D333F] text-neutral-700 dark:text-neutral-300 flex items-center justify-center mx-auto">
            <Receipt className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white">
              No invoices found
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              {search || statusFilter !== 'all'
                ? 'Try adjusting your search criteria or status filter.'
                : 'Create and issue milestone invoices to start collecting payments.'}
            </p>
          </div>
          <Link
            href="/invoices/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 active:scale-95 text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Invoice</span>
          </Link>
        </div>
      ) : (
        <div className="rounded-lg bg-white dark:bg-[#1C2029] border border-neutral-200 dark:border-[#2D333F] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-[#111318] text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-[#2D333F]">
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
              <tbody className="divide-y divide-neutral-200 dark:divide-[#2D333F] font-medium">
                {invoices.map((inv) => {
                  const client = inv.clientId as any;
                  const project = inv.projectId as any;

                  return (
                    <tr
                      key={inv._id}
                      className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      {/* Number */}
                      <td className="px-5 py-4">
                        <Link
                          href={`/invoices/${inv._id}`}
                          className="font-bold text-neutral-900 dark:text-white hover:underline font-mono"
                        >
                          {inv.invoiceNumber}
                        </Link>
                      </td>

                      {/* Client / Project */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-neutral-900 dark:text-white truncate">
                            {client?.name || 'Unassigned Client'}
                          </span>
                          {project?.title && (
                            <span className="text-[11px] text-neutral-500 truncate">
                              {project.title}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col space-y-0.5 text-[11px]">
                          <span className="text-neutral-500">
                            Issued: {formatDate(inv.issueDate)}
                          </span>
                          <span className="text-neutral-700 dark:text-neutral-300 font-semibold">
                            Due: {formatDate(inv.dueDate)}
                          </span>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-4 font-mono font-bold text-neutral-900 dark:text-white">
                        {formatCurrency(inv.totalAmount, inv.currency)}
                      </td>

                      {/* Balance Due */}
                      <td className="px-5 py-4 font-mono">
                        <span
                          className={cn(
                            'font-bold',
                            inv.balanceDue > 0
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          )}
                        >
                          {formatCurrency(inv.balanceDue, inv.currency)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            'px-2.5 py-0.5 text-[10px] font-bold rounded-md border uppercase tracking-wider',
                            statusColors[inv.status] || 'bg-neutral-500/10 text-neutral-400'
                          )}
                        >
                          {inv.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {inv.balanceDue > 0 && inv.status !== 'cancelled' && (
                            <button
                              onClick={() => setSelectedPaymentInvoice(inv)}
                              className="p-1.5 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                              title="Record Payment"
                            >
                              <CreditCard className="w-4 h-4" />
                            </button>
                          )}
                          <Link
                            href={`/invoices/${inv._id}`}
                            className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            title="View / Print Invoice"
                          >
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

          {/* Backend Pagination Bar */}
          <Pagination
            pagination={invoicesData?.pagination}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      {/* Record Payment Drawer */}
      <RecordPaymentDrawer
        isOpen={!!selectedPaymentInvoice}
        onClose={() => setSelectedPaymentInvoice(null)}
        invoice={selectedPaymentInvoice}
      />
    </div>
  );
}
