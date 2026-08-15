import React from 'react';
import { Building } from 'lucide-react';
import { Settings } from '@/types';

interface AgencyProfileTabProps {
  formData: Partial<Settings>;
  onChange: <K extends keyof Settings>(field: K, value: Settings[K]) => void;
  isEditing?: boolean;
}

export function AgencyProfileTab({ formData, onChange, isEditing = false }: AgencyProfileTabProps) {
  const inputClass = `w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white transition-colors ${
    isEditing
      ? 'focus:outline-none focus:ring-2 focus:ring-neutral-400 bg-white dark:bg-[#0B1120]'
      : 'cursor-not-allowed opacity-90 bg-neutral-100/70 dark:bg-[#0F172A]/50 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
  }`;

  return (
    <div className="p-6 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-neutral-500" />
            <span>Agency Profile & Identification</span>
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Your legal agency name, contact information, and business tax identifiers.
          </p>
        </div>
        {!isEditing && (
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
            View Only
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Agency Legal Name *</label>
          <input
            type="text"
            required
            disabled={!isEditing}
            value={formData.agencyName || ''}
            onChange={(e) => onChange('agencyName', e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">GSTIN / Tax ID Number</label>
          <input
            type="text"
            placeholder="e.g. 29AAAAA0000A1Z5"
            disabled={!isEditing}
            value={formData.taxNumber || formData.gstinOrTaxId || ''}
            onChange={(e) => {
              onChange('taxNumber', e.target.value);
              onChange('gstinOrTaxId', e.target.value);
            }}
            className={`${inputClass} font-mono uppercase`}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Agency Email Address</label>
          <input
            type="email"
            disabled={!isEditing}
            value={formData.agencyEmail || ''}
            onChange={(e) => onChange('agencyEmail', e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Agency Phone Number</label>
          <input
            type="text"
            disabled={!isEditing}
            value={formData.agencyPhone || ''}
            onChange={(e) => onChange('agencyPhone', e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Registered Office Address</label>
          <textarea
            rows={2}
            disabled={!isEditing}
            value={formData.agencyAddress || ''}
            onChange={(e) => onChange('agencyAddress', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}

export default AgencyProfileTab;
