'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  Search,
  Plus,
  Building2,
  Calendar,
  ExternalLink,
  GitBranch,
  Layers,
  ChevronRight,
  TrendingUp,
  Edit2,
} from 'lucide-react';
import { useProjects, useClients } from '@/hooks';
import { Pagination } from '@/components/common/pagination';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { ProjectType } from '@/types';

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const { data: clientsData } = useClients({ limit: 100 });
  const clients = clientsData?.items || [];

  const { data: projectsData, isLoading } = useProjects({
    status: statusFilter === 'all' ? undefined : statusFilter,
    clientId: clientFilter === 'all' ? undefined : clientFilter,
    search: search || undefined,
    page,
    limit: 9,
  });

  const projects = projectsData?.items || [];

  const statusColors: Record<string, string> = {
    discovery: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    in_progress: 'bg-neutral-100 dark:bg-[#252B37] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-[#2D333F]',
    review: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    on_hold: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-neutral-800 dark:text-neutral-200" />
            <span>Projects & Workspaces</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Deliverable roadmaps, milestone tracking, and Kanban task boards.
          </p>
        </div>

        <Link
          href="/projects/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 active:scale-95 font-bold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-lg bg-white dark:bg-[#1C2029] border border-neutral-200 dark:border-[#2D333F] shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search projects by title or description..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 rounded-md bg-neutral-50 dark:bg-[#111318] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="w-full sm:w-40">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#111318] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            >
              <option value="all">All Statuses</option>
              <option value="discovery">Discovery</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>

          {/* Client Filter */}
          <div className="w-full sm:w-44">
            <select
              value={clientFilter}
              onChange={(e) => {
                setClientFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#111318] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            >
              <option value="all">All Clients</option>
              {clients?.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name} {client.companyName ? `(${client.companyName})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="p-12 rounded-lg bg-white dark:bg-[#1C2029] border border-neutral-200 dark:border-[#2D333F] text-center space-y-3">
          <div className="inline-block w-8 h-8 border-2 border-neutral-900 dark:border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-neutral-500">Loading project registry...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 rounded-lg bg-white dark:bg-[#1C2029] border border-neutral-200 dark:border-[#2D333F] text-center space-y-4">
          <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-[#111318] border border-neutral-200 dark:border-[#2D333F] text-neutral-700 dark:text-neutral-300 flex items-center justify-center mx-auto">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white">
              No projects found
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              {search || statusFilter !== 'all' || clientFilter !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Get started by creating your first agency client workspace.'}
            </p>
          </div>
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 active:scale-95 text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Project</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => {
              const client = project.clientId as any;
              return (
                <div
                  key={project._id}
                  className="p-5 rounded-lg bg-white dark:bg-[#1C2029] border border-neutral-200 dark:border-[#2D333F] shadow-sm hover:border-neutral-200 dark:border-[#2D333F] transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3.5">
                    {/* Header: Client & Status */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 truncate">
                        <Building2 className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                        {client?.name || 'Client Workspace'}
                      </span>
                      <span
                        className={cn(
                          'px-2.5 py-0.5 text-[10px] font-bold rounded-md border uppercase tracking-wider',
                          statusColors[project.status] || 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                        )}
                      >
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <Link
                        href={`/projects/${project._id}`}
                        className="font-heading font-bold text-base text-neutral-900 dark:text-white hover:text-neutral-900 dark:text-white dark:hover:text-neutral-600 dark:text-neutral-400 transition-colors line-clamp-1"
                      >
                        {project.title}
                      </Link>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1 min-h-[32px]">
                        {project.description || 'No project description provided.'}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500 font-medium flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-neutral-700 dark:text-neutral-300" />
                          Progress
                        </span>
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {project.progressPercentage || 0}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                        <div
                          className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-500"
                          style={{ width: `${project.progressPercentage || 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Meta: Budget & Target Date */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 dark:border-[#2D333F] text-xs">
                      <div>
                        <span className="text-[10px] text-neutral-400 block uppercase font-bold tracking-wider">
                          Budget
                        </span>
                        <span className="font-bold text-neutral-900 dark:text-white font-mono">
                          {project.totalBudget
                            ? formatCurrency(project.totalBudget, project.currency)
                            : 'Unset'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 block uppercase font-bold tracking-wider">
                          Deadline
                        </span>
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-neutral-400" />
                          {formatDate(project.targetDeadline)}
                        </span>
                      </div>
                    </div>

                    {/* Tech Stack Badges */}
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {project.techStack.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-[10px] font-semibold rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[10px] font-semibold text-neutral-400">
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer Action Links */}
                  <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-[#2D333F] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          title="Repository"
                        >
                          <GitBranch className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          title="Live Preview"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/projects/${project._id}/edit`}
                        className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-900 dark:text-white dark:hover:text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/projects/${project._id}`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-[#252B37] text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-[#2D333F] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold transition-colors"
                      >
                        <span>Open Workspace</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Backend Pagination Bar */}
          <div className="rounded-lg bg-white dark:bg-[#1C2029] border border-neutral-200 dark:border-[#2D333F] overflow-hidden">
            <Pagination
              pagination={projectsData?.pagination}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
