import React from 'react';
import { formatCurrency } from '@/lib/formatters';

interface InvoiceSummaryCardProps {
  subtotal: number;
  taxRate: number;
  onTaxRateChange: (val: number) => void;
  discount: number;
  onDiscountChange: (val: number) => void;
  taxAmount: number;
  totalAmount: number;
}

export function InvoiceSummaryCard({
  subtotal,
  taxRate,
  onTaxRateChange,
  discount,
  onDiscountChange,
  taxAmount,
  totalAmount,
}: InvoiceSummaryCardProps) {
  return (
    <div className="p-5 rounded-lg bg-neutral-50 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155] space-y-3 max-w-sm ml-auto text-xs">
      <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
        <span>Subtotal:</span>
        <span className="font-mono font-bold text-neutral-900 dark:text-white">{formatCurrency(subtotal)}</span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-neutral-600 dark:text-neutral-400">Tax Rate (%):</span>
        <input
          type="number"
          min="0"
          max="100"
          value={taxRate}
          onChange={(e) => onTaxRateChange(Number(e.target.value))}
          className="w-20 px-2.5 py-1 rounded bg-white dark:bg-[#1E293B] border border-neutral-300 dark:border-neutral-700 font-mono text-right text-xs"
        />
      </div>

      <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
        <span>Computed Tax:</span>
        <span className="font-mono font-bold text-neutral-900 dark:text-white">{formatCurrency(taxAmount)}</span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-neutral-600 dark:text-neutral-400">Discount (₹):</span>
        <input
          type="number"
          min="0"
          value={discount || ''}
          onChange={(e) => onDiscountChange(Number(e.target.value))}
          className="w-24 px-2.5 py-1 rounded bg-white dark:bg-[#1E293B] border border-neutral-300 dark:border-neutral-700 font-mono text-right text-xs"
        />
      </div>

      <div className="pt-2 border-t border-neutral-200 dark:border-[#334155] flex justify-between text-sm font-bold text-neutral-900 dark:text-white">
        <span>Grand Total:</span>
        <span className="font-mono text-base">{formatCurrency(totalAmount)}</span>
      </div>
    </div>
  );
}

export default InvoiceSummaryCard;
