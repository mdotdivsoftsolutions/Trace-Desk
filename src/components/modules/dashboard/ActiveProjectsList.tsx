import React from 'react';
import Link from 'next/link';
import { FolderKanban, ChevronRight, Layers, Plus, Pin } from 'lucide-react';
import { formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { ProjectWithClient } from '@/types';

interface ActiveProjectsListProps {
  projects: ProjectWithClient[];
  isLoading: boolean;
}

const statusColors: Record<string, string> = {
  discovery: 'bg-amber-500/10 text-neutral-700 dark:text-neutral-300 border-amber-500/20',
  in_progress: 'bg-neutral-100 dark:bg-[#334155] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-[#334155]',
  review: 'bg-purple-500/10 text-neutral-700 dark:text-neutral-300 border-purple-500/20',
  completed: 'bg-emerald-500/10 text-neutral-700 dark:text-neutral-300 border-emerald-500/20',
};

export function ActiveProjectsList({ projects, isLoading }: ActiveProjectsListProps) {
  return (
    <div className="lg:col-span-2 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="font-heading text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            <span>Active Project Execution</span>
          </h2>
          <p className="text-xs text-neutral-500">Milestone completion rates and tech stack assignments.</p>
        </div>
        <Link href="/projects" className="text-xs font-semibold text-neutral-900 dark:text-white hover:underline flex items-center gap-1">
          <span>View All Projects</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-lg bg-neutral-200/60 dark:bg-neutral-800/40 animate-pulse border border-neutral-200 dark:border-neutral-800" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="p-10 rounded-lg border border-dashed border-neutral-300 dark:border-[#334155] text-center space-y-3 bg-white/50 dark:bg-[#1E293B]/50">
          <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-[#334155] text-neutral-700 dark:text-neutral-300 mx-auto flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">No active projects found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Create a new project to start tracking milestones, Kanban tasks, and auto-calculating velocity.
          </p>
          <Link href="/projects/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Create First Project</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const clientName =
              typeof project.clientId === 'object' && project.clientId !== null && 'name' in project.clientId
                ? (project.clientId as { name: string }).name
                : 'Client';
            return (
              <div
                key={project._id}
                className={cn(
                  'p-4 rounded-lg bg-white dark:bg-[#1E293B] border shadow-sm hover:border-neutral-400 dark:hover:border-neutral-600 transition-all group',
                  project.isPinned ? 'border-amber-500/40 ring-1 ring-amber-500/20' : 'border-neutral-200 dark:border-[#334155]'
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/projects/${project._id}`} className="font-heading font-bold text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors text-sm">
                        {project.title}
                      </Link>
                      {project.isPinned && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                          <Pin className="w-2.5 h-2.5 fill-amber-500 rotate-45" />
                          <span>Pinned</span>
                        </span>
                      )}
                      <span className={cn('px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider', statusColors[project.status] || 'bg-neutral-500/10 text-neutral-400')}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Client: <span className="font-medium text-neutral-700 dark:text-neutral-300">{clientName}</span>
                      {project.targetDeadline && (
                        <span className="ml-3">Deadline: <span className="font-medium text-neutral-700 dark:text-neutral-300">{formatDate(project.targetDeadline)}</span></span>
                      )}
                    </p>
                  </div>
                  <Link href={`/projects/${project._id}`} className="px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-[#0F172A] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-[#334155] transition-colors">
                    Workspace →
                  </Link>
                </div>
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-500 dark:text-neutral-400">Progress</span>
                    <span className="font-bold text-neutral-900 dark:text-white font-mono">{project.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-[#0F172A] h-2 rounded-full overflow-hidden">
                    <div className="bg-neutral-900 dark:bg-white h-full rounded-full transition-all duration-500" style={{ width: `${project.progressPercentage}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ActiveProjectsList;
