'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  Building2,
  Calendar,
  DollarSign,
  GitBranch,
  ExternalLink,
  Plus,
  Layers,
  CheckCircle2,
  Clock,
  Receipt,
  Milestone,
  CheckSquare,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Edit2,
  TrendingUp,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  Globe,
  Key,
  FileText,
  Eye,
  EyeOff,
  Copy,
  Check,
} from 'lucide-react';
import {
  useProject,
  useTasks,
  useInvoices,
} from '@/hooks';
import { KanbanBoard } from '@/components/modules/tasks/KanbanBoard';
import { TaskFormDrawer } from '@/components/modules/tasks/TaskFormDrawer';
import { MilestoneFormDrawer } from '@/components/modules/milestones/MilestoneFormDrawer';
import { formatCurrency, formatDate, formatRelativeDeadline, cn } from '@/lib/utils';
import { TaskType, MilestoneType } from '@/types';

export default function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = use(params);

  const [activeTab, setActiveTab] = useState<'kanban' | 'milestones' | 'links' | 'vault' | 'scope' | 'invoices'>('kanban');
  const [showSecretMap, setShowSecretMap] = useState<Record<number, boolean>>({});
  const [copiedKeyIndex, setCopiedKeyIndex] = useState<number | null>(null);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState<'todo' | 'in_progress' | 'review' | 'done'>('todo');

  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<MilestoneType | null>(null);

  const { data: project, isLoading: isProjectLoading } = useProject(projectId);
  const { data: tasks, isLoading: isTasksLoading } = useTasks(projectId);
  const { data: invoicesData, isLoading: isInvoicesLoading } = useInvoices({ projectId, limit: 100 });
  const invoices = invoicesData?.items || [];


  if (isProjectLoading) {
    return (
      <div className="space-y-6">
        <div className="h-40 rounded-3xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        <div className="h-96 rounded-3xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-12 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold">Project Not Found</h2>
        <Link href="/projects" className="text-xs font-semibold text-indigo-600 hover:underline">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const clientName =
    typeof project.clientId === 'object' ? (project.clientId as any)?.name : 'Client';
  const clientCurrency =
    typeof project.clientId === 'object' ? (project.clientId as any)?.currency : project.currency || 'USD';

  const handleOpenCreateTask = (
    status: 'todo' | 'in_progress' | 'review' | 'done' = 'todo',
    milestoneId?: string
  ) => {
    setEditingTask(null);
    setDefaultTaskStatus(status);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: TaskType) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenCreateMilestone = () => {
    setEditingMilestone(null);
    setIsMilestoneModalOpen(true);
  };

  const handleOpenEditMilestone = (milestone: MilestoneType) => {
    setEditingMilestone(milestone);
    setIsMilestoneModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Workspace Header */}
      <div className="p-6 lg:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-6">
        {/* Breadcrumb & Client info */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <Link href="/projects" className="hover:text-indigo-600 transition-colors">
              Projects
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-neutral-800 dark:text-neutral-200 font-semibold">{project.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/projects/${projectId}/edit`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#131A2A] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors shadow-sm"
            >
              <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Edit Project</span>
            </Link>
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Repository</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-xs font-semibold text-indigo-600 dark:text-indigo-400 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Staging</span>
              </a>
            )}
          </div>
        </div>

        {/* Title, Client & Badges */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-2xl lg:text-3xl font-extrabold text-neutral-900 dark:text-white">
                {project.title}
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 capitalize">
                {project.status.replace('_', ' ')}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="flex items-center gap-1 text-neutral-700 dark:text-neutral-300 font-semibold">
                <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Client: {clientName}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                <span>Budget: {project.totalBudget ? formatCurrency(project.totalBudget, project.currency) : 'Flexible'} ({project.budgetType})</span>
              </span>
              {project.targetDeadline && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>Target: {formatDate(project.targetDeadline)}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Progress Velocity Bar */}
        <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-600 dark:text-neutral-400">
              Project Delivery Velocity
            </span>
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">
              {project.progressPercentage}% Complete
            </span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${project.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Tech Stack Badges */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-neutral-100 dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] text-neutral-700 dark:text-neutral-300"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 dark:border-[#232B3D] pb-1">
        <button
          onClick={() => setActiveTab('kanban')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-md font-bold text-xs transition-all',
            activeTab === 'kanban'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          )}
        >
          <FolderKanban className="w-4 h-4" />
          <span>Task Kanban ({tasks?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('milestones')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-md font-bold text-xs transition-all',
            activeTab === 'milestones'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          )}
        >
          <Milestone className="w-4 h-4" />
          <span>Milestones ({project.milestones?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('links')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-md font-bold text-xs transition-all',
            activeTab === 'links'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          )}
        >
          <Globe className="w-4 h-4" />
          <span>Deployment URLs ({(project.links || []).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vault')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-md font-bold text-xs transition-all',
            activeTab === 'vault'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          )}
        >
          <Key className="w-4 h-4" />
          <span>Credentials Vault ({(project.credentials || []).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('scope')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-md font-bold text-xs transition-all',
            activeTab === 'scope'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          )}
        >
          <FileText className="w-4 h-4" />
          <span>Scope & Integration</span>
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-md font-bold text-xs transition-all',
            activeTab === 'invoices'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          )}
        >
          <Receipt className="w-4 h-4" />
          <span>Invoices ({invoices?.length || 0})</span>
        </button>
      </div>

      {/* Tab 1: Task Kanban Board */}
      {activeTab === 'kanban' && (
        <KanbanBoard
          projectId={projectId}
          tasks={tasks}
          milestones={project.milestones}
          onOpenCreateTask={handleOpenCreateTask}
          onOpenEditTask={handleOpenEditTask}
        />
      )}

      {/* Tab 2: Milestones Breakdown */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Project Delivery Phases & Scope Allocation
              </h3>
              <p className="text-xs text-neutral-500">
                Segment project deliverables into budget-linked milestone phases.
              </p>
            </div>
            <button
              onClick={handleOpenCreateMilestone}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Milestone</span>
            </button>
          </div>

          {(!project.milestones || project.milestones.length === 0) ? (
            <div className="p-12 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 text-center space-y-3 bg-white/50 dark:bg-neutral-900/50">
              <Milestone className="w-8 h-8 text-indigo-500 mx-auto" />
              <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                No delivery milestones created
              </h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Break this project down into milestone phases with allocated payouts to easily generate invoices.
              </p>
              <button
                onClick={handleOpenCreateMilestone}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                Create Milestone 1
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {project.milestones.map((m: MilestoneType, index: number) => {
                const milestoneStatusColors: Record<string, string> = {
                  pending: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
                  in_progress: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
                  completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                  invoiced: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
                };

                return (
                  <div
                    key={m._id}
                    className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </span>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                          {m.title}
                        </h4>
                        <span
                          className={cn(
                            'px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider',
                            milestoneStatusColors[m.status] || 'bg-neutral-500/10 text-neutral-400'
                          )}
                        >
                          {m.status}
                        </span>
                      </div>
                      {m.description && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 pl-8">
                          {m.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pl-8 sm:pl-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100 dark:border-neutral-800">
                      <div className="text-right">
                        <div className="text-[10px] text-neutral-400">Allocated Payout</div>
                        <div className="text-sm font-extrabold text-neutral-900 dark:text-white">
                          {formatCurrency(m.allocatedAmount || 0, clientCurrency)}
                        </div>
                      </div>

                      {m.dueDate && (
                        <div className="text-right">
                          <div className="text-[10px] text-neutral-400">Due Date</div>
                          <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                            {formatDate(m.dueDate)}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => handleOpenEditMilestone(m)}
                        className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Deployment URLs & Multi-Domains */}
      {activeTab === 'links' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white">
                Deployment Domains & Environment Links
              </h3>
              <p className="text-xs text-neutral-500">
                Production web domains, API gateways, staging builds, and repository URLs.
              </p>
            </div>
            <Link
              href={`/projects/${projectId}/edit`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manage URLs</span>
            </Link>
          </div>

          {(!project.links || project.links.length === 0) ? (
            <div className="p-12 rounded-lg border border-dashed border-neutral-300 dark:border-[#232B3D] text-center space-y-3 bg-white/50 dark:bg-[#131A2A]/50">
              <Globe className="w-8 h-8 text-indigo-500 mx-auto" />
              <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                No deployment links configured yet
              </h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Add production frontend domains, backend APIs, or dev links to make them easily accessible.
              </p>
              <Link
                href={`/projects/${projectId}/edit`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Environment URLs</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.links.map((link, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-sm flex items-center justify-between gap-3 hover:border-indigo-500/40 transition-colors"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
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
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                        {link.title}
                      </h4>
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 truncate"
                    >
                      <span className="truncate">{link.url}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-md bg-neutral-100 dark:bg-[#0B0F19] text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors flex-shrink-0"
                    title="Open Link in New Tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: 3rd-Party Credentials Vault */}
      {activeTab === 'vault' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white">
                3rd-Party Service Accounts & Credential Vault
              </h3>
              <p className="text-xs text-neutral-500">
                Payment gateways, cloud infrastructure logins, and integration API secrets.
              </p>
            </div>
            <Link
              href={`/projects/${projectId}/edit`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Credential</span>
            </Link>
          </div>

          {(!project.credentials || project.credentials.length === 0) ? (
            <div className="p-12 rounded-lg border border-dashed border-neutral-300 dark:border-[#232B3D] text-center space-y-3 bg-white/50 dark:bg-[#131A2A]/50">
              <Key className="w-8 h-8 text-amber-500 mx-auto" />
              <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                No credentials stored in this project vault
              </h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Store Stripe/Razorpay keys, AWS S3, or SMTP credentials securely for this workspace.
              </p>
              <Link
                href={`/projects/${projectId}/edit`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Store Service Account</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {project.credentials.map((cred, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-neutral-100 dark:border-[#232B3D]/70 pb-2">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-500" />
                      <span className="font-heading text-xs font-bold text-neutral-900 dark:text-white">
                        {cred.serviceName}
                      </span>
                    </div>
                    {cred.environment && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-neutral-100 dark:bg-[#0B0F19] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-[#232B3D]">
                        {cred.environment}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs">
                    {cred.accountId && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                          Login / Account ID
                        </span>
                        <span className="font-mono text-neutral-800 dark:text-neutral-200 text-[11px] font-medium">
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
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setShowSecretMap((prev) => ({ ...prev, [idx]: !prev[idx] }))
                              }
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
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(cred.accessKeyOrUrl || '');
                                setCopiedKeyIndex(idx);
                                setTimeout(() => setCopiedKeyIndex(null), 2000);
                              }}
                              className="text-[10px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-0.5"
                              title="Copy Secret"
                            >
                              {copiedKeyIndex === idx ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-500" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" /> Copy
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="p-2 rounded bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-200 dark:border-[#232B3D] font-mono text-[11px] text-neutral-800 dark:text-neutral-200 truncate mt-1">
                          {showSecretMap[idx] ? cred.accessKeyOrUrl : '••••••••••••••••••••••••••••••••'}
                        </div>
                      </div>
                    )}
                  </div>

                  {cred.notes && (
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 italic pt-2 border-t border-neutral-100 dark:border-[#232B3D]/70">
                      {cred.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Scope & Integration Notes (Rich Text View) */}
      {activeTab === 'scope' && (
        <div className="space-y-6">
          {/* Scope Card */}
          <div className="p-6 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-[#232B3D]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  Project Scope & Architectural Deliverables
                </h3>
              </div>
              <Link
                href={`/projects/${projectId}/edit`}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" /> Edit Scope
              </Link>
            </div>

            {project.description ? (
              <div
                className="prose prose-xs dark:prose-invert max-w-none text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed pt-1"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />
            ) : (
              <p className="text-xs text-neutral-400 italic">
                No detailed scope recorded. Click &quot;Edit Scope&quot; to write requirements in rich text.
              </p>
            )}
          </div>

          {/* Integration Notes Card */}
          <div className="p-6 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-[#232B3D]">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-500" />
                <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  Integration Procedures & Webhooks
                </h3>
              </div>
              <Link
                href={`/projects/${projectId}/edit`}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" /> Edit Notes
              </Link>
            </div>

            {project.integrationNotes ? (
              <div
                className="prose prose-xs dark:prose-invert max-w-none text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed pt-1"
                dangerouslySetInnerHTML={{ __html: project.integrationNotes }}
              />
            ) : (
              <p className="text-xs text-neutral-400 italic">
                No integration notes documented yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tab: Linked Invoices */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Project Billing Ledger
              </h3>
              <p className="text-xs text-neutral-500">
                Invoices generated for milestones and hourly deliverables.
              </p>
            </div>
            <Link
              href="/invoices"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Invoice</span>
            </Link>
          </div>

          {(!invoices || invoices.length === 0) ? (
            <div className="p-12 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 text-center space-y-3 bg-white/50 dark:bg-neutral-900/50">
              <Receipt className="w-8 h-8 text-indigo-500 mx-auto" />
              <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                No invoices recorded for this project
              </h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Generate an invoice from completed milestones or create a direct invoice.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {invoices.map((inv) => (
                <div
                  key={inv._id}
                  className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-neutral-900 dark:text-white">
                        {inv.invoiceNumber}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 capitalize">
                        {inv.status}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500">
                      Issue: {formatDate(inv.issueDate)} • Due: {formatDate(inv.dueDate)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-extrabold text-neutral-900 dark:text-white">
                      {formatCurrency(inv.totalAmount, inv.currency)}
                    </div>
                    <div className="text-xs text-neutral-500">
                      Balance: <span className="font-semibold text-rose-500">{formatCurrency(inv.balanceDue, inv.currency)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Task Drawer */}
      <TaskFormDrawer
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        projectId={projectId}
        milestones={project.milestones}
        task={editingTask}
        defaultStatus={defaultTaskStatus}
      />

      {/* Milestone Drawer */}
      <MilestoneFormDrawer
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        projectId={projectId}
        milestone={editingMilestone}
        currency={clientCurrency}
      />
    </div>
  );
}
