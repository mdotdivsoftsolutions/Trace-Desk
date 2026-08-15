'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  Building2,
  Mail,
  Phone,
  Globe,
  DollarSign,
  FolderKanban,
  Receipt,
  ChevronRight,
  ArrowLeft,
  Edit2,
  Trash2,
  Plus,
  Calendar,
  CreditCard,
  FileText,
  Clock,
  ExternalLink,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  useClient,
  useDeleteClient,
  useInvoices,
  useConfirmDialog,
} from '@/hooks';
import { ClientFormDrawer } from '@/components/modules/clients/ClientFormDrawer';
import { RecordPaymentDrawer } from '@/components/modules/payments/RecordPaymentDrawer';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { InvoiceType } from '@/types';

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: clientId } = use(params);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'projects' | 'invoices' | 'notes'>('projects');
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedPaymentInvoice, setSelectedPaymentInvoice] = useState<InvoiceType | null>(null);

  const { data: client, isLoading: isClientLoading } = useClient(clientId);
  const { data: invoicesData, isLoading: isInvoicesLoading } = useInvoices({
    clientId,
    limit: 50,
  });
  const invoices = invoicesData?.items || [];

  const deleteClientMutation = useDeleteClient();
  const { confirm } = useConfirmDialog();

  if (isClientLoading) {
    return (
      <div className="w-full space-y-6 animate-pulse">
        <div className="h-40 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          ))}
        </div>
        <div className="h-80 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-12 text-center space-y-4 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D]">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="font-heading text-lg font-bold text-neutral-900 dark:text-white">
          Client Account Not Found
        </h2>
        <Link
          href="/clients"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Clients Directory
        </Link>
      </div>
    );
  }

  const handleDeleteClient = async () => {
    const confirmed = await confirm({
      title: `Delete Client "${client.name}"?`,
      description:
        'Are you sure you want to delete this client account? All linked project references and invoices will remain in the financial ledger but will show as unassigned.',
      variant: 'danger',
      confirmText: 'Delete Client',
    });

    if (confirmed) {
      await deleteClientMutation.mutateAsync(client._id);
      router.push('/clients');
    }
  };

  const invoiceStatusStyles: Record<string, string> = {
    paid: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    partially_paid: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    sent: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    overdue: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-bold',
    draft: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
    cancelled: 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20 line-through',
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
        <Link
          href="/clients"
          className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Clients Directory</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-neutral-900 dark:text-white font-semibold">{client.name}</span>
      </div>

      {/* Top Header & Profile Banner */}
      <div className="p-6 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-2xl lg:text-3xl font-extrabold text-neutral-900 dark:text-white">
                {client.name}
              </h1>
              <span
                className={cn(
                  'px-2.5 py-0.5 text-xs font-bold rounded-md uppercase tracking-wider border',
                  client.status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                )}
              >
                {client.status}
              </span>
            </div>

            {client.companyName && (
              <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-indigo-500" />
                <span>{client.companyName}</span>
              </p>
            )}

            {/* Contact Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 pt-1">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-500" />
                <a
                  href={`mailto:${client.email}`}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
                >
                  {client.email}
                </a>
              </span>

              {client.phone && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{client.phone}</span>
                  </span>
                </>
              )}

              {client.country && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{client.country}</span>
                  </span>
                </>
              )}

              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-[#0B0F19] text-neutral-700 dark:text-neutral-300 font-mono font-bold text-[11px] border border-neutral-200 dark:border-[#232B3D]">
                Currency: {client.currency}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsEditDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#131A2A] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-xs transition-colors shadow-sm"
            >
              <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Edit Profile</span>
            </button>

            <Link
              href={`/projects/new?clientId=${client._id}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </Link>

            <button
              onClick={handleDeleteClient}
              className="p-2 rounded-md border border-rose-200 dark:border-rose-900/50 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Delete Client"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Financial & Scope KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Invoiced */}
        <div className="p-5 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Total Billed
            </span>
            <div className="w-8 h-8 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 dark:text-white font-mono">
            {formatCurrency(client.financialSummary?.totalBilled || 0, client.currency)}
          </div>
          <p className="text-[11px] text-neutral-400">Total invoice ledger value</p>
        </div>

        {/* Total Collected */}
        <div className="p-5 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">
              Collected Payments
            </span>
            <div className="w-8 h-8 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            {formatCurrency(client.financialSummary?.totalPaid || 0, client.currency)}
          </div>
          <p className="text-[11px] text-neutral-400">Settled milestones & hourly</p>
        </div>

        {/* Outstanding Receivables */}
        <div className="p-5 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
              Outstanding Balance
            </span>
            <div className="w-8 h-8 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
            {formatCurrency(client.financialSummary?.outstanding || 0, client.currency)}
          </div>
          <p className="text-[11px] text-neutral-400">Pending receivables</p>
        </div>

        {/* Active Workspaces */}
        <div className="p-5 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Active Projects
            </span>
            <div className="w-8 h-8 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 dark:text-white font-mono">
            {(client.projects || []).length}
          </div>
          <p className="text-[11px] text-neutral-400">Linked delivery workspaces</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-[#232B3D] pb-1">
        <button
          onClick={() => setActiveTab('projects')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-md font-bold text-xs transition-all',
            activeTab === 'projects'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          )}
        >
          <FolderKanban className="w-4 h-4" />
          <span>Projects ({(client.projects || []).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-md font-bold text-xs transition-all',
            activeTab === 'invoices'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          )}
        >
          <Receipt className="w-4 h-4" />
          <span>Invoices & Ledger ({invoices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-md font-bold text-xs transition-all',
            activeTab === 'notes'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          )}
        >
          <FileText className="w-4 h-4" />
          <span>Account Notes & Profile</span>
        </button>
      </div>

      {/* TAB 1: Projects List */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white">
                Client Workspaces & Delivery Roadmaps
              </h3>
              <p className="text-xs text-neutral-500">
                All projects, milestones, and task boards commissioned by {client.name}.
              </p>
            </div>
            <Link
              href={`/projects/new?clientId=${client._id}`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Project</span>
            </Link>
          </div>

          {(!client.projects || client.projects.length === 0) ? (
            <div className="p-12 rounded-lg border border-dashed border-neutral-300 dark:border-[#232B3D] text-center space-y-3 bg-white/50 dark:bg-[#131A2A]/50">
              <FolderKanban className="w-8 h-8 text-indigo-500 mx-auto" />
              <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                No active projects for this client
              </h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Commission a new workspace with milestones, multi-domain links, and Kanban boards.
              </p>
              <Link
                href={`/projects/new?clientId=${client._id}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Workspace</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {client.projects.map((proj: any) => (
                <div
                  key={proj._id}
                  className="p-5 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-sm hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h4 className="font-heading font-bold text-sm text-neutral-900 dark:text-white">
                          {proj.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <span className="capitalize">{proj.budgetType || 'fixed'} Scope</span>
                          <span>•</span>
                          <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                            {proj.totalBudget ? formatCurrency(proj.totalBudget, proj.currency || client.currency) : 'Flexible Budget'}
                          </span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        {proj.status?.replace('_', ' ') || 'discovery'}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-400 font-medium">Delivery Progress</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                          {proj.progressPercentage || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 dark:bg-[#0B0F19] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${proj.progressPercentage || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer Open Workspace Button */}
                  <div className="pt-3 border-t border-neutral-100 dark:border-[#232B3D] flex items-center justify-between">
                    {proj.targetDeadline ? (
                      <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-500" />
                        <span>Due {formatDate(proj.targetDeadline)}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-neutral-400">Ongoing milestone delivery</span>
                    )}

                    <Link
                      href={`/projects/${proj._id}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-xs font-semibold transition-colors"
                    >
                      <span>Open Workspace</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Invoices & Billing History */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white">
                Invoices & Financial Ledger
              </h3>
              <p className="text-xs text-neutral-500">
                Track payment settlements, milestone billing, and PDF invoices.
              </p>
            </div>
            <Link
              href={`/invoices/new?clientId=${client._id}`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Invoice</span>
            </Link>
          </div>

          {invoices.length === 0 ? (
            <div className="p-12 rounded-lg border border-dashed border-neutral-300 dark:border-[#232B3D] text-center space-y-3 bg-white/50 dark:bg-[#131A2A]/50">
              <Receipt className="w-8 h-8 text-indigo-500 mx-auto" />
              <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                No invoices recorded for this client
              </h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Create an invoice for completed milestones or billable hours.
              </p>
              <Link
                href={`/invoices/new?clientId=${client._id}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Invoice</span>
              </Link>
            </div>
          ) : (
            <div className="rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 dark:bg-[#0B0F19] border-b border-neutral-200 dark:border-[#232B3D] text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-5 py-3">Invoice #</th>
                      <th className="px-5 py-3">Issue Date</th>
                      <th className="px-5 py-3">Due Date</th>
                      <th className="px-5 py-3">Total Amount</th>
                      <th className="px-5 py-3">Balance Due</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-[#232B3D]/70 font-medium">
                    {invoices.map((inv) => (
                      <tr
                        key={inv._id}
                        className="hover:bg-neutral-50/60 dark:hover:bg-[#0B0F19]/40 transition-colors"
                      >
                        <td className="px-5 py-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          <Link href={`/invoices/${inv._id}`} className="hover:underline">
                            {inv.invoiceNumber}
                          </Link>
                        </td>
                        <td className="px-5 py-3.5 text-neutral-500">
                          {formatDate(inv.issueDate)}
                        </td>
                        <td className="px-5 py-3.5 text-neutral-500">
                          {formatDate(inv.dueDate)}
                        </td>
                        <td className="px-5 py-3.5 font-bold font-mono text-neutral-900 dark:text-white">
                          {formatCurrency(inv.totalAmount, inv.currency)}
                        </td>
                        <td className="px-5 py-3.5 font-bold font-mono text-amber-600 dark:text-amber-400">
                          {formatCurrency(inv.balanceDue, inv.currency)}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={cn(
                              'px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider border',
                              invoiceStatusStyles[inv.status] || 'bg-neutral-500/10 text-neutral-400'
                            )}
                          >
                            {inv.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {inv.balanceDue > 0 && (
                              <button
                                onClick={() => setSelectedPaymentInvoice(inv)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-[11px] font-bold transition-colors"
                                title="Log Payment"
                              >
                                <CreditCard className="w-3 h-3" />
                                <span>Pay</span>
                              </button>
                            )}
                            <Link
                              href={`/invoices/${inv._id}`}
                              className="p-1.5 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                              title="View Invoice"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Account Notes & Profile */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          {/* Notes Card */}
          <div className="p-6 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-[#232B3D]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  Internal Account Notes
                </h3>
              </div>
              <button
                onClick={() => setIsEditDrawerOpen(true)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" /> Edit Notes
              </button>
            </div>

            {client.notes ? (
              <div
                className="prose prose-xs dark:prose-invert max-w-none text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed pt-1"
                dangerouslySetInnerHTML={{ __html: client.notes }}
              />
            ) : (
              <p className="text-xs text-neutral-400 italic">
                No internal account notes documented yet. Click &quot;Edit Notes&quot; to write specifications and billing preferences in rich text.
              </p>
            )}
          </div>

          {/* Profile Metadata */}
          <div className="p-6 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-sm space-y-4">
            <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider pb-3 border-b border-neutral-200 dark:border-[#232B3D]">
              Account Profile Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                  Created On
                </span>
                <span className="text-neutral-800 dark:text-neutral-200 font-semibold">
                  {formatDate(client.createdAt)}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                  Last Updated
                </span>
                <span className="text-neutral-800 dark:text-neutral-200 font-semibold">
                  {formatDate(client.updatedAt)}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                  Default Currency
                </span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {client.currency} ({client.currency === 'INR' ? '₹' : '$'})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Client Drawer */}
      <ClientFormDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        client={client}
      />

      {/* Record Payment Drawer */}
      <RecordPaymentDrawer
        isOpen={!!selectedPaymentInvoice}
        onClose={() => setSelectedPaymentInvoice(null)}
        invoice={selectedPaymentInvoice}
      />
    </div>
  );
}
