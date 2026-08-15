import React from 'react';
import { CreditCard } from 'lucide-react';
import { Settings } from '@/types';

interface BankUpiTabProps {
  formData: Partial<Settings>;
  onChange: (field: keyof Settings, value: any) => void;
}

export function BankUpiTab({ formData, onChange }: BankUpiTabProps) {
  const bankDetails = formData.bankDetails || {};

  const handleBankChange = (field: string, value: string) => {
    onChange('bankDetails', { ...bankDetails, [field]: value });
  };

  return (
    <div className="p-6 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-6">
      <div>
        <h3 className="font-heading text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-neutral-500" />
          <span>Remittance, Bank & UPI Payout Details</span>
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          These details are automatically rendered on client PDF invoices and payment receipts.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Bank Name</label>
          <input
            type="text"
            placeholder="e.g. HDFC Bank, State Bank of India"
            value={bankDetails.bankName || ''}
            onChange={(e) => handleBankChange('bankName', e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Account Beneficiary Name</label>
          <input
            type="text"
            placeholder="e.g. M.Div Softsolutions Pvt Ltd"
            value={bankDetails.accountName || ''}
            onChange={(e) => handleBankChange('accountName', e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Account Number</label>
          <input
            type="text"
            placeholder="e.g. 50200012345678"
            value={bankDetails.accountNumber || ''}
            onChange={(e) => handleBankChange('accountNumber', e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">IFSC / Swift / Routing Code</label>
          <input
            type="text"
            placeholder="e.g. HDFC0000123"
            value={bankDetails.ifscCode || ''}
            onChange={(e) => handleBankChange('ifscCode', e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">UPI ID / VPA (Instant QR Billing)</label>
          <input
            type="text"
            placeholder="e.g. mdotdiv@okhdfcbank"
            value={bankDetails.upiId || ''}
            onChange={(e) => handleBankChange('upiId', e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>
      </div>
    </div>
  );
}

export default BankUpiTab;
