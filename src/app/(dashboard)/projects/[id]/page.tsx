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
  CreditCard,
  LayoutGrid,
  List,
  Mail,
  Phone,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import {
  useProject,
  useTasks,
  useInvoices,
} from '@/hooks';
import { KanbanBoard } from '@/components/modules/tasks/KanbanBoard';
import { TaskFormDrawer } from '@/components/modules/tasks/TaskFormDrawer';
import { MilestoneFormDrawer } from '@/components/modules/milestones/MilestoneFormDrawer';
import { RecordPaymentDrawer } from '@/components/modules/payments/RecordPaymentDrawer';
import { formatCurrency, formatDate, formatRelativeDeadline, cn } from '@/lib/utils';
import { TaskType, MilestoneType, InvoiceType } from '@/types';

export default function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = use(params);

  const [activeTab, setActiveTab] = useState<'milestones' | 'tasks' | 'financials' | 'links' | 'vault' | 'scope'>('milestones');
  const [taskViewMode, setTaskViewMode] = useState<'kanban' | 'list'>('kanban');
  const [showSecretMap, setShowSecretMap] = useState<Record<number, boolean>>({});
  const [copiedKeyIndex, setCopiedKeyIndex] = useState<number | null>(null);

  // Drawers state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState<'todo' | 'in_progress' | 'review' | 'done'>('todo');

  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<MilestoneType | null>(null);

  const [selectedPaymentInvoice, setSelectedPaymentInvoice] = useState<InvoiceType | null>(null);

  const { data: project, isLoading: isProjectLoading } = useProject(projectId);
  const { data: tasks, isLoading: isTasksLoading } = useTasks(projectId);
  const { data: invoicesData, isLoading: isInvoicesLoading } = useInvoices({ projectId, limit: 100 });
  const invoices = invoicesData?.items || [];

  if (isProjectLoading) {
    return (
      <div className="w-full space-y-6 animate-pulse">
        <div className="h-40 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-28 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-96 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-12 text-center space-y-4 rounded-lg bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A]">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="font-heading text-lg font-bold text-neutral-900 dark:text-white">Project Not Found</h2>
        <Link href="/projects" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects Directory
        </Link>
      </div>
    );
  }

  const clientId =
    typeof project.clientId === 'object' ? (project.clientId as any)?._id : project.clientId;
  const clientObj = typeof project.clientId === 'object' ? (project.clientId as any) : null;
  const clientName = clientObj?.name || 'Client';
  const clientCompany = clientObj?.companyName || '';
  const clientEmail = clientObj?.email || '';
  const clientPhone = clientObj?.phone || '';
  const clientCurrency = clientObj?.currency || project.currency || 'INR';

  // Financial calculations
  const totalInvoiced = invoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
  const totalPaid = invoices.reduce((acc, inv) => acc + ((inv.totalAmount || 0) - (inv.balanceDue || 0)), 0);
  const totalOutstanding = invoices.reduce((acc, inv) => acc + (inv.balanceDue || 0), 0);
  const remainingUnbilled = (project.totalBudget || 0) > totalInvoiced ? (project.totalBudget || 0) - totalInvoiced : 0;

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

  const milestoneStatusColors: Record<string, string> = {
    pending: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
    in_progress: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    completed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    invoiced: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 font-bold',
    paid: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20 font-bold',
  };

  const invoiceStatusStyles: Record<string, string> = {
    paid: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    partially_paid: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    sent: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    overdue: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-bold',
    draft: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
    cancelled: 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20 line-through',
  };

  const taskPriorityStyles: Record<string, string> = {
    urgent: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-bold',
    high: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    medium: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    low: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {/* Top Workspace Header */}
      <div className="p-6 rounded-lg bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A] shadow-sm space-y-6">
        {/* Breadcrumb & Top External Links */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <Link href="/projects" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Projects</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-neutral-800 dark:text-neutral-200 font-semibold">{project.title}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-[#0A0A0A] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-[#2A2A2A] transition-colors"
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Staging</span>
              </a>
            )}
            <Link
              href={`/projects/${projectId}/edit`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1A1A1A] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors shadow-sm"
            >
              <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Edit Project</span>
            </Link>
          </div>
        </div>

        {/* Title, Status & Top Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-2xl lg:text-3xl font-extrabold text-neutral-900 dark:text-white">
                {project.title}
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                {project.status.replace('_', ' ')}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="flex items-center gap-1 text-neutral-700 dark:text-neutral-300 font-semibold">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                <span>Budget: {project.totalBudget ? formatCurrency(project.totalBudget, project.currency) : 'Flexible'} ({project.budgetType})</span>
              </span>
              {project.startDate && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Kickoff: {formatDate(project.startDate)}</span>
                  </span>
                </>
              )}
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

          {/* Action Buttons: Add Task / Add Milestone */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleOpenCreateTask()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1A1A1A] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-xs transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-500" />
              <span>Add Task</span>
            </button>

            <button
              onClick={handleOpenCreateMilestone}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Milestone</span>
            </button>
          </div>
        </div>

        {/* Dynamic Progress Velocity Bar */}
        <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-[#2A2A2A]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-600 dark:text-neutral-400">
              Project Delivery Velocity
            </span>
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-sm font-mono">
              {project.progressPercentage}% Complete
            </span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-[#0A0A0A] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${project.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Tech Stack Badges */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-neutral-100 dark:bg-[#0A0A0A] border border-neutral-200 dark:border-[#2A2A2A] text-neutral-700 dark:text-neutral-300"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 2. Mini Client Snapshot Card (Bi-directional Linking) */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-900/10 via-purple-900/5 to-transparent dark:from-indigo-950/40 dark:via-[#1A1A1A] dark:to-[#1A1A1A] border border-indigo-200 dark:border-indigo-900/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-md shadow-indigo-600/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                Client Account Snapshot
              </span>
            </div>
            <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white">
              {clientName} {clientCompany ? `(${clientCompany})` : ''}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
              {clientEmail && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-indigo-500" />
                  <span>{clientEmail}</span>
                </span>
              )}
              {clientPhone && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-indigo-500" />
                    <span>{clientPhone}</span>
                  </span>
                </>
              )}
              <span>•</span>
              <span className="font-mono text-neutral-700 dark:text-neutral-300 font-semibold">
                Billing Currency: {clientCurrency}
              </span>
            </div>
          </div>
        </div>

        {clientId && (
          <Link
            href={`/clients/${clientId}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-white dark:bg-[#1A1A1A] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all shadow-sm flex-shrink-0 self-start sm:self-auto"
          >
            <span>View Client Profile</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Workspace Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 dark:border-[#2A2A2A] pb-1">
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
          <span>Milestones & Deliverables ({project.milestones?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-md font-bold text-xs transition-all',
            activeTab === 'tasks'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          )}
        >
          <FolderKanban className="w-4 h-4" />
          <span>Tasks ({tasks?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('financials')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-md font-bold text-xs transition-all',
            activeTab === 'financials'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          )}
        >
          <Receipt className="w-4 h-4" />
          <span>Financials & Invoices ({invoices.length})</span>
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
          <span>Scope & Architecture</span>
        </button>
      </div>

      {/* TAB 1: Milestones & Deliverables */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white">
                Project Deliverable Milestones
              </h3>
              <p className="text-xs text-neutral-500">
                Segment deliverables into billing stages and invoice directly upon sign-off.
              </p>
            </div>
            <button
              onClick={handleOpenCreateMilestone}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Milestone</span>
            </button>
          </div>

          {(!project.milestones || project.milestones.length === 0) ? (
            <div className="p-12 rounded-lg border border-dashed border-neutral-300 dark:border-[#2A2A2A] text-center space-y-3 bg-white/50 dark:bg-[#1A1A1A]/50">
              <Milestone className="w-8 h-8 text-indigo-500 mx-auto" />
              <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                No milestones defined for this workspace
              </h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Break project milestones into scoped delivery phases and allocate budget amounts.
              </p>
              <button
                onClick={handleOpenCreateMilestone}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Milestone</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {project.milestones.map((m, index) => {
                return (
                  <div
                    key={m._id || index}
                    className="p-4 rounded-lg bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-500/40 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </div>
                        <h4 className="font-heading font-bold text-sm text-neutral-900 dark:text-white truncate">
                          {m.title}
                        </h4>
                        <span
                          className={cn(
                            'px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider',
                            milestoneStatusColors[m.status] || 'bg-neutral-500/10 text-neutral-400'
                          )}
                        >
                          {m.status}
                        </span>
                      </div>
                      {m.description && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 pl-9">
                          {m.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-5 pl-9 sm:pl-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100 dark:border-[#2A2A2A]">
                      <div className="text-right">
                        <div className="text-[10px] text-neutral-400 font-bold uppercase">Allocated Budget</div>
                        <div className="text-sm font-mono font-extrabold text-neutral-900 dark:text-white">
                          {formatCurrency(m.allocatedAmount || 0, clientCurrency)}
                        </div>
                      </div>

                      {m.dueDate && (
                        <div className="text-right">
                          <div className="text-[10px] text-neutral-400 font-bold uppercase">Target Date</div>
                          <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                            {formatDate(m.dueDate)}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/invoices/new?projectId=${projectId}&milestoneId=${m._id}`}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-[11px] font-bold transition-colors border border-indigo-200 dark:border-indigo-900/50"
                          title="Generate Invoice for Milestone"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Invoice</span>
                        </Link>

                        <button
                          onClick={() => handleOpenEditMilestone(m)}
                          className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          title="Edit Milestone"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Tasks (Kanban & List Toggle) */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white">
                Task Workspace & Delivery Items
              </h3>
              <p className="text-xs text-neutral-500">
                Track issues, feature backlog, in-flight work, and peer reviews.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center p-1 rounded-md bg-neutral-100 dark:bg-[#0A0A0A] border border-neutral-200 dark:border-[#2A2A2A]">
                <button
                  onClick={() => setTaskViewMode('kanban')}
                  className={cn(
                    'p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all',
                    taskViewMode === 'kanban'
                      ? 'bg-white dark:bg-[#1A1A1A] text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                  )}
                  title="Kanban Board"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Kanban</span>
                </button>
                <button
                  onClick={() => setTaskViewMode('list')}
                  className={cn(
                    'p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all',
                    taskViewMode === 'list'
                      ? 'bg-white dark:bg-[#1A1A1A] text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                  )}
                  title="Task List"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>

              <button
                onClick={() => handleOpenCreateTask()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {taskViewMode === 'kanban' ? (
            <KanbanBoard
              projectId={projectId}
              tasks={tasks || []}
              milestones={project.milestones || []}
              onOpenCreateTask={handleOpenCreateTask}
              onOpenEditTask={handleOpenEditTask}
            />
          ) : (
            <div className="rounded-lg bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A] shadow-sm overflow-hidden">
              {(!tasks || tasks.length === 0) ? (
                <div className="p-12 text-center text-xs text-neutral-500">
                  No tasks created in this workspace yet. Click &quot;Add Task&quot; to begin.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-50 dark:bg-[#0A0A0A] border-b border-neutral-200 dark:border-[#2A2A2A] text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-5 py-3">Task</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Priority</th>
                        <th className="px-5 py-3">Milestone</th>
                        <th className="px-5 py-3">Due Date</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-[#2A2A2A]/70 font-medium">
                      {tasks.map((task) => (
                        <tr
                          key={task._id}
                          className="hover:bg-neutral-50/60 dark:hover:bg-[#0A0A0A]/40 transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <div className="font-bold text-neutral-900 dark:text-white">
                              {task.title}
                            </div>
                            {task.description && (
                              <p className="text-[11px] text-neutral-400 truncate max-w-xs">
                                {task.description}
                              </p>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider bg-neutral-100 dark:bg-[#0A0A0A] border border-neutral-200 dark:border-[#2A2A2A] text-neutral-700 dark:text-neutral-300">
                              {task.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={cn(
                                'px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider border',
                                taskPriorityStyles[task.priority] || 'bg-neutral-500/10 text-neutral-400'
                              )}
                            >
                              {task.priority}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-neutral-500">
                            {typeof task.milestoneId === 'object'
                              ? (task.milestoneId as any)?.title || 'General'
                              : 'General'}
                          </td>
                          <td className="px-5 py-3.5 text-neutral-500">
                            {task.dueDate ? formatDate(task.dueDate) : '—'}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              onClick={() => handleOpenEditTask(task)}
                              className="p-1.5 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Financials & Invoices */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          {/* Financial KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-lg bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A] shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Total Project Budget
              </span>
              <div className="text-2xl font-extrabold text-neutral-900 dark:text-white font-mono">
                {project.totalBudget ? formatCurrency(project.totalBudget, project.currency) : 'Flexible'}
              </div>
              <p className="text-[11px] text-neutral-400 capitalize">{project.budgetType} billing scope</p>
            </div>

            <div className="p-5 rounded-lg bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A] shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider">
                Total Invoiced
              </span>
              <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                {formatCurrency(totalInvoiced, project.currency)}
              </div>
              <p className="text-[11px] text-neutral-400">Total billings raised</p>
            </div>

            <div className="p-5 rounded-lg bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A] shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">
                Payments Settled
              </span>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {formatCurrency(totalPaid, project.currency)}
              </div>
              <p className="text-[11px] text-neutral-400">Total cash collected</p>
            </div>

            <div className="p-5 rounded-lg bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A] shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                Unbilled Budget Remaining
              </span>
              <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                {formatCurrency(remainingUnbilled, project.currency)}
              </div>
              <p className="text-[11px] text-neutral-400">Remaining contract value</p>
            </div>
          </div>

          {/* Invoices List Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white">
                  Project Invoices & Payment Ledger
                </h3>
                <p className="text-xs text-neutral-500">
                  All billing invoices generated specifically for this project workspace.
                </p>
              </div>
              <Link
                href={`/invoices/new?projectId=${projectId}`}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Invoice</span>
              </Link>
            </div>

            {(!invoices || invoices.length === 0) ? (
              <div className="p-12 rounded-lg border border-dashed border-neutral-300 dark:border-[#2A2A2A] text-center space-y-3 bg-white/50 dark:bg-[#1A1A1A]/50">
                <Receipt className="w-8 h-8 text-indigo-500 mx-auto" />
                <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  No invoices recorded for this project
                </h4>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Generate an invoice from completed milestones or create a direct invoice.
                </p>
                <Link
                  href={`/invoices/new?projectId=${projectId}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Invoice</span>
                </Link>
              </div>
            ) : (
              <div className="rounded-lg bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-50 dark:bg-[#0A0A0A] border-b border-neutral-200 dark:border-[#2A2A2A] text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-5 py-3">Invoice #</th>
                        <th className="px-5 py-3">Issue Date</th>
                        <th className="px-5 py-3">Due Date</th>
                        <th className="px-5 py-3">Total Amount</th>
                        <th className="px-5 py-3">Balance Due</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-[#2A2A2A]/70 font-medium">
                      {invoices.map((inv) => (
                        <tr
                          key={inv._id}
                          className="hover:bg-neutral-50/60 dark:hover:bg-[#0A0A0A]/40 transition-colors"
                        >
                          <td className="px-5 py-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            <Link href={`/invoices/${inv._id}`} className="hover:underline">
                              {inv.invoiceNumber}
                            </Link>
                          </td>
                          <td className="px-5 py-3.5 text-neutral-500">
                            {formatDate(inv.issueDate)}
                          </td>
                          <td className="px-5 py-3.5 text-neutral-500">
                            {formatDate(inv.dueDate)}
                          </td>
                          <td className="px-5 py-3.5 font-bold font-mono text-neutral-900 dark:text-white">
                            {formatCurrency(inv.totalAmount, inv.currency)}
                          </td>
                          <td className="px-5 py-3.5 font-bold font-mono text-amber-600 dark:text-amber-400">
                            {formatCurrency(inv.balanceDue, inv.currency)}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={cn(
                                'px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider border',
                                invoiceStatusStyles[inv.status] || 'bg-neutral-500/10 text-neutral-400'
                              )}
                            >
                              {inv.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {inv.balanceDue > 0 && (
                                <button
                                  onClick={() => setSelectedPaymentInvoice(inv)}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-[11px] font-bold transition-colors"
                                  title="Log Payment"
                                >
                                  <CreditCard className="w-3 h-3" />
                                  <span>Pay</span>
                                </button>
                              )}
                              <Link
                                href={`/invoices/${inv._id}`}
                                className="p-1.5 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                title="View Invoice"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Deployment URLs & Multi-Domains */}
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
            <div className="p-12 rounded-lg border border-dashed border-neutral-300 dark:border-[#2A2A2A] text-center space-y-3 bg-white/50 dark:bg-[#1A1A1A]/50">
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
                  className="p-4 rounded-lg bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A] shadow-sm flex items-center justify-between gap-3 hover:border-indigo-500/40 transition-colors"
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
                    className="p-2 rounded-md bg-neutral-100 dark:bg-[#0A0A0A] text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors flex-shrink-0"
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

      {/* TAB 5: 3rd-Party Credentials Vault */}
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
            <div className="p-12 rounded-lg border border-dashed border-neutral-300 dark:border-[#2A2A2A] text-center space-y-3 bg-white/50 dark:bg-[#1A1A1A]/50">
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
                  className="p-4 rounded-lg bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A] shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-neutral-100 dark:border-[#2A2A2A]/70 pb-2">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-500" />
                      <span className="font-heading text-xs font-bold text-neutral-900 dark:text-white">
                        {cred.serviceName}
                      </span>
                    </div>
                    {cred.environment && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-neutral-100 dark:bg-[#0A0A0A] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-[#2A2A2A]">
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
                        <div className="p-2 rounded bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-200 dark:border-[#2A2A2A] font-mono text-[11px] text-neutral-800 dark:text-neutral-200 truncate mt-1">
                          {showSecretMap[idx] ? cred.accessKeyOrUrl : '••••••••••••••••••••••••••••••••'}
                        </div>
                      </div>
                    )}
                  </div>

                  {cred.notes && (
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 italic pt-2 border-t border-neutral-100 dark:border-[#2A2A2A]/70">
                      {cred.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: Scope & Architecture (Rich Text View) */}
      {activeTab === 'scope' && (
        <div className="space-y-6">
          <div className="p-6 rounded-lg bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A] shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-[#2A2A2A]">
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

          <div className="p-6 rounded-lg bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A] shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-[#2A2A2A]">
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

      {/* Task Drawer */}
      <TaskFormDrawer
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={editingTask}
        projectId={projectId}
        defaultStatus={defaultTaskStatus}
      />

      {/* Milestone Drawer */}
      <MilestoneFormDrawer
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        milestone={editingMilestone}
        projectId={projectId}
      />

      {/* Record Payment Drawer */}
      <RecordPaymentDrawer
        isOpen={!!selectedPaymentInvoice}
        onClose={() => setSelectedPaymentInvoice(null)}
        invoice={selectedPaymentInvoice}
      />
    </div>
  );
}
