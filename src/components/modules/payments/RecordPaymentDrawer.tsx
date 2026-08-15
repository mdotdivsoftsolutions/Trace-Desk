'use client';

import React, { useState, useEffect } from 'react';
import { X, CreditCard, Check, Loader2, Landmark } from 'lucide-react';
import { useRecordPayment } from '@/hooks';
import { CreatePaymentInput } from '@/lib/validations';
import { formatCurrency } from '@/lib/utils';
import { InvoiceType } from '@/types';

interface RecordPaymentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceType | null;
}

export function RecordPaymentDrawer({
  isOpen,
  onClose,
  invoice,
}: RecordPaymentDrawerProps) {
  const recordPaymentMutation = useRecordPayment();

  const [formData, setFormData] = useState<Omit<CreatePaymentInput, 'invoiceId'>>({
    amount: 0,
    paymentDate: new Date(),
    paymentMethod: 'bank_transfer',
    transactionReference: '',
    notes: '',
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (invoice) {
      setFormData({
        amount: invoice.balanceDue || 0,
        paymentDate: new Date(),
        paymentMethod: 'bank_transfer',
        transactionReference: '',
        notes: '',
      });
    }
    setError(null);
  }, [invoice, isOpen]);

  if (!isOpen || !invoice) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.amount <= 0) {
      setError('Payment amount must be greater than 0');
      return;
    }

    if (formData.amount > invoice.balanceDue) {
      setError(
        `Payment amount cannot exceed outstanding balance (${formatCurrency(invoice.balanceDue, invoice.currency)})`
      );
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
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={() => {
          if (!isLoading) onClose();
        }}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md sm:max-w-lg bg-white dark:bg-[#1C2029] border-l border-neutral-200 dark:border-[#2D333F] shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-[#2D333F] flex items-center justify-between gap-3 bg-neutral-50/50 dark:bg-[#111318]/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155] flex items-center justify-center font-bold">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-heading text-base font-bold text-neutral-900 dark:text-white">
                  Record Payment Settlement
                </h2>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Invoice <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{invoice.invoiceNumber}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Scrollable Body */}
          <form id="payment-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-neutral-700 dark:text-neutral-300 dark:text-rose-400 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Financial Ledger Summary Banner */}
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-[#111318] border border-neutral-200 dark:border-[#2D333F] grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Total Billed
                </span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white font-mono">
                  {formatCurrency(invoice.totalAmount, invoice.currency)}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Remaining Balance
                </span>
                <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300 dark:text-amber-400 font-mono">
                  {formatCurrency(invoice.balanceDue, invoice.currency)}
                </span>
              </div>
            </div>

            {/* Payment Amount */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Payment Amount ({invoice.currency}) <span className="text-neutral-700 dark:text-neutral-300">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, amount: invoice.balanceDue })}
                  className="text-[11px] font-bold text-neutral-900 dark:text-white hover:underline"
                >
                  Pay Full Balance ({formatCurrency(invoice.balanceDue, invoice.currency)})
                </button>
              </div>
              <input
                type="number"
                min="0.01"
                max={invoice.balanceDue}
                step="any"
                required
                value={formData.amount || ''}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                }
                placeholder="0.00"
                className="w-full px-3.5 py-2.5 rounded-md bg-neutral-50 dark:bg-[#111318] border border-neutral-300 dark:border-neutral-700 text-sm font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 font-mono"
              />
            </div>

            {/* Method & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#111318] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500"
                >
                  <option value="bank_transfer">Bank Wire / NEFT / IMPS</option>
                  <option value="upi">UPI / VPA Instant</option>
                  <option value="stripe">Credit / Debit Card (Stripe)</option>
                  <option value="paypal">PayPal</option>
                  <option value="wire">SWIFT / International Wire</option>
                  <option value="cash">Cash / Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Settlement Date
                </label>
                <input
                  type="date"
                  required
                  value={
                    formData.paymentDate
                      ? new Date(formData.paymentDate).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paymentDate: e.target.value ? new Date(e.target.value) : new Date(),
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#111318] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500"
                />
              </div>
            </div>

            {/* Transaction Reference ID */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Transaction Reference / UTR Number
              </label>
              <input
                type="text"
                value={formData.transactionReference || ''}
                onChange={(e) => setFormData({ ...formData, transactionReference: e.target.value })}
                placeholder="e.g. UTR123456789 or TXN_987654"
                className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#111318] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 font-mono"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Settlement Notes / Audit Remarks
              </label>
              <textarea
                rows={3}
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g. Received via corporate HDFC current account..."
                className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#111318] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500"
              />
            </div>
          </form>

          {/* Sticky Bottom Action Bar */}
          <div className="p-4 border-t border-neutral-200 dark:border-[#2D333F] flex items-center justify-end gap-2.5 bg-neutral-50 dark:bg-[#111318]">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1C2029] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="payment-form"
              disabled={isLoading}
              className="flex items-center gap-1.5 px-5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>Log Settlement</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

export default RecordPaymentDrawer;
