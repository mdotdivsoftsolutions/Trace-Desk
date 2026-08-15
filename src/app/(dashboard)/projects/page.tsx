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
} from 'lucide-react';
import { useProjects, useClients } from '@/hooks';
import { ProjectFormDrawer } from '@/components/modules/projects/ProjectFormDrawer';
import { Pagination } from '@/components/common/pagination';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { ProjectType } from '@/types';

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectType | null>(null);

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

  const handleOpenCreate = () => {
    setEditingProject(null);
    setIsFormModalOpen(true);
  };

  const statusColors: Record<string, string> = {
    discovery: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    in_progress: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
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
            <FolderKanban className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Projects & Workspaces</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Deliverable roadmaps, milestone tracking, and Kanban task boards.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-sm flex flex-col md:flex-row items-center gap-3">
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
            className="w-full pl-9 pr-4 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Status Filter */}
          <div className="relative flex-1 md:flex-initial">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          <div className="relative flex-1 md:flex-initial">
            <select
              value={clientFilter}
              onChange={(e) => {
                setClientFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0B0F19] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
        <div className="p-12 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] text-center space-y-3">
          <div className="inline-block w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-neutral-500">Loading project registry...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] text-center space-y-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center mx-auto">
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
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Project</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => {
              const client = project.clientId as any;
              return (
                <div
                  key={project._id}
                  className="p-5 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-sm hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
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
                        className="font-heading font-bold text-base text-neutral-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1"
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
                          <TrendingUp className="w-3 h-3 text-indigo-500" />
                          Progress
                        </span>
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {project.progressPercentage || 0}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${project.progressPercentage || 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Meta: Budget & Target Date */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 dark:border-[#232B3D] text-xs">
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
                  <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-[#232B3D] flex items-center justify-between gap-2">
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

                    <Link
                      href={`/projects/${project._id}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-xs font-semibold transition-colors"
                    >
                      <span>Open Workspace</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Backend Pagination Bar */}
          <div className="rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] overflow-hidden">
            <Pagination
              pagination={projectsData?.pagination}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </div>
      )}

      {/* Create / Edit Project Drawer */}
      <ProjectFormDrawer
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        project={editingProject}
      />
    </div>
  );
}
