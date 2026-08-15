'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { useCreateClient, useUpdateClient } from '@/hooks/useClients';
import { Client, CurrencyCode } from '@/types';
import { RichTextEditor } from '@/components/common/RichTextEditor';

interface ClientFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null;
}

export function ClientFormDrawer({ isOpen, onClose, client }: ClientFormDrawerProps) {
  const [form, setForm] = useState({
    name: '', email: '', companyName: '', phone: '', country: 'India',
    currency: 'INR' as CurrencyCode, status: 'active' as 'active' | 'inactive', notes: '',
  });
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();

  useEffect(() => {
    if (client) {
      setForm({
        name: client.name, email: client.email, companyName: client.companyName || client.company || '',
        phone: client.phone || '', country: client.country || 'India',
        currency: (client.currency as CurrencyCode) || 'INR', status: client.status, notes: client.notes || '',
      });
    } else {
      setForm({ name: '', email: '', companyName: '', phone: '', country: 'India', currency: 'INR', status: 'active', notes: '' });
    }
  }, [client, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (client) {
      await updateClientMutation.mutateAsync({ id: client._id, data: form });
    } else {
      await createClientMutation.mutateAsync(form);
    }
    onClose();
  };

  const isPending = createClientMutation.isPending || updateClientMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white dark:bg-[#1E293B] border-l border-neutral-200 dark:border-[#334155] shadow-2xl flex flex-col">
          <div className="h-16 px-6 border-b border-neutral-200 dark:border-[#334155] flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-neutral-900 dark:text-white">{client ? 'Edit Client Profile' : 'Add New Client'}</h2>
            <button onClick={onClose} className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold">Client Name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold">Email Address *</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold">Company Name</label>
                <input type="text" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold">Phone Number</label>
                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold">Country</label>
                <input type="text" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold">Currency</label>
                <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value as CurrencyCode })} className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs">
                  <option value="INR">INR (₹ Indian Rupee)</option>
                  <option value="USD">USD ($ US Dollar)</option>
                  <option value="EUR">EUR (€ Euro)</option>
                  <option value="GBP">GBP (£ Pound)</option>
                  <option value="AED">AED (د.إ Dirham)</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold">Account Notes &amp; Internal Remarks</label>
              <RichTextEditor
                value={form.notes}
                onChange={(v) => setForm({ ...form, notes: v })}
                placeholder="Internal notes about this client, billing preferences, communication history..."
              />
            </div>
            <div className="pt-4 border-t border-neutral-200 dark:border-[#334155] flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-3.5 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 text-xs font-semibold">Cancel</button>
              <button type="submit" disabled={isPending} className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold shadow-sm disabled:opacity-50">
                {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{client ? 'Save Profile' : 'Create Client'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ClientFormDrawer;
