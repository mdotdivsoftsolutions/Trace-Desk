'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { useRecordPayment } from '@/hooks/useInvoices';
import { InvoiceType, PaymentMethod } from '@/types';
import { formatCurrency } from '@/lib/formatters';

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
  const [amount, setAmount] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  const recordPaymentMutation = useRecordPayment();

  useEffect(() => {
    if (invoice) {
      setAmount(invoice.balanceDue);
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('bank_transfer');
      setReferenceNumber('');
      setNotes('');
    }
  }, [invoice, isOpen]);

  if (!isOpen || !invoice) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await recordPaymentMutation.mutateAsync({
      invoiceId: invoice._id,
      amount,
      paymentDate: new Date(paymentDate),
      paymentMethod: (paymentMethod === 'other' || paymentMethod === 'credit_card') ? 'bank_transfer' : paymentMethod,
      transactionReference: referenceNumber || undefined,
      notes: notes || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#1E293B] border-l border-neutral-200 dark:border-[#334155] shadow-2xl flex flex-col">
          <div className="h-16 px-6 border-b border-neutral-200 dark:border-[#334155] flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-neutral-900 dark:text-white">Record Client Payment</h2>
            <button onClick={onClose} className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155] text-xs space-y-1">
              <div className="flex justify-between"><span className="text-neutral-500">Invoice:</span><span className="font-mono font-bold text-neutral-900 dark:text-white">{invoice.invoiceNumber}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Balance Due:</span><span className="font-mono font-bold text-neutral-900 dark:text-white">{formatCurrency(invoice.balanceDue)}</span></div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Payment Amount (₹) *</label>
              <input type="number" required min="1" max={invoice.balanceDue} value={amount || ''} onChange={(e) => setAmount(Number(e.target.value))} className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-mono font-bold text-neutral-900 dark:text-white" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Payment Method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white">
                  <option value="bank_transfer">Bank Transfer (NEFT/IMPS)</option>
                  <option value="upi">UPI / Instant QR</option>
                  <option value="paypal">PayPal / International</option>
                  <option value="cash">Cash / Cheque</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Payment Date</label>
                <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Transaction Reference # / UTR</label>
              <input type="text" placeholder="e.g. UTR123456789" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white" />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Payment Notes</label>
              <textarea rows={2} placeholder="Optional remittance notes..." value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white" />
            </div>

            <div className="pt-4 border-t border-neutral-200 dark:border-[#334155] flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-3.5 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 text-xs font-semibold">Cancel</button>
              <button type="submit" disabled={recordPaymentMutation.isPending} className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold shadow-sm disabled:opacity-50">
                {recordPaymentMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Record Settlement</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RecordPaymentDrawer;
