'use client';

import React, { useState, useEffect } from 'react';
import { X, UserPlus, Edit2, Check, Loader2 } from 'lucide-react';
import { useCreateClient, useUpdateClient } from '@/hooks';
import { CreateClientInput } from '@/lib/validations';
import { ClientType } from '@/types';

interface ClientFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  client?: ClientType | null;
}

export function ClientFormDrawer({ isOpen, onClose, client }: ClientFormDrawerProps) {
  const isEditing = !!client;
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();

  const [formData, setFormData] = useState<CreateClientInput>({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    country: '',
    currency: 'INR',
    notes: '',
    status: 'active',
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        companyName: client.companyName || '',
        email: client.email || '',
        phone: client.phone || '',
        country: client.country || '',
        currency: client.currency || 'INR',
        notes: client.notes || '',
        status: client.status || 'active',
      });
    } else {
      setFormData({
        name: '',
        companyName: '',
        email: '',
        phone: '',
        country: '',
        currency: 'INR',
        notes: '',
        status: 'active',
      });
    }
    setError(null);
  }, [client, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEditing && client) {
        await updateClientMutation.mutateAsync({
          id: client._id,
          data: formData,
        });
      } else {
        await createClientMutation.mutateAsync(formData);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save client profile');
    }
  };

  const isLoading = createClientMutation.isPending || updateClientMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={() => {
          if (!isLoading) onClose();
        }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        {/* Slide-over Drawer Panel */}
        <div className="w-screen max-w-md sm:max-w-lg bg-white dark:bg-[#131A2A] border-l border-neutral-200 dark:border-[#232B3D] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-neutral-200 dark:border-[#232B3D] flex items-center justify-between gap-3 bg-neutral-50/50 dark:bg-[#0B0F19]/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                {isEditing ? <Edit2 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              </div>
              <div>
                <h2 className="font-heading text-base font-bold text-neutral-900 dark:text-white">
                  {isEditing ? 'Edit Client Account' : 'New Client Account'}
                </h2>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {isEditing
                    ? 'Update contact info, currency, and account status'
                    : 'Add a new client to start tracking workspaces and billings'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Scrollable Body */}
          <form id="client-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Contact / Representative Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Alex Morgan"
                className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Company / Organization Name
              </label>
              <input
                type="text"
                value={formData.companyName || ''}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Apex Global Corp"
                className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@apex.com"
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Country & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Country / Region
                </label>
                <input
                  type="text"
                  value={formData.country || ''}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g. India / United States"
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Default Billing Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="INR">INR (₹ - Indian Rupee)</option>
                  <option value="USD">USD ($ - US Dollar)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="AED">AED (AED - Dirham)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                </select>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Account Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="active">Active Client</option>
                <option value="inactive">Inactive / Archived</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Internal Account Notes
              </label>
              <textarea
                rows={3}
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Key stakeholders, preferred communication channels, billing terms..."
                className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </form>

          {/* Sticky Bottom Action Bar */}
          <div className="p-4 border-t border-neutral-200 dark:border-[#232B3D] flex items-center justify-end gap-2.5 bg-neutral-50 dark:bg-[#0B0F19]">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#131A2A] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="client-form"
              disabled={isLoading}
              className="flex items-center gap-1.5 px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>{isEditing ? 'Save Changes' : 'Create Account'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientFormDrawer;
