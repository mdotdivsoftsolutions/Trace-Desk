import React from 'react';
import Link from 'next/link';
import { User, ArrowRight, GitBranch, ExternalLink, Pin } from 'lucide-react';
import { ProjectWithClient } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { useTogglePinProject } from '@/hooks/useProjects';

interface ProjectGridCardProps {
  project: ProjectWithClient;
}

const statusBadgeStyles: Record<string, string> = {
  discovery: 'bg-amber-500/10 text-neutral-700 dark:text-neutral-300 border-amber-500/20',
  in_progress: 'bg-neutral-100 dark:bg-[#334155] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-[#334155]',
  review: 'bg-purple-500/10 text-neutral-700 dark:text-neutral-300 border-purple-500/20',
  completed: 'bg-emerald-500/10 text-neutral-700 dark:text-neutral-300 border-emerald-500/20',
  on_hold: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
  cancelled: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
};

export function ProjectGridCard({ project }: ProjectGridCardProps) {
  const clientName =
    typeof project.clientId === 'object' && project.clientId !== null && 'name' in project.clientId
      ? (project.clientId as { name: string }).name
      : 'Client';
  const togglePinMutation = useTogglePinProject();

  const handleTogglePin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    togglePinMutation.mutate(project._id);
  };

  return (
    <div
      className={cn(
        'p-5 rounded-lg bg-white dark:bg-[#1E293B] border shadow-sm hover:border-neutral-400 dark:hover:border-neutral-600 transition-all flex flex-col justify-between space-y-4 group relative',
        project.isPinned
          ? 'border-amber-500/40 dark:border-amber-500/40 ring-1 ring-amber-500/20 dark:ring-amber-500/20'
          : 'border-neutral-200 dark:border-[#334155]'
      )}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link href={`/projects/${project._id}`} className="font-heading font-bold text-base text-neutral-900 dark:text-white group-hover:underline block truncate">
                {project.title}
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={handleTogglePin}
              disabled={togglePinMutation.isPending}
              className={cn(
                'relative z-10 p-1.5 rounded-md text-xs transition-all flex items-center justify-center cursor-pointer',
                project.isPinned
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/30 border border-amber-500/40 shadow-xs'
                  : 'text-neutral-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-500/10'
              )}
              title={project.isPinned ? 'Unpin project' : 'Pin project to top'}
              aria-label={project.isPinned ? 'Unpin project' : 'Pin project to top'}
            >
              <Pin className={cn('w-3.5 h-3.5 transition-transform', project.isPinned ? 'fill-amber-500 text-amber-500 rotate-45' : 'hover:scale-110')} />
            </button>
            <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider flex-shrink-0', statusBadgeStyles[project.status] || 'bg-neutral-500/10 text-neutral-400')}>
              {project.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
          <User className="w-3.5 h-3.5 text-neutral-400" />
          <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate">{clientName}</span>
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500">Progress</span>
            <span className="font-bold text-neutral-900 dark:text-white font-mono">{project.progressPercentage}%</span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-[#0F172A] h-2 rounded-full overflow-hidden">
            <div className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-500" style={{ width: `${project.progressPercentage}%` }} />
          </div>
        </div>

        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {project.techStack.slice(0, 4).map((tech, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-[#0F172A] text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-[#334155] text-[10px] font-semibold">
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="px-1.5 py-0.5 text-[10px] text-neutral-400 font-semibold">+{project.techStack.length - 4}</span>
            )}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-neutral-200 dark:border-[#334155] flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-neutral-400 uppercase font-bold block">Budget</span>
          <span className="font-extrabold text-neutral-900 dark:text-white font-mono">{formatCurrency(project.totalBudget || 0)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {project.githubRepo && (
            <a href={project.githubRepo} target="_blank" rel="noreferrer" className="p-1.5 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
              <GitBranch className="w-4 h-4" />
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <Link href={`/projects/${project._id}`} className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-[#0F172A] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors">
            <span>Workspace</span><ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProjectGridCard;
