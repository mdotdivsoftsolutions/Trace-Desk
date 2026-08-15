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
  Check,
  Loader2,
} from 'lucide-react';
import { useSettings, useUpdateSettings } from '@/hooks';
import { SettingsType } from '@/types';

export default function SettingsPage() {
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white flex items-center gap-2.5">
            <SettingsIcon className="w-7 h-7 text-indigo-500" />
            <span>Agency Settings & Configuration</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Agency branding, default INR currency, GSTIN / Tax IDs, and bank wire remittance.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-48 rounded-lg bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
          <div className="h-48 rounded-lg bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Agency Profile */}
          <div className="p-6 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-500" />
              <span>Agency Brand Profile</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Agency Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.agencyName}
                  onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                  placeholder="M.Div Softsolutions"
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Agency Email
                </label>
                <input
                  type="email"
                  value={formData.agencyEmail || ''}
                  onChange={(e) => setFormData({ ...formData, agencyEmail: e.target.value })}
                  placeholder="contact@mdivsoft.com"
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.agencyPhone || ''}
                  onChange={(e) => setFormData({ ...formData, agencyPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  placeholder="29AAAAA0000A1Z5"
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Office / Registered Address
              </label>
              <textarea
                rows={2}
                value={formData.agencyAddress || ''}
                onChange={(e) => setFormData({ ...formData, agencyAddress: e.target.value })}
                placeholder="HQ Suite, Tech Boulevard, Bangalore, Karnataka, India"
                className="w-full px-3.5 py-2 rounded-lg bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Currency & Invoicing Defaults */}
          <div className="p-6 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>Currency & Billing Configuration</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Default Currency
                </label>
                <select
                  value={formData.defaultCurrency}
                  onChange={(e) => handleCurrencyChange(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="INR">INR (₹ - Indian Rupee)</option>
                  <option value="USD">USD ($ - US Dollar)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="AED">AED (د.إ - UAE Dirham)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                </select>
              </div>

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
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Default Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.defaultTaxRate}
                  onChange={(e) => setFormData({ ...formData, defaultTaxRate: parseFloat(e.target.value) || 0 })}
                  placeholder="18"
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Bank Wire & UPI Remittance Details */}
          <div className="p-6 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Landmark className="w-4 h-4 text-indigo-500" />
              <span>Remittance & Bank Settlement Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Bank Name
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
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
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
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  UPI ID (VPA)
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
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
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
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
