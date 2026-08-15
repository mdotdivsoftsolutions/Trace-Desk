'use client';

import React, { useState, useEffect } from 'react';
import { X, Milestone, Edit2, Check, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { queryKeys } from '@/hooks';
import { CreateMilestoneInput } from '@/lib/validations';
import { MilestoneType } from '@/types';

interface MilestoneFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  milestone?: MilestoneType | null;
  currency?: string;
}

export function MilestoneFormDrawer({
  isOpen,
  onClose,
  projectId,
  milestone,
  currency = 'INR',
}: MilestoneFormDrawerProps) {
  const isEditing = !!milestone;
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateMilestoneInput>({
    projectId,
    title: '',
    description: '',
    allocatedAmount: 0,
    order: 0,
    status: 'pending',
    dueDate: undefined,
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (milestone) {
      setFormData({
        projectId,
        title: milestone.title || '',
        description: milestone.description || '',
        allocatedAmount: milestone.allocatedAmount || 0,
        order: milestone.order || 0,
        status: milestone.status || 'pending',
        dueDate: milestone.dueDate ? new Date(milestone.dueDate) : undefined,
      });
    } else {
      setFormData({
        projectId,
        title: '',
        description: '',
        allocatedAmount: 0,
        order: 0,
        status: 'pending',
        dueDate: undefined,
      });
    }
    setError(null);
  }, [milestone, projectId, isOpen]);

  const createMutation = useMutation({
    mutationFn: (data: CreateMilestoneInput) =>
      apiClient.post<MilestoneType>(`/projects/${projectId}/milestones`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.milestones.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateMilestoneInput> }) =>
      apiClient.put<MilestoneType>(`/milestones/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.milestones.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics });
    },
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEditing && milestone) {
        await updateMutation.mutateAsync({
          id: milestone._id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save milestone');
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={() => {
          if (!isLoading) onClose();
        }}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md sm:max-w-lg bg-white dark:bg-[#131A2A] border-l border-neutral-200 dark:border-[#232B3D] shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-[#232B3D] flex items-center justify-between gap-3 bg-neutral-50/50 dark:bg-[#0B0F19]/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                {isEditing ? <Edit2 className="w-4 h-4" /> : <Milestone className="w-4 h-4" />}
              </div>
              <div>
                <h2 className="font-heading text-base font-bold text-neutral-900 dark:text-white">
                  {isEditing ? 'Edit Delivery Milestone' : 'Add Project Milestone'}
                </h2>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {isEditing
                    ? 'Update delivery scope and allocated milestone payout'
                    : 'Break project scope into billable delivery phases'}
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
          <form id="milestone-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Milestone Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Phase 1: Architecture & Auth Setup"
                className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Phase Deliverables & Scope
              </label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="List key requirements for this milestone to be marked complete..."
                className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Allocated Amount & Order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Allocated Amount ({currency}) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={formData.allocatedAmount || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, allocatedAmount: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0.00"
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Phase Sequence Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Status & Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Milestone Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed (Ready to Invoice)</option>
                  <option value="invoiced">Invoiced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Target Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dueDate: e.target.value ? new Date(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
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
              form="milestone-form"
              disabled={isLoading}
              className="flex items-center gap-1.5 px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>{isEditing ? 'Save Changes' : 'Add Milestone'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

export default MilestoneFormDrawer;
