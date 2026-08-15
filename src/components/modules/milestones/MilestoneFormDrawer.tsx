'use client';

import React, { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { Milestone, MilestoneStatus } from '@/types';
import { useCreateMilestone, useUpdateMilestone } from '@/hooks';
import { RichTextEditor } from '@/components/common/RichTextEditor';

interface MilestoneFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  milestone?: Milestone | null;
}

interface MilestoneFormDrawerContentProps {
  onClose: () => void;
  projectId: string;
  milestone?: Milestone | null;
}

function MilestoneFormDrawerContent({ onClose, projectId, milestone }: MilestoneFormDrawerContentProps) {
  const initialAmt = milestone ? (milestone.allocatedAmount ?? milestone.amount ?? 0) : 0;
  const [form, setForm] = useState({
    title: milestone?.title || '',
    description: milestone?.description || '',
    amount: initialAmt,
    status: (milestone?.status || 'pending') as MilestoneStatus,
    dueDate: milestone?.dueDate ? new Date(milestone.dueDate).toISOString().split('T')[0] : '',
  });

  const createMilestoneMutation = useCreateMilestone();
  const updateMilestoneMutation = useUpdateMilestone();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(form.amount) || 0;
    const payload = {
      title: form.title,
      description: form.description || undefined,
      amount: numAmount,
      allocatedAmount: numAmount,
      status: form.status,
      dueDate: form.dueDate ? new Date(form.dueDate) : undefined,
    };
    if (milestone) {
      await updateMilestoneMutation.mutateAsync({ id: milestone._id, projectId, data: payload });
    } else {
      await createMilestoneMutation.mutateAsync({ projectId, ...payload });
    }
    onClose();
  };

  const isPending = createMilestoneMutation.isPending || updateMilestoneMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#1E293B] border-l border-neutral-200 dark:border-[#334155] shadow-2xl flex flex-col h-full">
          {/* Header */}
          <div className="h-16 px-6 border-b border-neutral-200 dark:border-[#334155] flex items-center justify-between flex-shrink-0">
            <h2 className="font-heading text-base font-bold text-neutral-900 dark:text-white">
              {milestone ? 'Edit Milestone Phase' : 'Add Milestone Phase'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Scrollable Fields */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold">Phase Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.amount === 0 ? '0' : form.amount || ''}
                    onChange={(e) => setForm({ ...form, amount: e.target.value === '' ? 0 : Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-mono font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as MilestoneStatus })}
                    className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="invoiced">Invoiced</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold">Target Delivery Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold">Scope of Deliverable</label>
                <RichTextEditor
                  value={form.description}
                  onChange={(v) => setForm({ ...form, description: v })}
                  placeholder="Describe the phase deliverables..."
                />
              </div>
            </div>

            {/* Pinned Bottom-Right Action Toolbar */}
            <div className="p-4 px-6 border-t border-neutral-200 dark:border-[#334155] bg-neutral-50/60 dark:bg-[#0F172A]/60 flex items-center justify-end gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
              >
                {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{milestone ? 'Save Milestone' : 'Create Milestone'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function MilestoneFormDrawer({ isOpen, onClose, projectId, milestone }: MilestoneFormDrawerProps) {
  if (!isOpen) return null;

  return (
    <MilestoneFormDrawerContent
      key={milestone?._id || `${projectId}-new-milestone`}
      onClose={onClose}
      projectId={projectId}
      milestone={milestone}
    />
  );
}

export default MilestoneFormDrawer;
