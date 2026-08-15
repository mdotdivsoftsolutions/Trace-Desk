'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, FileText, Loader2 } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { useProjects } from '@/hooks/useProjects';
import { useSettings } from '@/hooks/useSettings';
import { useCreateInvoice } from '@/hooks/useInvoices';
import { InvoiceLineItemsEditor, InvoiceItemDraft } from '@/components/modules/invoices/form/InvoiceLineItemsEditor';
import { InvoiceSummaryCard } from '@/components/modules/invoices/form/InvoiceSummaryCard';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { ClientType, ProjectType } from '@/types';

function InvoiceFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedProjectId = searchParams.get('projectId') || '';
  const preselectedClientId = searchParams.get('clientId') || '';

  const { data: clientsData } = useClients({ limit: 100 });
  const { data: projectsData } = useProjects({ limit: 100 });
  const { data: settings } = useSettings();
  const createInvoiceMutation = useCreateInvoice();

  const [clientId, setClientId] = useState(preselectedClientId);
  const [projectId, setProjectId] = useState(preselectedProjectId);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [taxRate, setTaxRate] = useState(18);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<InvoiceItemDraft[]>([{ description: '', quantity: 1, rate: 0, amount: 0 }]);

  useEffect(() => {
    if (settings?.defaultTaxRate !== undefined) setTaxRate(settings.defaultTaxRate);
    if (settings?.invoiceNotes) setNotes(settings.invoiceNotes);
  }, [settings]);

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const totalAmount = Math.max(0, subtotal + taxAmount - discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedItems = items.map((it) => ({
      description: it.description,
      quantity: it.quantity,
      unitPrice: it.rate,
      rate: it.rate,
      amount: it.quantity * it.rate,
    }));

    const created = await createInvoiceMutation.mutateAsync({
      clientId,
      projectId: projectId || undefined,
      items: calculatedItems,
      taxRate,
      discount,
      discountAmount: discount,
      status: 'draft' as const,
      currency: 'INR',
      issueDate: new Date(issueDate),
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 86400000),
      notes: notes || undefined,
    });
    router.push(`/invoices/${created._id}`);
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

      <div className="p-6 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-6">
        <h2 className="font-heading text-lg font-bold text-neutral-900 dark:text-white">New Invoice Creation</h2>

        {/* Client + Project selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Client *</label>
            <select required value={clientId} onChange={(e) => setClientId(e.target.value)} className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400">
              <option value="">Select client...</option>
              {(clientsData?.items || []).map((c: ClientType) => <option key={c._id} value={c._id}>{c.name}{c.companyName ? ` — ${c.companyName}` : ''}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Project <span className="font-normal text-neutral-400">(optional)</span></label>
            <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400">
              <option value="">No linked project...</option>
              {(projectsData?.items || []).filter((p: ProjectType) => !clientId || (typeof p.clientId === 'object' ? (p.clientId as any)?._id === clientId : p.clientId === clientId)).map((p: ProjectType) => <option key={p._id} value={p._id}>{p.title}</option>)}
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

export default function NewInvoicePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-500">Loading invoice form...</div>}>
      <InvoiceFormContent />
    </Suspense>
  );
}
