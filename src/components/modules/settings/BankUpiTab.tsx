import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, Copy, Check, Star, Building2, QrCode } from 'lucide-react';
import { Settings, BankDetailsType } from '@/types';

interface BankUpiTabProps {
  formData: Partial<Settings>;
  onChange: (field: keyof Settings, value: any) => void;
  isEditing?: boolean;
}

export function BankUpiTab({ formData, onChange, isEditing = false }: BankUpiTabProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Normalize accounts from bankAccounts or fallback to bankDetails
  const accounts: BankDetailsType[] = React.useMemo(() => {
    if (formData.bankAccounts && formData.bankAccounts.length > 0) {
      return formData.bankAccounts;
    }
    if (formData.bankDetails && (formData.bankDetails.bankName || formData.bankDetails.accountNumber || formData.bankDetails.upiId)) {
      return [
        {
          id: formData.bankDetails.id || 'bank-1',
          accountLabel: formData.bankDetails.accountLabel || 'Primary Bank Account',
          bankName: formData.bankDetails.bankName || '',
          accountName: formData.bankDetails.accountName || '',
          accountNumber: formData.bankDetails.accountNumber || '',
          ifscCode: formData.bankDetails.ifscCode || '',
          upiId: formData.bankDetails.upiId || '',
          swiftCode: formData.bankDetails.swiftCode || '',
          accountType: formData.bankDetails.accountType || 'Current',
          isPrimary: true,
        },
      ];
    }
    return [
      {
        id: 'bank-1',
        accountLabel: 'Primary Bank Account',
        bankName: '',
        accountName: '',
        accountNumber: '',
        ifscCode: '',
        upiId: '',
        swiftCode: '',
        accountType: 'Current',
        isPrimary: true,
      },
    ];
  }, [formData.bankAccounts, formData.bankDetails]);

  const updateAccountsList = (newAccounts: BankDetailsType[]) => {
    onChange('bankAccounts', newAccounts);
    // Sync the primary account to bankDetails for backward compatibility
    const primary = newAccounts.find((a) => a.isPrimary) || newAccounts[0] || {};
    onChange('bankDetails', primary);
  };

  const handleAccountChange = (index: number, field: keyof BankDetailsType, value: any) => {
    const updated = [...accounts];
    updated[index] = { ...updated[index], [field]: value };
    updateAccountsList(updated);
  };

  const handleAddAccount = () => {
    const newAccount: BankDetailsType = {
      id: `bank-${Date.now()}`,
      accountLabel: `Account #${accounts.length + 1}`,
      bankName: '',
      accountName: accounts[0]?.accountName || '',
      accountNumber: '',
      ifscCode: '',
      upiId: '',
      swiftCode: '',
      accountType: 'Current',
      isPrimary: accounts.length === 0,
    };
    updateAccountsList([...accounts, newAccount]);
  };

  const handleRemoveAccount = (index: number) => {
    if (accounts.length <= 1) return;
    const isRemovingPrimary = accounts[index].isPrimary;
    const filtered = accounts.filter((_, idx) => idx !== index);
    if (isRemovingPrimary && filtered.length > 0) {
      filtered[0].isPrimary = true;
    }
    updateAccountsList(filtered);
  };

  const handleSetPrimary = (index: number) => {
    const updated = accounts.map((acc, idx) => ({
      ...acc,
      isPrimary: idx === index,
    }));
    updateAccountsList(updated);
  };

  const handleCopyAccountInfo = async (account: BankDetailsType, id: string) => {
    const lines = [
      `=== ${account.accountLabel || 'BANK & UPI REMITTANCE DETAILS'} ===`,
      account.bankName ? `Bank Name: ${account.bankName}` : null,
      account.accountName ? `Beneficiary / A/C Name: ${account.accountName}` : null,
      account.accountNumber ? `Account Number: ${account.accountNumber}` : null,
      account.ifscCode ? `IFSC Code: ${account.ifscCode}` : null,
      account.swiftCode ? `SWIFT / BIC: ${account.swiftCode}` : null,
      account.accountType ? `Account Type: ${account.accountType}` : null,
      account.upiId ? `UPI ID / VPA: ${account.upiId}` : null,
    ].filter(Boolean);

    const fullText = lines.join('\n');
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy remittance details:', err);
    }
  };

  const inputClass = `w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white transition-colors ${
    isEditing
      ? 'focus:outline-none focus:ring-2 focus:ring-neutral-400 bg-white dark:bg-[#0B1120]'
      : 'cursor-not-allowed opacity-90 bg-neutral-100/70 dark:bg-[#0F172A]/50 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
  }`;

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="p-6 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-neutral-500" />
            <span>Remittance, Bank & UPI Payout Details</span>
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Configure multiple bank accounts and UPI IDs. These details can be rendered on client invoices and copied instantly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing && (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
              View Only
            </span>
          )}
          {isEditing && (
            <button
              type="button"
              onClick={handleAddAccount}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Bank / UPI</span>
            </button>
          )}
        </div>
      </div>

      {/* Account Cards List */}
      <div className="space-y-4">
        {accounts.map((account, index) => {
          const cardId = account.id || `account-${index}`;
          const isCopied = copiedId === cardId;

          return (
            <div
              key={cardId}
              className={`p-6 rounded-lg bg-white dark:bg-[#1E293B] border shadow-sm transition-all space-y-5 ${
                account.isPrimary
                  ? 'border-neutral-900 dark:border-neutral-400 ring-1 ring-neutral-900/10 dark:ring-white/10'
                  : 'border-neutral-200 dark:border-[#334155]'
              }`}
            >
              {/* Account Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-[#334155]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-sm font-bold text-neutral-900 dark:text-white">
                        {account.accountLabel || `Bank Account #${index + 1}`}
                      </span>
                      {account.isPrimary && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          Primary Default
                        </span>
                      )}
                    </div>
                    {account.bankName && (
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        {account.bankName} {account.accountNumber ? `• Ending with ${account.accountNumber.slice(-4)}` : ''}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Copy whole section info button */}
                  <button
                    type="button"
                    onClick={() => handleCopyAccountInfo(account, cardId)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition ${
                      isCopied
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700'
                        : 'bg-white dark:bg-[#0F172A] text-neutral-700 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                    title="Copy full remittance details to clipboard"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Copied Details!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Copy Details</span>
                      </>
                    )}
                  </button>

                  {isEditing && (
                    <>
                      {!account.isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(index)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 transition"
                        >
                          <Star className="w-3 h-3 text-neutral-400" />
                          <span>Make Primary</span>
                        </button>
                      )}

                      {accounts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAccount(index)}
                          className="p-1.5 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 border border-transparent hover:border-red-200 dark:hover:border-red-900/40 transition"
                          title="Remove bank account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Account Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Account Label / Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Primary Remittance / INR Current"
                    disabled={!isEditing}
                    value={account.accountLabel || ''}
                    onChange={(e) => handleAccountChange(index, 'accountLabel', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC Bank, State Bank of India"
                    disabled={!isEditing}
                    value={account.bankName || ''}
                    onChange={(e) => handleAccountChange(index, 'bankName', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Account Beneficiary Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. M.Div Softsolutions Pvt Ltd"
                    disabled={!isEditing}
                    value={account.accountName || ''}
                    onChange={(e) => handleAccountChange(index, 'accountName', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Account Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 50200012345678"
                    disabled={!isEditing}
                    value={account.accountNumber || ''}
                    onChange={(e) => handleAccountChange(index, 'accountNumber', e.target.value)}
                    className={`${inputClass} font-mono`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    IFSC / Branch Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC0000123"
                    disabled={!isEditing}
                    value={account.ifscCode || ''}
                    onChange={(e) => handleAccountChange(index, 'ifscCode', e.target.value)}
                    className={`${inputClass} font-mono uppercase`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    SWIFT / BIC Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HDFCINBBXXX"
                    disabled={!isEditing}
                    value={account.swiftCode || ''}
                    onChange={(e) => handleAccountChange(index, 'swiftCode', e.target.value)}
                    className={`${inputClass} font-mono uppercase`}
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-neutral-500" />
                    <span>UPI ID / VPA (Instant QR Billing)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. mdotdiv@okhdfcbank"
                    disabled={!isEditing}
                    value={account.upiId || ''}
                    onChange={(e) => handleAccountChange(index, 'upiId', e.target.value)}
                    className={`${inputClass} font-mono`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BankUpiTab;
