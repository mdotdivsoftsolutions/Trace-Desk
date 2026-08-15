'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  FolderKanban,
  Building2,
  Globe,
  Key,
  FileText,
  Plus,
  Trash2,
  Check,
  Loader2,
  Eye,
  EyeOff,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useCreateProject, useClients } from '@/hooks';
import { CreateProjectInput, ProjectLinkInput, ProjectCredentialInput } from '@/lib/validations';
import { RichTextEditor } from '@/components/common/RichTextEditor';

export default function NewProjectPage() {
  const router = useRouter();
  const createProjectMutation = useCreateProject();
  const { data: clientsData, isLoading: isClientsLoading } = useClients({ status: 'active', limit: 100 });
  const clients = clientsData?.items || [];

  const [formData, setFormData] = useState<CreateProjectInput>({
    clientId: '',
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
  const [showSecretMap, setShowSecretMap] = useState<Record<number, boolean>>({});

  // Dynamic Link Input State
  const [newLink, setNewLink] = useState<ProjectLinkInput>({
    title: '',
    url: '',
    category: 'production',
  });

  // Dynamic Credential Input State
  const [newCred, setNewCred] = useState<ProjectCredentialInput>({
    serviceName: '',
    accountId: '',
    accessKeyOrUrl: '',
    environment: 'Production',
    notes: '',
  });

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

  const handleAddLink = () => {
    if (!newLink.title.trim() || !newLink.url.trim()) return;
    setFormData({
      ...formData,
      links: [...(formData.links || []), { ...newLink }],
    });
    setNewLink({ title: '', url: '', category: 'production' });
  };

  const handleRemoveLink = (index: number) => {
    setFormData({
      ...formData,
      links: (formData.links || []).filter((_, i) => i !== index),
    });
  };

  const handleAddCredential = () => {
    if (!newCred.serviceName.trim()) return;
    setFormData({
      ...formData,
      credentials: [...(formData.credentials || []), { ...newCred }],
    });
    setNewCred({
      serviceName: '',
      accountId: '',
      accessKeyOrUrl: '',
      environment: 'Production',
      notes: '',
    });
  };

  const handleRemoveCredential = (index: number) => {
    setFormData({
      ...formData,
      credentials: (formData.credentials || []).filter((_, i) => i !== index),
    });
  };

  const toggleSecretVisibility = (index: number) => {
    setShowSecretMap((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.clientId) {
      setError('Please select a client account for this project');
      return;
    }

    if (!formData.title.trim()) {
      setError('Project title is required');
      return;
    }

    try {
      const created = await createProjectMutation.mutateAsync(formData);
      router.push(`/projects/${created._id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create project workspace');
    }
  };

  const isSubmitting = createProjectMutation.isPending;

  return (
    <div className="w-full space-y-8 pb-20 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-[#232B3D]">
        <div className="space-y-1">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Projects</span>
          </Link>
          <h1 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>New Project Workspace</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Set up delivery milestones, multi-domain deployment links, credentials vault, and rich scopes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/projects"
            className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#131A2A] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            form="new-project-form"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>Create Project Workspace</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
          {error}
        </div>
      )}

      <form id="new-project-form" onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: General & Financial Setup */}
        <div className="p-6 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-200 dark:border-[#232B3D]">
            <Building2 className="w-4 h-4 text-indigo-500" />
            <h2 className="font-heading text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              1. General & Financial Setup
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Client Account */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
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
                className="w-full px-3.5 py-2.5 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Select Client Account --</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} {c.companyName ? `(${c.companyName})` : ''} - {c.currency}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Title */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Project Workspace Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Next.js Multi-Tenant SaaS Platform"
                className="w-full px-3.5 py-2.5 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Delivery Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="discovery">Discovery & Planning</option>
                <option value="in_progress">In Progress (Active)</option>
                <option value="review">Under Review / QA</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>

            {/* Budget Structure */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Budget Structure
              </label>
              <select
                value={formData.budgetType}
                onChange={(e) => setFormData({ ...formData, budgetType: e.target.value as any })}
                className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="fixed">Fixed Milestone Scope</option>
                <option value="hourly">Time & Materials (Hourly)</option>
              </select>
            </div>

            {/* Total Budget & Currency */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Total Budget ({formData.currency})
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.totalBudget || ''}
                  onChange={(e) => setFormData({ ...formData, totalBudget: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="flex-1 px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-24 px-2 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="AED">AED</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Kickoff & Deadline Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Kickoff Date
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
                className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
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
                className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Tech Stack Tag Builder */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Technology Stack
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
                placeholder="Type tech name and press Enter (e.g. Next.js, Node.js, Stripe, PostgreSQL)..."
                className="flex-1 px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-3.5 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {formData.techStack && formData.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
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
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: Project Scope & Deliverables (Rich Text Editor) */}
        <div className="p-6 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-200 dark:border-[#232B3D]">
            <FileText className="w-4 h-4 text-indigo-500" />
            <h2 className="font-heading text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              2. Scope, Architecture & Deliverables
            </h2>
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Detail project specifications, technical roadmap, API endpoints, and delivery acceptance criteria.
          </p>

          <RichTextEditor
            value={formData.description || ''}
            onChange={(html) => setFormData({ ...formData, description: html })}
            placeholder="Outline project scope, deliverables, feature requirements, and technical architectural guidelines..."
            minHeight="180px"
          />
        </div>

        {/* SECTION 3: Multi-Environment Deployment & Service URLs */}
        <div className="p-6 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-[#232B3D]">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-500" />
              <h2 className="font-heading text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                3. Deployment Domains & Environment URLs
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-neutral-400">
              {(formData.links || []).length} URLs Configured
            </span>
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Keep track of production frontend domains, backend API servers, staging setups, repository branches, and Figma boards.
          </p>

          {/* Links List */}
          {formData.links && formData.links.length > 0 && (
            <div className="space-y-2">
              {formData.links.map((link, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-3 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-200 dark:border-[#232B3D]"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider border ${
                        link.category === 'production'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : link.category === 'staging'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                          : link.category === 'api'
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                          : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20'
                      }`}
                    >
                      {link.category || 'production'}
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white block truncate">
                        {link.title}
                      </span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 truncate"
                      >
                        <span className="truncate">{link.url}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveLink(idx)}
                    className="p-1.5 text-neutral-400 hover:text-rose-500 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Link Row Form */}
          <div className="p-4 rounded-md bg-neutral-50/70 dark:bg-[#0B0F19]/70 border border-dashed border-neutral-300 dark:border-neutral-700 space-y-3">
            <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider block">
              + Add Deployment Link / Domain
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  placeholder="e.g. Prod Frontend"
                  className="w-full px-3 py-2 rounded-md bg-white dark:bg-[#131A2A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={newLink.category}
                  onChange={(e) => setNewLink({ ...newLink, category: e.target.value as any })}
                  className="w-full px-2.5 py-2 rounded-md bg-white dark:bg-[#131A2A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="production">Production Domain</option>
                  <option value="api">Backend API / Server</option>
                  <option value="staging">Staging / QA</option>
                  <option value="development">Dev Environment</option>
                  <option value="repository">GitHub / Git Repo</option>
                  <option value="design">Figma / Design</option>
                  <option value="other">Other Link</option>
                </select>
              </div>

              <div className="sm:col-span-5">
                <input
                  type="url"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  placeholder="https://app.clientdomain.com"
                  className="w-full px-3 py-2 rounded-md bg-white dark:bg-[#131A2A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="sm:col-span-1 flex items-center">
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="w-full py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center font-bold shadow-sm"
                  title="Add Link"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: 3rd-Party Service Accounts & Credentials Vault */}
        <div className="p-6 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-[#232B3D]">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <h2 className="font-heading text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                4. 3rd-Party Service Accounts & Credential Vault
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-neutral-400">
              {(formData.credentials || []).length} Services Stored
            </span>
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Securely store project payment gateways (Stripe, Razorpay), cloud accounts (AWS, Vercel, Supabase), SMTP keys, and third-party logins.
          </p>

          {/* Credentials List */}
          {formData.credentials && formData.credentials.length > 0 && (
            <div className="space-y-2.5">
              {formData.credentials.map((cred, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-200 dark:border-[#232B3D] space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {cred.serviceName}
                      </span>
                      {cred.environment && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                          {cred.environment}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveCredential(idx)}
                      className="p-1 text-neutral-400 hover:text-rose-500 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {cred.accountId && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                          Account ID / User
                        </span>
                        <span className="font-mono text-neutral-800 dark:text-neutral-200 text-[11px]">
                          {cred.accountId}
                        </span>
                      </div>
                    )}

                    {cred.accessKeyOrUrl && (
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-neutral-400">
                            Key / Token / Secret
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleSecretVisibility(idx)}
                            className="text-[10px] text-indigo-500 hover:underline flex items-center gap-0.5"
                          >
                            {showSecretMap[idx] ? (
                              <>
                                <EyeOff className="w-3 h-3" /> Hide
                              </>
                            ) : (
                              <>
                                <Eye className="w-3 h-3" /> Show
                              </>
                            )}
                          </button>
                        </div>
                        <span className="font-mono text-neutral-800 dark:text-neutral-200 text-[11px] block truncate">
                          {showSecretMap[idx]
                            ? cred.accessKeyOrUrl
                            : '••••••••••••••••••••••••'}
                        </span>
                      </div>
                    )}
                  </div>

                  {cred.notes && (
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 italic pt-1 border-t border-neutral-200/50 dark:border-neutral-800/50">
                      {cred.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add Credential Form Row */}
          <div className="p-4 rounded-md bg-neutral-50/70 dark:bg-[#0B0F19]/70 border border-dashed border-neutral-300 dark:border-neutral-700 space-y-3">
            <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider block">
              + Store 3rd-Party Service / API Key
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="text"
                value={newCred.serviceName}
                onChange={(e) => setNewCred({ ...newCred, serviceName: e.target.value })}
                placeholder="Service (e.g. Stripe Gateway, AWS S3)"
                className="px-3 py-2 rounded-md bg-white dark:bg-[#131A2A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="text"
                value={newCred.accountId || ''}
                onChange={(e) => setNewCred({ ...newCred, accountId: e.target.value })}
                placeholder="Login Email / Account ID"
                className="px-3 py-2 rounded-md bg-white dark:bg-[#131A2A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="text"
                value={newCred.environment || ''}
                onChange={(e) => setNewCred({ ...newCred, environment: e.target.value })}
                placeholder="Env (e.g. Production / Sandbox)"
                className="px-3 py-2 rounded-md bg-white dark:bg-[#131A2A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <div className="sm:col-span-6">
                <input
                  type="text"
                  value={newCred.accessKeyOrUrl || ''}
                  onChange={(e) => setNewCred({ ...newCred, accessKeyOrUrl: e.target.value })}
                  placeholder="API Secret Key / Token / Endpoint URL"
                  className="w-full px-3 py-2 rounded-md bg-white dark:bg-[#131A2A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="sm:col-span-5">
                <input
                  type="text"
                  value={newCred.notes || ''}
                  onChange={(e) => setNewCred({ ...newCred, notes: e.target.value })}
                  placeholder="Remarks (e.g. webhook secret for invoices)"
                  className="w-full px-3 py-2 rounded-md bg-white dark:bg-[#131A2A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-1 flex items-center">
                <button
                  type="button"
                  onClick={handleAddCredential}
                  className="w-full py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center font-bold shadow-sm"
                  title="Add Credential"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: Integration & Webhook Setup Notes (Rich Text Editor) */}
        <div className="p-6 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-200 dark:border-[#232B3D]">
            <Key className="w-4 h-4 text-indigo-500" />
            <h2 className="font-heading text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              5. Integration Procedures & Webhook Notes
            </h2>
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Document webhooks listeners, OAuth callback URLs, server IP whitelists, and 3rd-party integration steps.
          </p>

          <RichTextEditor
            value={formData.integrationNotes || ''}
            onChange={(html) => setFormData({ ...formData, integrationNotes: html })}
            placeholder="Add integration checklists, webhook secret references, payment gateway callback URLs..."
            minHeight="140px"
          />
        </div>

        {/* Bottom Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-[#232B3D]">
          <Link
            href="/projects"
            className="px-5 py-2.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#131A2A] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>Create Project Workspace</span>
          </button>
        </div>
      </form>
    </div>
  );
}
