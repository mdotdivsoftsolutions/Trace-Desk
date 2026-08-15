import React from 'react';
import Link from 'next/link';
import { FolderKanban, Plus, ArrowRight, Calendar } from 'lucide-react';
import { Project } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface ClientProjectsTabProps {
  projects: Project[];
  clientId: string;
  onAddProject: () => void;
}

const statusColors: Record<string, string> = {
  discovery: 'bg-amber-500/10 text-neutral-700 dark:text-neutral-300 border-amber-500/20',
  in_progress: 'bg-neutral-100 dark:bg-[#334155] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-[#334155]',
  review: 'bg-purple-500/10 text-neutral-700 dark:text-neutral-300 border-purple-500/20',
  completed: 'bg-emerald-500/10 text-neutral-700 dark:text-neutral-300 border-emerald-500/20',
};

export function ClientProjectsTab({ projects, clientId, onAddProject }: ClientProjectsTabProps) {
  if (projects.length === 0) {
    return (
      <div className="p-12 text-center rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] space-y-3">
        <FolderKanban className="w-8 h-8 text-neutral-400 mx-auto" />
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">No projects found</h3>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto">Create a new project linked to this client to track milestones and budgets.</p>
        <button onClick={onAddProject} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
          <Plus className="w-3.5 h-3.5" /><span>Create Project</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => (
        <div key={project._id} className="p-5 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm hover:border-neutral-400 dark:hover:border-neutral-600 transition-all space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link href={`/projects/${project._id}`} className="font-heading font-bold text-sm text-neutral-900 dark:text-white hover:underline block">
                {project.title}
              </Link>
              {project.targetDeadline && (
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-1">
                  <Calendar className="w-3 h-3 text-neutral-700 dark:text-neutral-300" />
                  <span>Target: {formatDate(project.targetDeadline)}</span>
                </div>
              )}
            </div>
            <span className={cn('px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider', statusColors[project.status] || 'bg-neutral-500/10 text-neutral-400')}>
              {project.status.replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-neutral-500">Progress</span>
              <span className="text-neutral-900 dark:text-white font-mono font-bold">{project.progressPercentage}%</span>
            </div>
            <div className="w-full bg-neutral-100 dark:bg-[#0F172A] h-2 rounded-full overflow-hidden">
              <div className="bg-neutral-900 dark:bg-white h-full rounded-full transition-all duration-300" style={{ width: `${project.progressPercentage}%` }} />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-[#334155] text-xs">
            <div>
              <span className="text-[10px] text-neutral-400 block uppercase font-bold">Total Budget</span>
              <span className="font-extrabold text-neutral-900 dark:text-white font-mono">{formatCurrency(project.totalBudget || 0)}</span>
            </div>
            <Link href={`/projects/${project._id}`} className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-[#0F172A] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors">
              <span>Workspace</span><ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ClientProjectsTab;
