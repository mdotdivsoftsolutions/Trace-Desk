import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, Plus, Kanban } from 'lucide-react';
import { ProjectWithClient } from '@/types';
import { cn } from '@/lib/utils';

interface ProjectHeaderProps {
  project: ProjectWithClient;
  onEdit: () => void;
  onAddTask: () => void;
  onAddMilestone: () => void;
}

const statusBadgeStyles: Record<string, string> = {
  discovery: 'bg-amber-500/10 text-neutral-700 dark:text-neutral-300 border-amber-500/20',
  in_progress: 'bg-neutral-100 dark:bg-[#334155] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-[#334155]',
  review: 'bg-purple-500/10 text-neutral-700 dark:text-neutral-300 border-purple-500/20',
  completed: 'bg-emerald-500/10 text-neutral-700 dark:text-neutral-300 border-emerald-500/20',
};

export function ProjectHeader({
  project,
  onEdit,
  onAddTask,
  onAddMilestone,
}: ProjectHeaderProps) {
  return (
    <div className="space-y-4">
      <Link href="/projects" className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Projects Workspace</span>
      </Link>

      <div className="p-6 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">{project.title}</h1>
              <span className={cn('px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider', statusBadgeStyles[project.status] || 'bg-neutral-500/10 text-neutral-400')}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
            {project.description && <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-2xl">{project.description}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/projects/${project._id}/kanban`} className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-neutral-100 dark:bg-[#0F172A] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-[#334155] transition-colors">
              <Kanban className="w-3.5 h-3.5" /><span>Kanban Board</span>
            </Link>
            <button onClick={onAddTask} className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-neutral-100 dark:bg-[#0F172A] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-[#334155] transition-colors">
              <Plus className="w-3.5 h-3.5" /><span>+ Add Task</span>
            </button>
            <button onClick={onAddMilestone} className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-neutral-100 dark:bg-[#0F172A] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-[#334155] transition-colors">
              <Plus className="w-3.5 h-3.5" /><span>+ Add Milestone</span>
            </button>
            <button onClick={onEdit} className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-bold shadow-sm transition-all">
              <Edit className="w-3.5 h-3.5" /><span>Edit Project</span>
            </button>
          </div>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-neutral-200 dark:border-[#334155]">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-neutral-500">Milestone Progression</span>
            <span className="font-bold text-neutral-900 dark:text-white font-mono">{project.progressPercentage}% Complete</span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-[#0F172A] h-2 rounded-full overflow-hidden">
            <div className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-500" style={{ width: `${project.progressPercentage}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectHeader;
