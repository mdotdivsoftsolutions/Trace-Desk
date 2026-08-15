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
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';
import { useInvoices } from '@/hooks';
import { RecordPaymentModal } from '@/components/modules/invoices/record-payment-modal';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { InvoiceType } from '@/types';

export default function InvoicesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPaymentInvoice, setSelectedPaymentInvoice] = useState<InvoiceType | null>(null);

  const { data: invoices, isLoading } = useInvoices({
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const filteredInvoices = invoices?.filter((inv) => {
    if (!search) return true;
    const clientName = typeof inv.clientId === 'object' ? (inv.clientId as any)?.name : '';
    return (
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      clientName.toLowerCase().includes(search.toLowerCase())
    );
  }) || [];

  // Summary KPI math
  const totalBilled = invoices?.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0) || 0;
  const totalPaid = invoices?.reduce((acc, inv) => acc + (inv.paidAmount || inv.amountPaid || 0), 0) || 0;
  const pendingReceivables = invoices?.reduce((acc, inv) => acc + (inv.balanceDue || 0), 0) || 0;
  const overdueCount = invoices?.filter((inv) => inv.status === 'overdue').length || 0;

  const statusColors: Record<string, string> = {
    draft: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
    sent: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    partially_paid: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    paid: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    overdue: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    cancelled: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white flex items-center gap-2.5">
            <Receipt className="w-7 h-7 text-indigo-500" />
            <span>Invoices & Billing Hub</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Accounts receivable, milestone invoice generator, and payment ledger.
          </p>
        </div>

        <Link
          href="/invoices/new"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Invoice</span>
        </Link>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">Total Invoiced</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-neutral-900 dark:text-white">
            {formatCurrency(totalBilled, 'USD')}
          </div>
          <div className="text-[11px] text-neutral-400">All-time lifetime billing</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">Collected Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalPaid, 'USD')}
          </div>
          <div className="text-[11px] text-neutral-400">Settled and cleared funds</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">Pending Receivables</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
            {formatCurrency(pendingReceivables, 'USD')}
          </div>
          <div className="text-[11px] text-neutral-400">Awaiting client payment</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">Overdue Alerts</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400">
            {overdueCount} {overdueCount === 1 ? 'Invoice' : 'Invoices'}
          </div>
          <div className="text-[11px] text-neutral-400">Past target settlement date</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice number or client..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 rounded-2xl bg-neutral-200/60 dark:bg-neutral-800/40 animate-pulse border border-neutral-200 dark:border-neutral-800"
            />
          ))}
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="p-12 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 text-center space-y-3 bg-white/50 dark:bg-neutral-900/50">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 mx-auto flex items-center justify-center">
            <Receipt className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
            No invoices found
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            {search || statusFilter !== 'all'
              ? 'No invoices match your search or status filter.'
              : 'Create an invoice or convert completed project milestones into bills.'}
          </p>
          <Link
            href="/invoices/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/75 dark:bg-neutral-800/40 text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-bold text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Invoice #</th>
                  <th className="px-5 py-3.5">Client & Project</th>
                  <th className="px-5 py-3.5">Due Date</th>
                  <th className="px-5 py-3.5">Total Billed</th>
                  <th className="px-5 py-3.5">Balance Due</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60">
                {filteredInvoices.map((inv) => {
                  const clientName =
                    typeof inv.clientId === 'object' ? (inv.clientId as any)?.name : 'Client';
                  const projectTitle =
                    typeof inv.projectId === 'object' ? (inv.projectId as any)?.title : null;

                  return (
                    <tr
                      key={inv._id}
                      className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors group"
                    >
                      {/* Invoice Number */}
                      <td className="px-5 py-4">
                        <Link
                          href={`/invoices/${inv._id}`}
                          className="font-mono font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-xs"
                        >
                          {inv.invoiceNumber}
                        </Link>
                        <div className="text-[10px] text-neutral-400 mt-0.5">
                          Issued: {formatDate(inv.issueDate)}
                        </div>
                      </td>

                      {/* Client & Project */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {clientName}
                        </div>
                        {projectTitle && (
                          <div className="text-[10px] text-neutral-400 truncate max-w-xs">
                            Project: {projectTitle}
                          </div>
                        )}
                      </td>

                      {/* Due Date */}
                      <td className="px-5 py-4">
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">
                          {formatDate(inv.dueDate)}
                        </span>
                      </td>

                      {/* Total Billed */}
                      <td className="px-5 py-4">
                        <span className="font-extrabold text-neutral-900 dark:text-white">
                          {formatCurrency(inv.totalAmount, inv.currency)}
                        </span>
                      </td>

                      {/* Balance Due */}
                      <td className="px-5 py-4">
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
                            'px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider',
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
                              className="p-2 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                              title="Record Payment"
                            >
                              <CreditCard className="w-4 h-4" />
                            </button>
                          )}
                          <Link
                            href={`/invoices/${inv._id}`}
                            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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
        </div>
      )}

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={!!selectedPaymentInvoice}
        onClose={() => setSelectedPaymentInvoice(null)}
        invoice={selectedPaymentInvoice}
      />
    </div>
  );
}
