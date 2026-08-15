'use client';

import React, { useState, useEffect } from 'react';
import { X, FolderKanban, Edit2, Check, Loader2, Plus } from 'lucide-react';
import { useCreateProject, useUpdateProject, useClients } from '@/hooks';
import { CreateProjectInput } from '@/lib/validations';
import { ProjectType } from '@/types';

interface ProjectFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project?: ProjectType | null;
  defaultClientId?: string;
}

export function ProjectFormDrawer({
  isOpen,
  onClose,
  project,
  defaultClientId,
}: ProjectFormDrawerProps) {
  const isEditing = !!project;
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const { data: clientsData } = useClients({ status: 'active', limit: 100 });
  const clients = clientsData?.items || [];

  const [formData, setFormData] = useState<CreateProjectInput>({
    clientId: defaultClientId || '',
    title: '',
    description: '',
    status: 'discovery',
    budgetType: 'fixed',
    totalBudget: 0,
    currency: 'INR',
    repoUrl: '',
    liveUrl: '',
    links: [],
    credentials: [],
    integrationNotes: '',
    techStack: [],
    progressPercentage: 0,
    startDate: undefined,
    targetDeadline: undefined,
  });

  const [techInput, setTechInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      const initialClientId =
        typeof project.clientId === 'object'
          ? (project.clientId as any)._id
          : project.clientId || defaultClientId || '';

      setFormData({
        clientId: initialClientId,
        title: project.title || '',
        description: project.description || '',
        status: project.status || 'discovery',
        budgetType: project.budgetType || 'fixed',
        totalBudget: project.totalBudget || 0,
        currency: project.currency || 'INR',
        repoUrl: project.repoUrl || '',
        liveUrl: project.liveUrl || '',
        links: (project.links as any) || [],
        credentials: project.credentials || [],
        integrationNotes: project.integrationNotes || '',
        techStack: project.techStack || [],
        progressPercentage: project.progressPercentage || 0,
        startDate: project.startDate ? new Date(project.startDate) : undefined,
        targetDeadline: project.targetDeadline ? new Date(project.targetDeadline) : undefined,
      });
    } else {
      setFormData({
        clientId: defaultClientId || '',
        title: '',
        description: '',
        status: 'discovery',
        budgetType: 'fixed',
        totalBudget: 0,
        currency: 'INR',
        repoUrl: '',
        liveUrl: '',
        links: [],
        credentials: [],
        integrationNotes: '',
        techStack: [],
        progressPercentage: 0,
        startDate: undefined,
        targetDeadline: undefined,
      });
    }
    setError(null);
  }, [project, defaultClientId, isOpen]);

  if (!isOpen) return null;

  const handleAddTech = () => {
    if (techInput.trim() && !formData.techStack?.includes(techInput.trim())) {
      setFormData({
        ...formData,
        techStack: [...(formData.techStack || []), techInput.trim()],
      });
      setTechInput('');
    }
  };

  const handleRemoveTech = (tag: string) => {
    setFormData({
      ...formData,
      techStack: (formData.techStack || []).filter((t) => t !== tag),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.clientId) {
      setError('Please select a client for this project');
      return;
    }

    try {
      if (isEditing && project) {
        await updateProjectMutation.mutateAsync({
          id: project._id,
          data: formData,
        });
      } else {
        await createProjectMutation.mutateAsync(formData);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save project');
    }
  };

  const isLoading = createProjectMutation.isPending || updateProjectMutation.isPending;

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
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md sm:max-w-xl bg-white dark:bg-[#1A1A1A] border-l border-neutral-200 dark:border-[#2A2A2A] shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-[#2A2A2A] flex items-center justify-between gap-3 bg-neutral-50/50 dark:bg-[#0A0A0A]/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                {isEditing ? <Edit2 className="w-4 h-4" /> : <FolderKanban className="w-4 h-4" />}
              </div>
              <div>
                <h2 className="font-heading text-base font-bold text-neutral-900 dark:text-white">
                  {isEditing ? 'Edit Project Workspace' : 'Create New Project'}
                </h2>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {isEditing
                    ? 'Update project scope, roadmap dates, and budgets'
                    : 'Set up a new client delivery workspace'}
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
          <form id="project-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Client Picker */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Client Account <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={formData.clientId}
                onChange={(e) => {
                  const selectedClient = clients.find((c) => c._id === e.target.value);
                  setFormData({
                    ...formData,
                    clientId: e.target.value,
                    currency: selectedClient?.currency || formData.currency || 'INR',
                  });
                }}
                className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Select Client Account --</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} {c.companyName ? `(${c.companyName})` : ''} - {c.currency}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Project Workspace Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Next.js SaaS Platform Redesign"
                className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Project Scope & Deliverables
              </label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Outline delivery goals, milestones, target architecture..."
                className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Status & Budget Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Delivery Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="discovery">Discovery</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Under Review</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Budget Structure
                </label>
                <select
                  value={formData.budgetType}
                  onChange={(e) => setFormData({ ...formData, budgetType: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="fixed">Fixed Milestone Scope</option>
                  <option value="hourly">Time & Materials (Hourly)</option>
                </select>
              </div>
            </div>

            {/* Total Budget & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Total Budget Amount
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.totalBudget || ''}
                  onChange={(e) => setFormData({ ...formData, totalBudget: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="AED">AED (AED)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            {/* Dates: Start & Target Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Project Kickoff Date
                </label>
                <input
                  type="date"
                  value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      startDate: e.target.value ? new Date(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={formData.targetDeadline ? new Date(formData.targetDeadline).toISOString().split('T')[0] : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetDeadline: e.target.value ? new Date(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Tech Stack Tag Builder */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Tech Stack Tags
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTech();
                    }
                  }}
                  placeholder="e.g. Next.js, TypeScript, Tailwind, MongoDB..."
                  className="flex-1 px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="px-3 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {formData.techStack && formData.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.techStack.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-semibold"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tag)}
                        className="text-indigo-400 hover:text-indigo-600 dark:hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Git Repository URL
                </label>
                <input
                  type="url"
                  value={formData.repoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Live Preview / Production URL
                </label>
                <input
                  type="url"
                  value={formData.liveUrl || ''}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  placeholder="https://app.com"
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </form>

          {/* Sticky Bottom Action Bar */}
          <div className="p-4 border-t border-neutral-200 dark:border-[#2A2A2A] flex items-center justify-end gap-2.5 bg-neutral-50 dark:bg-[#0A0A0A]">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1A1A1A] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="project-form"
              disabled={isLoading}
              className="flex items-center gap-1.5 px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>{isEditing ? 'Save Changes' : 'Create Workspace'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

export default ProjectFormDrawer;
