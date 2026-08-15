'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Receipt,
  Plus,
  Trash2,
  Building2,
  FolderKanban,
  Calendar,
  DollarSign,
  Milestone,
  Check,
  Loader2,
  ArrowLeft,
  Sparkles,
  Percent,
} from 'lucide-react';
import { useCreateInvoice, useProjects, useClients } from '@/hooks';
import { CreateInvoiceInput, InvoiceItemInput } from '@/lib/validations';
import { formatCurrency } from '@/lib/utils';
import { MilestoneType } from '@/types';

export default function NewInvoicePage() {
  const router = useRouter();
  const createInvoiceMutation = useCreateInvoice();

  const { data: clientsData } = useClients({ status: 'active', limit: 100 });
  const clients = clientsData?.items || [];
  const { data: projectsData } = useProjects({ limit: 100 });
  const projects = projectsData?.items || [];

  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');

  const [invoiceNumber, setInvoiceNumber] = useState<string>(
    `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [issueDate, setIssueDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const [items, setItems] = useState<InvoiceItemInput[]>([
    { description: 'Consulting & Engineering Services', quantity: 1, unitPrice: 1500, amount: 1500 },
  ]);

  const [taxRate, setTaxRate] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('Thank you for your business! Please settle the balance within 14 days.');
  const [paymentTerms, setPaymentTerms] = useState<string>('Net 14 Days (Wire Transfer / Stripe / UPI)');
  const [error, setError] = useState<string | null>(null);

  // Selected project details
  const selectedProject = projects?.find((p) => p._id === selectedProjectId);

  // When project changes, auto-set client and currency
  useEffect(() => {
    if (selectedProject) {
      const clientId =
        typeof selectedProject.clientId === 'object'
          ? (selectedProject.clientId as any)._id
          : selectedProject.clientId;
      setSelectedClientId(clientId);
      if (selectedProject.currency) {
        setCurrency(selectedProject.currency);
      }
    }
  }, [selectedProjectId, selectedProject]);

  // When client changes (if no project), set currency
  useEffect(() => {
    if (!selectedProjectId && selectedClientId) {
      const client = clients?.find((c) => c._id === selectedClientId);
      if (client?.currency) {
        setCurrency(client.currency);
      }
    }
  }, [selectedClientId, selectedProjectId, clients]);

  // Line item handlers
  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: keyof InvoiceItemInput, value: any) => {
    const updated = [...items];
    const current = { ...updated[index], [field]: value };

    if (field === 'quantity' || field === 'unitPrice') {
      const q = field === 'quantity' ? parseFloat(value) || 0 : current.quantity;
      const p = field === 'unitPrice' ? parseFloat(value) || 0 : current.unitPrice;
      current.amount = Math.round(q * p * 100) / 100;
    }

    updated[index] = current;
    setItems(updated);
  };

  // Convert milestone into line item
  const handleAddMilestoneAsItem = (milestone: MilestoneType) => {
    const newItem: InvoiceItemInput = {
      description: `Milestone Delivery: ${milestone.title}${milestone.description ? ` - ${milestone.description}` : ''}`,
      quantity: 1,
      unitPrice: milestone.allocatedAmount || 0,
      amount: milestone.allocatedAmount || 0,
    };
    setItems([...items, newItem]);
  };

  // Math totals
  const subtotal = items.reduce((acc, it) => acc + (it.amount || 0), 0);
  const taxAmount = Math.round(((subtotal * taxRate) / 100) * 100) / 100;
  const totalAmount = Math.max(0, Math.round((subtotal + taxAmount - discount) * 100) / 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedClientId) {
      setError('Please select a client');
      return;
    }

    if (items.length === 0 || items.some((it) => !it.description.trim() || (it.amount ?? 0) <= 0)) {
      setError('Please ensure all line items have a valid description and amount');
      return;
    }

    const payload: CreateInvoiceInput = {
      clientId: selectedClientId,
      projectId: selectedProjectId || undefined,
      invoiceNumber,
      issueDate: new Date(issueDate),
      dueDate: new Date(dueDate),
      currency,
      items,
      taxRate,
      discountAmount: discount,
      notes: `${notes}${paymentTerms ? ` | Terms: ${paymentTerms}` : ''}`,
      status: 'draft',
    };

    try {
      const created = await createInvoiceMutation.mutateAsync(payload);
      router.push(`/invoices/${created._id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create invoice');
    }
  };

  const isLoading = createInvoiceMutation.isPending;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header & Back */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
            <Link href="/invoices" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Invoices</span>
            </Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white font-semibold">New Invoice</span>
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white flex items-center gap-2.5">
            <Receipt className="w-7 h-7 text-indigo-500" />
            <span>Create Invoice</span>
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Invoice Generator Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Project & Client Assignment */}
        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-500" />
            <span>1. Client & Project Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Link to Project (Optional)
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">No Project (Direct Client Bill)</option>
                {projects?.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Client <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a Client</option>
                {clients?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} {c.companyName ? `(${c.companyName})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Billing Currency
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                placeholder="USD"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Invoice Number
              </label>
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Payment Due Date
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Milestone Fast-Picker (If project has milestones) */}
        {selectedProject?.milestones && selectedProject.milestones.length > 0 && (
          <div className="p-5 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Quick Add From Project Milestones:</span>
              </span>
              <span className="text-[11px] text-neutral-500">
                Click any milestone phase to add as line item
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedProject.milestones.map((m: MilestoneType) => (
                <button
                  key={m._id}
                  type="button"
                  onClick={() => handleAddMilestoneAsItem(m)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-indigo-300 dark:border-indigo-800 hover:border-indigo-500 text-xs font-semibold text-neutral-800 dark:text-neutral-200 shadow-sm transition-all group"
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-500 group-hover:scale-110 transition-transform" />
                  <span>{m.title}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                    ({formatCurrency(m.allocatedAmount || 0, currency)})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Line Items Table */}
        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Receipt className="w-4 h-4 text-indigo-500" />
              <span>2. Invoice Line Items</span>
            </h2>

            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Item</span>
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-3 items-center p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60"
              >
                <div className="col-span-12 sm:col-span-6">
                  <label className="block text-[10px] font-semibold text-neutral-500 mb-1">
                    Item Description
                  </label>
                  <input
                    type="text"
                    required
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    placeholder="Deliverable description, milestone phase, etc."
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <label className="block text-[10px] font-semibold text-neutral-500 mb-1">
                    Qty / Hours
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="any"
                    required
                    value={item.quantity || ''}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                  />
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <label className="block text-[10px] font-semibold text-neutral-500 mb-1">
                    Unit Price ({currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={item.unitPrice || ''}
                    onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
                  />
                </div>

                <div className="col-span-3 sm:col-span-1 text-right">
                  <label className="block text-[10px] font-semibold text-neutral-500 mb-1">
                    Amount
                  </label>
                  <div className="text-xs font-bold text-neutral-900 dark:text-white pt-1">
                    {formatCurrency(item.amount || 0, currency)}
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-1 flex justify-end pt-3 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    disabled={items.length === 1}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: Math Calculations, Discounts & Payment Terms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notes and Terms */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Payment Terms & Remittance
              </label>
              <input
                type="text"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                placeholder="e.g. Net 14 Days (Wire Transfer / Stripe / UPI)"
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Client Notes & Remittance Details
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Bank routing info, UPI handle, or project delivery sign-off remarks..."
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Math Summary Box */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
              Financial Summary
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">Subtotal:</span>
                <span className="font-bold text-neutral-900 dark:text-white">
                  {formatCurrency(subtotal, currency)}
                </span>
              </div>

              {/* Tax input */}
              <div className="flex items-center justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-1.5 text-neutral-500">
                  <span>Tax Rate (%):</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    value={taxRate || ''}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-16 px-2 py-0.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white text-right"
                  />
                </div>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  +{formatCurrency(taxAmount, currency)}
                </span>
              </div>

              {/* Discount input */}
              <div className="flex items-center justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-1.5 text-neutral-500">
                  <span>Discount ({currency}):</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={discount || ''}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-20 px-2 py-0.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white text-right"
                  />
                </div>
                <span className="font-semibold text-rose-500">
                  -{formatCurrency(discount, currency)}
                </span>
              </div>

              {/* Total Due */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-extrabold text-neutral-900 dark:text-white">Total Amount Due:</span>
                <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(totalAmount, currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/invoices"
            className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Discard
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>Generate & Preview Invoice</span>
          </button>
        </div>
      </form>
    </div>
  );
}
