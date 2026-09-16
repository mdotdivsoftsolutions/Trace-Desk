'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, FileText, Loader2, AlertCircle, Sparkles, Coins, CheckCircle2, Plus } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { useProjects } from '@/hooks/useProjects';
import { useSettings } from '@/hooks/useSettings';
import { useCreateInvoice, useInvoices } from '@/hooks/useInvoices';
import { useMilestones } from '@/hooks/useMilestones';
import { InvoiceLineItemsEditor, InvoiceItemDraft } from '@/components/modules/invoices/form/InvoiceLineItemsEditor';
import { InvoiceSummaryCard } from '@/components/modules/invoices/form/InvoiceSummaryCard';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { ClientType, MilestoneType, ProjectType } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface InvoiceFormProps {
  clients: ClientType[];
  projects: ProjectType[];
  initialClientId: string;
  initialProjectId: string;
  initialTaxRate: number;
  initialNotes: string;
  initialItems: InvoiceItemDraft[];
  defaultCurrency?: string;
}

function InvoiceForm({
  clients,
  projects,
  initialClientId,
  initialProjectId,
  initialTaxRate,
  initialNotes,
  initialItems,
  defaultCurrency = 'INR',
}: InvoiceFormProps) {
  const router = useRouter();
  const createInvoiceMutation = useCreateInvoice();

  const [clientId, setClientId] = useState(initialClientId);
  const [projectId, setProjectId] = useState(initialProjectId);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [taxRate, setTaxRate] = useState(initialTaxRate);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState(initialNotes);
  const [items, setItems] = useState<InvoiceItemDraft[]>(initialItems);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dynamic project queries for billing assistant
  const { data: projectInvoicesData } = useInvoices({ projectId }, { enabled: !!projectId });
  const { data: projectMilestonesData } = useMilestones(projectId || '');

  const selectedProject = projects.find((p) => p._id === projectId);
  const invoiceCurrency = selectedProject?.currency || defaultCurrency || 'INR';

  const projectBudget = selectedProject ? (selectedProject.totalBudget || 0) : 0;
  const projectInvoices = projectInvoicesData?.items || [];
  const projectAlreadyBilled = projectInvoices.reduce((sum, inv) => sum + (inv.status !== 'cancelled' ? inv.totalAmount : 0), 0);
  const projectUnbilledBalance = Math.max(0, projectBudget - projectAlreadyBilled);
  const projectBilledPercentage = projectBudget > 0 ? Math.min(100, Math.round((projectAlreadyBilled / projectBudget) * 100)) : 0;

  const handleAddRemainingBalance = () => {
    if (!selectedProject) return;
    const balanceItem: InvoiceItemDraft = {
      description: `Final Balance / Deployment Settlement - ${selectedProject.title}`,
      quantity: 1,
      rate: projectUnbilledBalance > 0 ? projectUnbilledBalance : (projectBudget * 0.5),
      amount: projectUnbilledBalance > 0 ? projectUnbilledBalance : (projectBudget * 0.5),
    };
    if (items.length === 1 && !items[0].description && items[0].rate === 0) {
      setItems([balanceItem]);
    } else {
      setItems([...items, balanceItem]);
    }
  };

  const handleAddPercentageMilestone = (pct: number) => {
    if (!selectedProject) return;
    const amount = Math.round((projectBudget * pct) / 100);
    const pctItem: InvoiceItemDraft = {
      description: `${pct}% Milestone Payment - ${selectedProject.title}`,
      quantity: 1,
      rate: amount,
      amount: amount,
    };
    if (items.length === 1 && !items[0].description && items[0].rate === 0) {
      setItems([pctItem]);
    } else {
      setItems([...items, pctItem]);
    }
  };

  const handleAddMilestoneItem = (m: MilestoneType) => {
    const mAmt = m.allocatedAmount ?? m.amount ?? 0;
    const mItem: InvoiceItemDraft = {
      description: `Milestone: ${m.title}`,
      quantity: 1,
      rate: mAmt,
      amount: mAmt,
      milestoneId: m._id,
    };
    if (items.length === 1 && !items[0].description && items[0].rate === 0) {
      setItems([mItem]);
    } else {
      setItems([...items, mItem]);
    }
  };

  const handleClientChange = (newClientId: string) => {
    setClientId(newClientId);
    if (projectId) {
      const p = projects.find((proj) => proj._id === projectId);
      const pClientId = typeof p?.clientId === 'object' ? (p.clientId as ClientType)?._id : p?.clientId;
      if (pClientId && pClientId !== newClientId) {
        setProjectId('');
      }
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const totalAmount = Math.max(0, subtotal + taxAmount - discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const calculatedItems = items.map((it) => ({
      description: it.description,
      quantity: it.quantity,
      unitPrice: it.rate,
      amount: it.quantity * it.rate,
      milestoneId: it.milestoneId || undefined,
    }));

    try {
      const created = await createInvoiceMutation.mutateAsync({
        clientId,
        projectId: projectId || undefined,
        items: calculatedItems,
        taxRate,
        discount,
        discountAmount: discount,
        status: 'draft' as const,
        currency: invoiceCurrency,
        issueDate: new Date(issueDate),
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 86400000),
        notes: notes || undefined,
      });
      router.push('/invoices/' + created._id);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to generate invoice. Please check the details and try again.';
      setErrorMessage(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <Link href="/invoices" className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
          <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Invoices</span>
        </Link>
        <button type="submit" disabled={createInvoiceMutation.isPending} className="flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold shadow-sm disabled:opacity-50 transition-all">
          {createInvoiceMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          <span>Generate &amp; Issue Invoice</span>
        </button>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="p-6 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-6">
        <h2 className="font-heading text-lg font-bold text-neutral-900 dark:text-white">New Invoice Creation</h2>

        {/* Client + Project selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Client *</label>
            <select required value={clientId} onChange={(e) => handleClientChange(e.target.value)} className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400">
              <option value="">Select client...</option>
              {clients.map((c: ClientType) => {
                const company = c.companyName || c.company;
                return (
                  <option key={c._id} value={c._id}>
                    {company ? `${company} (${c.name})` : c.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Project <span className="font-normal text-neutral-400">(optional)</span></label>
            <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400">
              <option value="">No linked project...</option>
              {projects.filter((p: ProjectType) => !clientId || (typeof p.clientId === 'object' ? (p.clientId as ClientType)?._id === clientId : p.clientId === clientId)).map((p: ProjectType) => <option key={p._id} value={p._id}>{p.title}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Issue Date</label>
            <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400" />
          </div>
        </div>

        {/* Project Billing & Balance Assistant */}
        {selectedProject && (
          <div className="p-4 rounded-lg bg-neutral-50 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-neutral-900 dark:text-white">
                  Project Billing Assistant: <span className="text-emerald-600 dark:text-emerald-400">{selectedProject.title}</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase border bg-neutral-200/50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700">
                  {selectedProject.status.replace('_', ' ')}
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 font-semibold">
                {projectBilledPercentage}% Invoiced
              </span>
            </div>

            {/* Financial metric stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155]">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Total Budget</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-white">{formatCurrency(projectBudget, invoiceCurrency)}</span>
              </div>
              <div className="p-2.5 rounded bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155]">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Already Invoiced</span>
                <span className="font-mono font-bold text-neutral-700 dark:text-neutral-300">{formatCurrency(projectAlreadyBilled, invoiceCurrency)}</span>
              </div>
              <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 block">Unbilled Balance</span>
                <span className="font-mono font-extrabold text-emerald-800 dark:text-emerald-300">{formatCurrency(projectUnbilledBalance, invoiceCurrency)}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${projectBilledPercentage}%` }} />
            </div>

            {/* 1-Click Quick Fill Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Quick Fill:</span>
              <button
                type="button"
                onClick={handleAddRemainingBalance}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                title="Add remaining balance as line item"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Invoice Remaining Balance ({formatCurrency(projectUnbilledBalance > 0 ? projectUnbilledBalance : (projectBudget * 0.5), invoiceCurrency)})</span>
              </button>

              {projectBudget > 0 && (
                <button
                  type="button"
                  onClick={() => handleAddPercentageMilestone(50)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white dark:bg-[#1E293B] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-[#334155] text-xs font-semibold transition-all cursor-pointer"
                  title="Add 50% milestone payment"
                >
                  <Plus className="w-3 h-3 text-neutral-400" />
                  <span>50% Milestone ({formatCurrency(projectBudget * 0.5, invoiceCurrency)})</span>
                </button>
              )}
            </div>

            {/* Project Milestones if any */}
            {projectMilestonesData && projectMilestonesData.length > 0 && (
              <div className="pt-2 border-t border-neutral-200 dark:border-[#334155] space-y-1.5">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">Unbilled Milestones:</span>
                <div className="flex flex-wrap gap-2">
                  {projectMilestonesData.map((m: MilestoneType) => {
                    const isInvoiced = m.status === 'invoiced' || Boolean(m.invoiceId);
                    const mAmt = m.allocatedAmount ?? m.amount ?? 0;
                    return (
                      <button
                        key={m._id}
                        type="button"
                        onClick={() => handleAddMilestoneItem(m)}
                        disabled={isInvoiced}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                          isInvoiced
                            ? "bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-400"
                            : "bg-white dark:bg-[#1E293B] hover:bg-neutral-100 dark:hover:bg-neutral-800 border-neutral-300 dark:border-[#334155] text-neutral-800 dark:text-neutral-200"
                        )}
                        title={isInvoiced ? 'Milestone already invoiced' : `Add ${m.title} to invoice`}
                      >
                        {isInvoiced ? <CheckCircle2 className="w-3 h-3 text-neutral-400" /> : <Plus className="w-3 h-3 text-emerald-500" />}
                        <span className="font-medium">{m.title}</span>
                        <span className="font-mono font-bold text-neutral-500">({formatCurrency(mAmt, invoiceCurrency)})</span>
                        {isInvoiced && <span className="text-[10px] text-neutral-400 font-bold uppercase ml-1">Invoiced</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <hr className="border-neutral-200 dark:border-[#334155]" />

        {/* Line items editor */}
        <InvoiceLineItemsEditor
          items={items}
          onAddItem={() => setItems([...items, { description: '', quantity: 1, rate: 0, amount: 0 }])}
          onRemoveItem={(idx) => setItems(items.filter((_, i) => i !== idx))}
          onUpdateItem={(idx, f, v) => setItems(items.map((it, i) => i === idx ? { ...it, [f]: v } : it))}
        />

        {/* Tax / discount summary */}
        <InvoiceSummaryCard
          subtotal={subtotal} taxRate={taxRate} onTaxRateChange={setTaxRate}
          discount={discount} onDiscountChange={setDiscount}
          taxAmount={taxAmount} totalAmount={totalAmount}
        />

        <hr className="border-neutral-200 dark:border-[#334155]" />

        {/* Notes / Terms — rich text */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Invoice Notes &amp; Payment Terms
          </label>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
            This note will appear on the printed invoice. Include payment terms, bank details, or special instructions.
          </p>
          <RichTextEditor
            value={notes}
            onChange={setNotes}
            placeholder="e.g. Payment due within 14 days. NEFT to Axis Bank A/C: 1234567890, IFSC: UTIB0000000..."
          />
        </div>
      </div>
    </form>
  );
}

function InvoiceFormContent() {
  const searchParams = useSearchParams();
  const preselectedProjectId = searchParams.get('projectId') || '';
  const preselectedClientId = searchParams.get('clientId') || '';
  const preselectedMilestoneId = searchParams.get('milestoneId') || '';

  const { data: clientsData } = useClients({ limit: 100 });
  const { data: projectsData } = useProjects({ limit: 100 });
  const { data: settings } = useSettings();
  const { data: milestonesData } = useMilestones(preselectedProjectId);

  const matchedProject = projectsData?.items?.find((p: ProjectType) => p._id === preselectedProjectId);
  const effectiveClientId = preselectedClientId || (matchedProject ? (typeof matchedProject.clientId === 'object' ? (matchedProject.clientId as ClientType)?._id : matchedProject.clientId) : '') || '';

  const preselectedMilestone = preselectedMilestoneId && milestonesData
    ? milestonesData.find((m: MilestoneType) => m._id === preselectedMilestoneId)
    : undefined;

  const initialItems: InvoiceItemDraft[] = preselectedMilestone
    ? [{
        description: 'Milestone: ' + preselectedMilestone.title,
        quantity: 1,
        rate: preselectedMilestone.allocatedAmount || 0,
        amount: preselectedMilestone.allocatedAmount || 0,
        milestoneId: preselectedMilestone._id,
      }]
    : [{ description: '', quantity: 1, rate: 0, amount: 0, milestoneId: '' }];

  const initialTaxRate = settings?.defaultTaxRate !== undefined ? settings.defaultTaxRate : 18;
  const initialNotes = settings?.invoiceNotes || '';

  const formKey = `${preselectedProjectId}-${effectiveClientId}-${preselectedMilestone?._id || 'none'}-${settings?.defaultTaxRate ?? 'def'}-${settings?.invoiceNotes ? 'hasNotes' : 'noNotes'}`;

  return (
    <InvoiceForm
      key={formKey}
      clients={clientsData?.items || []}
      projects={projectsData?.items || []}
      initialClientId={effectiveClientId}
      initialProjectId={preselectedProjectId}
      initialTaxRate={initialTaxRate}
      initialNotes={initialNotes}
      initialItems={initialItems}
      defaultCurrency={settings?.defaultCurrency || 'INR'}
    />
  );
}

export default function NewInvoicePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-500">Loading invoice form...</div>}>
      <InvoiceFormContent />
    </Suspense>
  );
}


