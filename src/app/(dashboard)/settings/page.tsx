'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, Loader2 } from 'lucide-react';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { AgencyProfileTab } from '@/components/modules/settings/AgencyProfileTab';
import { CurrencyFinanceTab } from '@/components/modules/settings/CurrencyFinanceTab';
import { BankUpiTab } from '@/components/modules/settings/BankUpiTab';
import { InvoiceConfigTab } from '@/components/modules/settings/InvoiceConfigTab';
import { SettingsType } from '@/types';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'currency' | 'bank' | 'invoice'>('profile');
  const [formData, setFormData] = useState<Partial<SettingsType>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  const { data: settings, isLoading } = useSettings();
  const updateSettingsMutation = useUpdateSettings();

  useEffect(() => {
    if (settings) setFormData(settings);
  }, [settings]);

  const handleChange = (field: keyof SettingsType, value: any) => {
    setFormData((prev: Partial<SettingsType>) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettingsMutation.mutateAsync(formData as any);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block w-8 h-8 border-2 border-neutral-900 dark:border-white border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-neutral-500 mt-2">Loading agency settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Platform & Agency Settings
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage your agency branding, platform currency, remittance details, and automated invoicing parameters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Saved successfully</span>
            </span>
          )}
          <button
            type="submit"
            disabled={updateSettingsMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold shadow-sm disabled:opacity-50"
          >
            {updateSettingsMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{updateSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <div className="border-b border-neutral-200 dark:border-[#334155] flex gap-6 text-xs font-semibold">
        {(['profile', 'currency', 'bank', 'invoice'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              'pb-3 capitalize transition-colors relative',
              activeTab === tab
                ? 'text-neutral-900 dark:text-white border-b-2 border-neutral-900 dark:border-white font-bold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            )}
          >
            {tab === 'profile' && 'Agency Profile'}
            {tab === 'currency' && 'Currency & Finance'}
            {tab === 'bank' && 'Bank & UPI Details'}
            {tab === 'invoice' && 'Invoice Config'}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'profile' && <AgencyProfileTab formData={formData} onChange={handleChange} />}
        {activeTab === 'currency' && <CurrencyFinanceTab formData={formData} onChange={handleChange} />}
        {activeTab === 'bank' && <BankUpiTab formData={formData} onChange={handleChange} />}
        {activeTab === 'invoice' && <InvoiceConfigTab formData={formData} onChange={handleChange} />}
      </div>
    </form>
  );
}
