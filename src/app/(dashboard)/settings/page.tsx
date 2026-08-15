'use client';

import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, CheckCircle, Loader2, Pencil, X } from 'lucide-react';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { AgencyProfileTab } from '@/components/modules/settings/AgencyProfileTab';
import { CurrencyFinanceTab } from '@/components/modules/settings/CurrencyFinanceTab';
import { BankUpiTab } from '@/components/modules/settings/BankUpiTab';
import { InvoiceConfigTab } from '@/components/modules/settings/InvoiceConfigTab';
import { TabBar, TabPanel } from '@/components/common/TabPanel';
import { SettingsType } from '@/types';

type SettingsTab = 'profile' | 'currency' | 'bank' | 'invoice';

const SETTINGS_TABS = [
  { key: 'profile',  label: 'Agency Profile' },
  { key: 'currency', label: 'Currency & Finance' },
  { key: 'bank',     label: 'Bank & UPI' },
  { key: 'invoice',  label: 'Invoice Config' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [formData, setFormData] = useState<Partial<SettingsType>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const { data: settings, isLoading } = useSettings();
  const updateSettingsMutation = useUpdateSettings();

  const activeFormData = isEditing ? formData : (settings || {});

  const handleChange = <K extends keyof SettingsType>(field: K, value: SettingsType[K]) => {
    setFormData((prev: Partial<SettingsType>) => ({ ...prev, [field]: value }));
  };

  const handleStartEdit = () => {
    setFormData(settings || {});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;

    try {
      await updateSettingsMutation.mutateAsync(formData as unknown as Parameters<typeof updateSettingsMutation.mutateAsync>[0]);
      setIsEditing(false);
      setFormData({});
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
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
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs">
              <SettingsIcon className="w-4 h-4" />
            </span>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Platform & Agency Settings
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Manage agency branding, currency, remittance details, and invoicing parameters.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Saved Successfully</span>
            </span>
          )}

          {!isEditing ? (
            <button
              type="button"
              onClick={handleStartEdit}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs font-bold shadow-sm transition"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Settings</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={updateSettingsMutation.isPending}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold border border-neutral-300 dark:border-neutral-700 transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>

              <button
                type="submit"
                disabled={updateSettingsMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs font-bold shadow-sm disabled:opacity-50 transition"
              >
                {updateSettingsMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{updateSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CLS-safe tab bar */}
      <TabBar
        tabs={SETTINGS_TABS}
        activeTab={activeTab}
        onTabChange={(k) => setActiveTab(k as SettingsTab)}
      />

      {/* CLS-safe panels */}
      <TabPanel tabKey="profile" activeTab={activeTab} minHeight={320}>
        <AgencyProfileTab formData={activeFormData} onChange={handleChange} isEditing={isEditing} />
      </TabPanel>
      <TabPanel tabKey="currency" activeTab={activeTab} minHeight={320}>
        <CurrencyFinanceTab formData={activeFormData} onChange={handleChange} isEditing={isEditing} />
      </TabPanel>
      <TabPanel tabKey="bank" activeTab={activeTab} minHeight={320}>
        <BankUpiTab formData={activeFormData} onChange={handleChange} isEditing={isEditing} />
      </TabPanel>
      <TabPanel tabKey="invoice" activeTab={activeTab} minHeight={320}>
        <InvoiceConfigTab formData={activeFormData} onChange={handleChange} isEditing={isEditing} />
      </TabPanel>
    </form>
  );
}
