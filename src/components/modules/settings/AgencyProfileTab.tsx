import React from 'react';
import { Building } from 'lucide-react';
import { Settings } from '@/types';

interface AgencyProfileTabProps {
  formData: Partial<Settings>;
  onChange: (field: keyof Settings, value: any) => void;
}

export function AgencyProfileTab({ formData, onChange }: AgencyProfileTabProps) {
  return (
    <div className="p-6 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-6">
      <div>
        <h3 className="font-heading text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Building className="w-4 h-4 text-neutral-500" />
          <span>Agency Profile & Identification</span>
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Your legal agency name, contact information, and business tax identifiers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Agency Legal Name *</label>
          <input
            type="text"
            required
            value={formData.agencyName || ''}
            onChange={(e) => onChange('agencyName', e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">GSTIN / Tax ID Number</label>
          <input
            type="text"
            placeholder="e.g. 29AAAAA0000A1Z5"
            value={formData.taxNumber || ''}
            onChange={(e) => onChange('taxNumber', e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Agency Email Address</label>
          <input
            type="email"
            value={formData.agencyEmail || ''}
            onChange={(e) => onChange('agencyEmail', e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Agency Phone Number</label>
          <input
            type="text"
            value={formData.agencyPhone || ''}
            onChange={(e) => onChange('agencyPhone', e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Registered Office Address</label>
          <textarea
            rows={2}
            value={formData.agencyAddress || ''}
            onChange={(e) => onChange('agencyAddress', e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>
      </div>
    </div>
  );
}

export default AgencyProfileTab;
