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
} from 'lucide-react';
import {
  useProject,
  useTasks,
  useUpdateTaskStatus,
  useDeleteTask,
  useInvoices,
} from '@/hooks';
import { TaskFormModal } from '@/components/modules/tasks/task-form-modal';
import { MilestoneFormModal } from '@/components/modules/projects/milestone-form-modal';
import { formatCurrency, formatDate, formatRelativeDeadline, cn } from '@/lib/utils';
import { TaskType, MilestoneType } from '@/types';

export default function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = use(params);

  const [activeTab, setActiveTab] = useState<'kanban' | 'milestones' | 'invoices'>('kanban');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState<'todo' | 'in_progress' | 'review' | 'done'>('todo');

  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<MilestoneType | null>(null);

  const { data: project, isLoading: isProjectLoading } = useProject(projectId);
  const { data: tasks, isLoading: isTasksLoading } = useTasks(projectId);
  const { data: invoices, isLoading: isInvoicesLoading } = useInvoices({ projectId });

  const updateTaskStatusMutation = useUpdateTaskStatus(projectId);
  const deleteTaskMutation = useDeleteTask(projectId);

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

  const kanbanColumns: Array<{
    id: 'todo' | 'in_progress' | 'review' | 'done';
    title: string;
    color: string;
    dotColor: string;
  }> = [
    { id: 'todo', title: 'To Do', color: 'border-neutral-200 dark:border-neutral-800', dotColor: 'bg-neutral-400' },
    { id: 'in_progress', title: 'In Progress', color: 'border-indigo-500/30', dotColor: 'bg-indigo-500' },
    { id: 'review', title: 'Review / QA', color: 'border-purple-500/30', dotColor: 'bg-purple-500' },
    { id: 'done', title: 'Done', color: 'border-emerald-500/30', dotColor: 'bg-emerald-500' },
  ];

  const handleOpenCreateTask = (status: 'todo' | 'in_progress' | 'review' | 'done' = 'todo') => {
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

  const handleShiftTaskStatus = (
    taskId: string,
    currentStatus: 'todo' | 'in_progress' | 'review' | 'done',
    direction: 'next' | 'prev'
  ) => {
    const order: Array<'todo' | 'in_progress' | 'review' | 'done'> = ['todo', 'in_progress', 'review', 'done'];
    const currentIndex = order.indexOf(currentStatus);
    const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (targetIndex >= 0 && targetIndex < order.length) {
      updateTaskStatusMutation.mutate({
        id: taskId,
        status: order[targetIndex],
      });
    }
  };

  const priorityBadges: Record<string, string> = {
    low: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
    medium: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    high: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    critical: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold',
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
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-xs font-semibold text-indigo-600 dark:text-indigo-400 transition-colors"
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
              <h1 className="text-2xl lg:text-3xl font-extrabold text-neutral-900 dark:text-white">
                {project.title}
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 capitalize">
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
                className="px-2.5 py-0.5 text-xs font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-1">
        <button
          onClick={() => setActiveTab('kanban')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all',
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
            'flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all',
            activeTab === 'milestones'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          )}
        >
          <Milestone className="w-4 h-4" />
          <span>Milestones ({project.milestones?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all',
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">
              Drag & move tasks across delivery stages to auto-recalculate project progress.
            </span>
            <button
              onClick={() => handleOpenCreateTask('todo')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kanbanColumns.map((col) => {
              const colTasks = tasks?.filter((t) => t.status === col.id) || [];

              return (
                <div
                  key={col.id}
                  className={cn(
                    'p-4 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/60 border flex flex-col justify-between min-h-[450px]',
                    col.color
                  )}
                >
                  <div className="space-y-3">
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800/60">
                      <div className="flex items-center gap-2">
                        <span className={cn('w-2 h-2 rounded-full', col.dotColor)} />
                        <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                          {col.title}
                        </span>
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                          {colTasks.length}
                        </span>
                      </div>
                      <button
                        onClick={() => handleOpenCreateTask(col.id)}
                        className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800"
                        title={`Add task to ${col.title}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Task Cards */}
                    <div className="space-y-2.5">
                      {colTasks.map((task) => {
                        const milestoneTitle =
                          typeof task.milestoneId === 'object'
                            ? (task.milestoneId as any)?.title
                            : null;

                        return (
                          <div
                            key={task._id}
                            className="p-3.5 rounded-xl bg-white dark:bg-neutral-800/90 border border-neutral-200/70 dark:border-neutral-700/70 shadow-sm hover:shadow-md transition-all space-y-2.5 group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span
                                className={cn(
                                  'px-2 py-0.5 text-[10px] rounded-md uppercase tracking-wider',
                                  priorityBadges[task.priority] || 'bg-neutral-100 text-neutral-600'
                                )}
                              >
                                {task.priority}
                              </span>

                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleOpenEditTask(task)}
                                  className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm('Delete task?')) deleteTaskMutation.mutate(task._id);
                                  }}
                                  className="p-1 text-neutral-400 hover:text-rose-500"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <h4 className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-2">
                                {task.title}
                              </h4>
                              {task.description && (
                                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2">
                                  {task.description}
                                </p>
                              )}
                            </div>

                            {milestoneTitle && (
                              <div className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md truncate">
                                <Milestone className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{milestoneTitle}</span>
                              </div>
                            )}

                            {/* Card Footer: Deadline & Status Shifter Buttons */}
                            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-700/60 flex items-center justify-between text-[10px] text-neutral-400">
                              {task.dueDate ? (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-amber-500" />
                                  <span>{formatDate(task.dueDate)}</span>
                                </span>
                              ) : (
                                <span>No due date</span>
                              )}

                              <div className="flex items-center gap-1">
                                {col.id !== 'todo' && (
                                  <button
                                    onClick={() => handleShiftTaskStatus(task._id, task.status, 'prev')}
                                    className="p-1 rounded bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 text-neutral-600 dark:text-neutral-300"
                                    title="Move Backward"
                                  >
                                    <ArrowLeft className="w-2.5 h-2.5" />
                                  </button>
                                )}
                                {col.id !== 'done' && (
                                  <button
                                    onClick={() => handleShiftTaskStatus(task._id, task.status, 'next')}
                                    className="p-1 rounded bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400"
                                    title="Advance Stage"
                                  >
                                    <ArrowRight className="w-2.5 h-2.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenCreateTask(col.id)}
                    className="w-full py-2 mt-4 text-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-400 transition-colors"
                  >
                    + Add Card
                  </button>
                </div>
              );
            })}
          </div>
        </div>
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

      {/* Tab 3: Linked Invoices */}
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

      {/* Task Modal */}
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        projectId={projectId}
        milestones={project.milestones}
        task={editingTask}
        defaultStatus={defaultTaskStatus}
      />

      {/* Milestone Modal */}
      <MilestoneFormModal
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        projectId={projectId}
        milestone={editingMilestone}
        currency={clientCurrency}
      />
    </div>
  );
}
