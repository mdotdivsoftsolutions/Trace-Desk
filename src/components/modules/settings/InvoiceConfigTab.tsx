import React from 'react';
import { Receipt } from 'lucide-react';
import { Settings } from '@/types';

interface InvoiceConfigTabProps {
  formData: Partial<Settings>;
  onChange: (field: keyof Settings, value: any) => void;
}

export function InvoiceConfigTab({ formData, onChange }: InvoiceConfigTabProps) {
  return (
    <div className="p-6 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-6">
      <div>
        <h3 className="font-heading text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Receipt className="w-4 h-4 text-neutral-500" />
          <span>Invoice Generation & Sequencing Engine</span>
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Configure automated numbering series and client payment terms.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Invoice Number Prefix</label>
          <input
            type="text"
            placeholder="e.g. INV-"
            value={formData.invoicePrefix || 'INV-'}
            onChange={(e) => onChange('invoicePrefix', e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Next Sequential Number</label>
          <input
            type="number"
            min="1"
            value={formData.nextInvoiceNumber || 1}
            onChange={(e) => onChange('nextInvoiceNumber', Number(e.target.value))}
            className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Standard Invoice Footer Terms & Conditions</label>
          <textarea
            rows={3}
            placeholder="e.g. Payment due within 14 days. Please make transfers to the stated bank details."
            value={formData.invoiceNotes || ''}
            onChange={(e) => onChange('invoiceNotes', e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>
      </div>
    </div>
  );
}

export default InvoiceConfigTab;
