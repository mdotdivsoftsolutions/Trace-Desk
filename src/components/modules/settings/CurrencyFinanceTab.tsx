import React from 'react';
import { DollarSign } from 'lucide-react';
import { Settings } from '@/types';

interface CurrencyFinanceTabProps {
  formData: Partial<Settings>;
  onChange: (field: keyof Settings, value: any) => void;
}

export function CurrencyFinanceTab({ formData, onChange }: CurrencyFinanceTabProps) {
  return (
    <div className="p-6 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-6">
      <div>
        <h3 className="font-heading text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-neutral-500" />
          <span>Currency & Financial Calculation Rules</span>
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Select default workspace currency symbols, standard hourly rates, and tax parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Default Currency</label>
          <select
            value={formData.defaultCurrency || 'INR'}
            onChange={(e) => onChange('defaultCurrency', e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            <option value="INR">INR (₹) - Indian Rupee</option>
            <option value="USD">USD ($) - US Dollar</option>
            <option value="EUR">EUR (€) - Euro</option>
            <option value="GBP">GBP (£) - British Pound</option>
            <option value="AED">AED (د.إ) - UAE Dirham</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Default Hourly Rate ({formData.defaultCurrency || 'INR'})</label>
          <input
            type="number"
            min="0"
            value={formData.hourlyRate || 0}
            onChange={(e) => onChange('hourlyRate', Number(e.target.value))}
            className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Default Tax Rate (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.defaultTaxRate || 18}
            onChange={(e) => onChange('defaultTaxRate', Number(e.target.value))}
            className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Standard Payment Terms (Days)</label>
          <input
            type="number"
            min="0"
            value={formData.paymentTermsDays || 14}
            onChange={(e) => onChange('paymentTermsDays', Number(e.target.value))}
            className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>
      </div>
    </div>
  );
}

export default CurrencyFinanceTab;
