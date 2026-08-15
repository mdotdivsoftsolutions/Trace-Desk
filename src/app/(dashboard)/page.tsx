'use client';

import React from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  FolderKanban,
  Clock,
  AlertCircle,
  CheckCircle,
  Receipt,
  ArrowUpRight,
  Plus,
  Layers,
  Calendar,
  Sparkles,
  ChevronRight,
  CreditCard,
} from 'lucide-react';
import { useDashboardMetrics, useProjects } from '@/hooks';
import { formatCurrency, formatDate, formatRelativeDeadline, cn } from '@/lib/utils';

export default function DashboardPage() {
  const { data: metrics, isLoading: isMetricsLoading } = useDashboardMetrics();
  const { data: projects, isLoading: isProjectsLoading } = useProjects();

  const activeProjects = projects?.filter((p) =>
    ['discovery', 'in_progress', 'review'].includes(p.status)
  ) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-neutral-900/50 border border-indigo-500/20 backdrop-blur-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Live Operations
            </span>
            <span className="text-xs text-neutral-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Executive Command Center
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Real-time project velocity, milestone progression, and cash flow ledger.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            href="/invoices"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 transition-all shadow-sm"
          >
            <Receipt className="w-4 h-4 text-amber-500" />
            <span>Create Invoice</span>
          </Link>
          <Link
            href="/projects"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* 4 Top KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Collected Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">
              {isMetricsLoading ? (
                <div className="h-8 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
              ) : (
                formatCurrency(metrics?.financials.totalRevenue || 0)
              )}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>Settled milestone payouts</span>
            </p>
          </div>
        </div>

        {/* Card 2: Pending Receivables */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Pending Invoices
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">
              {isMetricsLoading ? (
                <div className="h-8 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
              ) : (
                formatCurrency(metrics?.financials.pendingReceivables || 0)
              )}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {metrics?.financials.overdueReceivables ? (
                <span className="text-rose-500 font-semibold">
                  {formatCurrency(metrics.financials.overdueReceivables)} overdue
                </span>
              ) : (
                <span>Unpaid sent invoices</span>
              )}
            </p>
          </div>
        </div>

        {/* Card 3: Active Projects & Avg Progress */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Active Projects
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-neutral-900 dark:text-white flex items-baseline gap-2">
              {isMetricsLoading ? (
                <div className="h-8 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
              ) : (
                <>
                  <span>{metrics?.projects.activeCount || 0}</span>
                  <span className="text-xs font-normal text-neutral-400">
                    of {metrics?.projects.totalCount || 0} total
                  </span>
                </>
              )}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${metrics?.projects.averageCompletionRate || 0}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300">
                {metrics?.projects.averageCompletionRate || 0}% avg
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Open & Overdue Tasks */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Open Tasks
            </span>
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">
              {isMetricsLoading ? (
                <div className="h-8 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
              ) : (
                metrics?.tasks.totalOpenTasks || 0
              )}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1">
              {(metrics?.tasks.overdueTasks?.length || 0) > 0 ? (
                <span className="text-rose-500 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {metrics?.tasks.overdueTasks.length} overdue tasks
                </span>
              ) : (
                <span className="text-emerald-500 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  All deadlines on track
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Projects Overview & Sidebar Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Project Progress Tracker */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-indigo-500" />
                <span>Active Project Execution</span>
              </h2>
              <p className="text-xs text-neutral-500">
                Milestone completion rates and tech stack assignments.
              </p>
            </div>
            <Link
              href="/projects"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All Projects</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isProjectsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-2xl bg-neutral-200/60 dark:bg-neutral-800/40 animate-pulse border border-neutral-200 dark:border-neutral-800"
                />
              ))}
            </div>
          ) : activeProjects.length === 0 ? (
            <div className="p-10 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 mx-auto flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                No active projects found
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Create a new project to start tracking milestones, Kanban tasks, and auto-calculating velocity.
              </p>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Project</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeProjects.map((project) => {
                const clientName =
                  typeof project.clientId === 'object' ? (project.clientId as any)?.name : 'Client';
                const statusColors: Record<string, string> = {
                  discovery: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                  in_progress: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
                  review: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
                  completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                };

                return (
                  <div
                    key={project._id}
                    className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all group shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/projects/${project._id}`}
                            className="font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-base"
                          >
                            {project.title}
                          </Link>
                          <span
                            className={cn(
                              'px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider',
                              statusColors[project.status] || 'bg-neutral-500/10 text-neutral-400'
                            )}
                          >
                            {project.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          Client: <span className="font-medium text-neutral-700 dark:text-neutral-300">{clientName}</span>
                          {project.targetDeadline && (
                            <span className="ml-3">
                              Deadline:{' '}
                              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                                {formatDate(project.targetDeadline)}
                              </span>
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          href={`/projects/${project._id}/kanban`}
                          className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-neutral-200 dark:border-neutral-700 transition-colors"
                        >
                          Kanban Board
                        </Link>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-neutral-500 dark:text-neutral-400">Progress</span>
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {project.progressPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${project.progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Tech Stack Badges */}
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {project.techStack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-700/50"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Urgent Deadlines & Unbilled Milestones */}
        <div className="space-y-6">
          {/* Urgent Deadlines Widget */}
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200/60 dark:border-neutral-800/60 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Urgent Deadlines (48h)</span>
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500/10 text-amber-500">
                {(metrics?.tasks.upcomingTasks48h?.length || 0) + (metrics?.tasks.overdueTasks?.length || 0)}
              </span>
            </div>

            {isMetricsLoading ? (
              <div className="space-y-2">
                <div className="h-12 bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse" />
                <div className="h-12 bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse" />
              </div>
            ) : (metrics?.tasks.upcomingTasks48h?.length || 0) === 0 &&
              (metrics?.tasks.overdueTasks?.length || 0) === 0 ? (
              <div className="py-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                No impending deadlines in the next 48 hours.
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {/* Overdue Tasks */}
                {metrics?.tasks.overdueTasks?.map((task: any) => {
                  const deadline = formatRelativeDeadline(task.dueDate);
                  return (
                    <div
                      key={task._id}
                      className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 truncate">
                          {task.title}
                        </div>
                        <div className="text-[10px] text-neutral-500 truncate">
                          {task.projectId?.title || 'Project'}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 flex-shrink-0">
                        {deadline.text}
                      </span>
                    </div>
                  );
                })}

                {/* Upcoming Tasks */}
                {metrics?.tasks.upcomingTasks48h?.map((task: any) => {
                  const deadline = formatRelativeDeadline(task.dueDate);
                  return (
                    <div
                      key={task._id}
                      className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                          {task.title}
                        </div>
                        <div className="text-[10px] text-neutral-500 truncate">
                          {task.projectId?.title || 'Project'}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex-shrink-0">
                        {deadline.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Unbilled Milestones Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200/60 dark:border-neutral-800/60 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-500" />
                <span>Ready to Invoice</span>
              </h3>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(metrics?.milestones.unbilledTotalAmount || 0)}
              </span>
            </div>

            {isMetricsLoading ? (
              <div className="h-16 bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse" />
            ) : (metrics?.milestones.unbilledMilestones?.length || 0) === 0 ? (
              <div className="py-4 text-center text-xs text-neutral-500 dark:text-neutral-400">
                All completed milestones are invoiced.
              </div>
            ) : (
              <div className="space-y-2">
                {metrics?.milestones.unbilledMilestones.slice(0, 3).map((m: any) => (
                  <div
                    key={m._id}
                    className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                        {m.title}
                      </div>
                      <div className="text-[10px] text-neutral-500 truncate">
                        {m.projectId?.title || 'Project'}
                      </div>
                    </div>
                    <span className="font-bold text-neutral-900 dark:text-white flex-shrink-0">
                      {formatCurrency(m.allocatedAmount || 0)}
                    </span>
                  </div>
                ))}

                <Link
                  href="/invoices"
                  className="block w-full py-2 text-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-200/50 dark:border-indigo-800/50"
                >
                  Convert to Invoices →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
