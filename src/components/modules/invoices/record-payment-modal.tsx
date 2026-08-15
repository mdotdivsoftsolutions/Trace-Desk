'use client';

import React, { useState } from 'react';
import { X, DollarSign, Check, Loader2, CreditCard } from 'lucide-react';
import { useRecordPayment } from '@/hooks';
import { CreatePaymentInput } from '@/lib/validations';
import { formatCurrency } from '@/lib/utils';
import { InvoiceType } from '@/types';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceType | null;
}

export function RecordPaymentModal({
  isOpen,
  onClose,
  invoice,
}: RecordPaymentModalProps) {
  const recordPaymentMutation = useRecordPayment();

  const [formData, setFormData] = useState<Omit<CreatePaymentInput, 'invoiceId'>>({
    amount: invoice?.balanceDue || 0,
    paymentDate: new Date(),
    paymentMethod: 'bank_transfer',
    transactionReference: '',
    notes: '',
  });

  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !invoice) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.amount <= 0) {
      setError('Payment amount must be greater than 0');
      return;
    }

    if (formData.amount > invoice.balanceDue) {
      setError(`Payment amount cannot exceed outstanding balance (${formatCurrency(invoice.balanceDue, invoice.currency)})`);
      return;
    }

    try {
      await recordPaymentMutation.mutateAsync({
        invoiceId: invoice._id,
        ...formData,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to record payment');
    }
  };

  const isLoading = recordPaymentMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Record Payment
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Invoice {invoice.invoiceNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Due Banner */}
        <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 flex items-center justify-between">
          <div className="text-xs text-neutral-500 font-medium">Outstanding Balance</div>
          <div className="text-base font-extrabold text-amber-600 dark:text-amber-400">
            {formatCurrency(invoice.balanceDue, invoice.currency)}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Payment Amount ({invoice.currency}) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min="0.01"
                step="any"
                max={invoice.balanceDue}
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 text-sm font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, amount: invoice.balanceDue })}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase"
              >
                Pay in Full
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="bank_transfer">Bank / Wire Transfer</option>
                <option value="stripe">Stripe / Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="upi">UPI / Instant Transfer</option>
                <option value="cash">Cash / Direct</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                required
                value={formData.paymentDate ? new Date(formData.paymentDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value ? new Date(e.target.value) : new Date() })}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Transaction / Reference ID
            </label>
            <input
              type="text"
              value={formData.transactionReference || ''}
              onChange={(e) => setFormData({ ...formData, transactionReference: e.target.value })}
              placeholder="e.g. TXN-98421873 or Wire Ref"
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Notes
            </label>
            <input
              type="text"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. 50% milestone advance payment"
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200/80 dark:border-neutral-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs shadow-md shadow-emerald-600/30 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>Record Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
