import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

export interface InvoiceItemDraft {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceLineItemsEditorProps {
  items: InvoiceItemDraft[];
  onAddItem: () => void;
  onRemoveItem: (idx: number) => void;
  onUpdateItem: (idx: number, field: 'description' | 'quantity' | 'rate', value: any) => void;
}

export function InvoiceLineItemsEditor({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}: InvoiceLineItemsEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Line Items & Deliverables</h3>
        <button
          type="button"
          onClick={onAddItem}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /><span>+ Add Line Item</span>
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="p-3.5 rounded-lg bg-neutral-50 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-neutral-400 font-mono">Item #{idx + 1}</span>
              {items.length > 1 && (
                <button type="button" onClick={() => onRemoveItem(idx)} className="text-neutral-400 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                required
                placeholder="Description / Milestone phase..."
                value={item.description}
                onChange={(e) => onUpdateItem(idx, 'description', e.target.value)}
                className="sm:col-span-6 px-3 py-1.5 rounded bg-white dark:bg-[#1E293B] border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
              />
              <input
                type="number"
                required
                min="1"
                placeholder="Qty"
                value={item.quantity || ''}
                onChange={(e) => onUpdateItem(idx, 'quantity', Number(e.target.value))}
                className="sm:col-span-2 px-3 py-1.5 rounded bg-white dark:bg-[#1E293B] border border-neutral-300 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white"
              />
              <input
                type="number"
                required
                min="0"
                placeholder="Rate (₹)"
                value={item.rate || ''}
                onChange={(e) => onUpdateItem(idx, 'rate', Number(e.target.value))}
                className="sm:col-span-2 px-3 py-1.5 rounded bg-white dark:bg-[#1E293B] border border-neutral-300 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white"
              />
              <div className="sm:col-span-2 px-3 py-1.5 rounded bg-neutral-100 dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] text-xs font-mono font-bold text-neutral-900 dark:text-white flex items-center justify-end">
                {formatCurrency(item.quantity * item.rate)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InvoiceLineItemsEditor;
