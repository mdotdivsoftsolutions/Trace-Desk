'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileSpreadsheet,
  DollarSign,
  Landmark,
  FileText,
  Check,
  Loader2,
  Globe,
  Percent,
} from 'lucide-react';
import { useSettings, useUpdateSettings } from '@/hooks';
import { SettingsType } from '@/types';
import { cn } from '@/lib/utils';

type SettingsTab = 'profile' | 'currency' | 'bank' | 'invoice';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const { data: settings, isLoading } = useSettings();
  const updateSettingsMutation = useUpdateSettings();

  const [formData, setFormData] = useState<SettingsType>({
    agencyName: 'M.Div Softsolutions',
    agencyEmail: '',
    agencyPhone: '',
    agencyAddress: '',
    gstinOrTaxId: '',
    defaultCurrency: 'INR',
    currencySymbol: '₹',
    invoicePrefix: 'MDIV-',
    defaultTaxRate: 18,
    bankDetails: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      upiId: '',
      swiftCode: '',
    },
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        agencyName: settings.agencyName || 'M.Div Softsolutions',
        agencyEmail: settings.agencyEmail || '',
        agencyPhone: settings.agencyPhone || '',
        agencyAddress: settings.agencyAddress || '',
        gstinOrTaxId: settings.gstinOrTaxId || '',
        defaultCurrency: settings.defaultCurrency || 'INR',
        currencySymbol: settings.currencySymbol || '₹',
        invoicePrefix: settings.invoicePrefix || 'MDIV-',
        defaultTaxRate: settings.defaultTaxRate ?? 18,
        bankDetails: {
          bankName: settings.bankDetails?.bankName || '',
          accountNumber: settings.bankDetails?.accountNumber || '',
          ifscCode: settings.bankDetails?.ifscCode || '',
          upiId: settings.bankDetails?.upiId || '',
          swiftCode: settings.bankDetails?.swiftCode || '',
        },
      });
    }
  }, [settings]);

  const currencySymbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'د.إ',
  };

  const handleCurrencyChange = (curr: 'INR' | 'USD' | 'EUR' | 'AED' | 'GBP') => {
    setFormData({
      ...formData,
      defaultCurrency: curr,
      currencySymbol: currencySymbols[curr] || '$',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(false);
    await updateSettingsMutation.mutateAsync(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const isSaving = updateSettingsMutation.isPending;

  const tabs: Array<{ id: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'profile', label: 'Agency Profile', icon: Building2 },
    { id: 'currency', label: 'Currency & Finance', icon: DollarSign },
    { id: 'bank', label: 'Bank & UPI Details', icon: Landmark },
    { id: 'invoice', label: 'Invoice Config', icon: FileText },
  ];

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
            <SettingsIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Platform & Agency Settings</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Manage your agency branding, platform currency, remittance details, and automated invoicing parameters.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 border-b border-neutral-200 dark:border-[#2A2A2A] pb-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap',
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#1A1A1A]'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="p-6 rounded-lg bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A] space-y-4 animate-pulse">
          <div className="h-6 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
          <div className="h-24 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tab 1: Agency Profile */}
          {activeTab === 'profile' && (
            <div className="p-6 rounded-lg bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A] shadow-sm space-y-5">
              <div className="border-b border-neutral-200 dark:border-[#2A2A2A] pb-3">
                <h2 className="font-heading text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-500" />
                  <span>Agency Profile & Identification</span>
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Your legal agency name, contact information, and business tax identifiers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Agency Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.agencyName}
                    onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                    placeholder="M.Div Softsolutions"
                    className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    GSTIN / Tax ID Number
                  </label>
                  <input
                    type="text"
                    value={formData.gstinOrTaxId || ''}
                    onChange={(e) => setFormData({ ...formData, gstinOrTaxId: e.target.value })}
                    placeholder="e.g. 29AAAAA0000A1Z5"
                    className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Agency Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.agencyEmail || ''}
                    onChange={(e) => setFormData({ ...formData, agencyEmail: e.target.value })}
                    placeholder="contact@mdivsoft.com"
                    className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Agency Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.agencyPhone || ''}
                    onChange={(e) => setFormData({ ...formData, agencyPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Registered Office Address
                </label>
                <textarea
                  rows={3}
                  value={formData.agencyAddress || ''}
                  onChange={(e) => setFormData({ ...formData, agencyAddress: e.target.value })}
                  placeholder="Street Address, Tech Park, City, State, PIN, Country"
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Currency & Finance */}
          {activeTab === 'currency' && (
            <div className="p-6 rounded-lg bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A] shadow-sm space-y-5">
              <div className="border-b border-neutral-200 dark:border-[#2A2A2A] pb-3">
                <h2 className="font-heading text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <span>Platform Currency & Numbering System</span>
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Set your global operating currency and default monetary symbol.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Default Operating Currency
                  </label>
                  <select
                    value={formData.defaultCurrency}
                    onChange={(e) => handleCurrencyChange(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="INR">INR (₹) - Indian Rupee (Lakhs & Crores)</option>
                    <option value="USD">USD ($) - United States Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="AED">AED (AED) - UAE Dirham</option>
                    <option value="GBP">GBP (£) - British Pound Sterling</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Active Currency Symbol
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.currencySymbol}
                    onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                    placeholder="₹"
                    className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="p-4 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-200 dark:border-[#2A2A2A] text-xs space-y-1">
                <span className="font-bold text-neutral-800 dark:text-neutral-200">
                  Current Display Example:
                </span>
                <p className="text-neutral-500">
                  Standard Format: <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">{formData.currencySymbol}1,50,000.00</span>
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Bank & UPI Details */}
          {activeTab === 'bank' && (
            <div className="p-6 rounded-lg bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A] shadow-sm space-y-5">
              <div className="border-b border-neutral-200 dark:border-[#2A2A2A] pb-3">
                <h2 className="font-heading text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-indigo-500" />
                  <span>Remittance & Bank Wire Details</span>
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Bank account and instant UPI credentials automatically displayed on client invoices for payment settlement.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Bank Institution Name
                  </label>
                  <input
                    type="text"
                    value={formData.bankDetails?.bankName || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bankDetails: { ...formData.bankDetails, bankName: e.target.value },
                      })
                    }
                    placeholder="e.g. HDFC Bank / ICICI Bank"
                    className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={formData.bankDetails?.accountNumber || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bankDetails: { ...formData.bankDetails, accountNumber: e.target.value },
                      })
                    }
                    placeholder="50200000000000"
                    className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={formData.bankDetails?.ifscCode || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bankDetails: { ...formData.bankDetails, ifscCode: e.target.value.toUpperCase() },
                      })
                    }
                    placeholder="HDFC0001234"
                    className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    value={formData.bankDetails?.upiId || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bankDetails: { ...formData.bankDetails, upiId: e.target.value },
                      })
                    }
                    placeholder="mdiv@hdfcbank"
                    className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    SWIFT / BIC Code
                  </label>
                  <input
                    type="text"
                    value={formData.bankDetails?.swiftCode || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bankDetails: { ...formData.bankDetails, swiftCode: e.target.value.toUpperCase() },
                      })
                    }
                    placeholder="HDFCINBB"
                    className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Invoice Config */}
          {activeTab === 'invoice' && (
            <div className="p-6 rounded-lg bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A] shadow-sm space-y-5">
              <div className="border-b border-neutral-200 dark:border-[#2A2A2A] pb-3">
                <h2 className="font-heading text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <span>Invoice Generation & Tax Parameters</span>
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Configure prefixing rules for invoice numbers and default GST tax rates.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Invoice Number Prefix
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.invoicePrefix}
                    onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                    placeholder="MDIV-"
                    className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Generated invoices will appear as: <span className="font-mono text-neutral-700 dark:text-neutral-300">{formData.invoicePrefix}2026-0001</span>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Default GST / Tax Rate (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      required
                      value={formData.defaultTaxRate}
                      onChange={(e) => setFormData({ ...formData, defaultTaxRate: parseFloat(e.target.value) || 0 })}
                      placeholder="18"
                      className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
