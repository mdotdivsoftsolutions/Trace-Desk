'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Plus,
  Kanban,
  Calendar,
  Layers,
  Banknote,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Pin,
} from 'lucide-react';
import { ProjectWithClient, Milestone } from '@/types';
import { cn, formatCurrency } from '@/lib/utils';
import SafeHTML from '@/components/common/SafeHTML';
import { useTogglePinProject } from '@/hooks/useProjects';

interface ProjectHeaderProps {
  project: ProjectWithClient;
  milestones?: Milestone[];
  onEdit: () => void;
  onAddTask: () => void;
  onAddMilestone: () => void;
}

const statusBadgeStyles: Record<string, string> = {
  discovery: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  in_progress: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  review: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  completed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  on_hold: 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20',
  cancelled: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
};

export function ProjectHeader({
  project,
  milestones = [],
  onEdit,
  onAddTask,
  onAddMilestone,
}: ProjectHeaderProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const formattedDeadline = project.targetDeadline
    ? new Date(project.targetDeadline).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const techStack = project.techStack || [];

  // Dynamic live progress calculation from milestones
  const validMilestones = milestones.filter((m) => m.status !== 'cancelled');
  const totalMilestoneBudget = validMilestones.reduce(
    (sum, m) => sum + (m.allocatedAmount ?? m.amount ?? 0),
    0
  );
  const completedMilestones = validMilestones.filter(
    (m) => m.status === 'completed' || m.status === 'invoiced'
  );
  const completedBudget = completedMilestones.reduce(
    (sum, m) => sum + (m.allocatedAmount ?? m.amount ?? 0),
    0
  );

  let progressPercentage = project.progressPercentage || 0;
  if (validMilestones.length > 0) {
    progressPercentage =
      totalMilestoneBudget > 0
        ? Math.min(100, Math.max(0, Math.round((completedBudget / totalMilestoneBudget) * 100)))
        : Math.min(100, Math.max(0, Math.round((completedMilestones.length / validMilestones.length) * 100)));
  }

  const effectiveBudget = totalMilestoneBudget > 0 ? totalMilestoneBudget : (project.totalBudget || 0);
  const togglePinMutation = useTogglePinProject();

  return (
    <div className="space-y-4">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Projects Workspace</span>
      </Link>

      <div className={cn(
        'p-6 rounded-lg bg-white dark:bg-[#1E293B] border shadow-sm space-y-4 transition-all',
        project.isPinned ? 'border-amber-500/40 ring-1 ring-amber-500/20' : 'border-neutral-200 dark:border-[#334155]'
      )}>
        {/* Top bar: Title, status, budget, deadline, actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {project.title}
              </h1>
              {project.isPinned && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                  <Pin className="w-3 h-3 fill-amber-500 rotate-45" />
                  <span>Pinned</span>
                </span>
              )}
              <span
                className={cn(
                  'px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider',
                  statusBadgeStyles[project.status] || 'bg-neutral-500/10 text-neutral-400'
                )}
              >
                {project.status.replace('_', ' ')}
              </span>

              {effectiveBudget > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                  <Banknote className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{formatCurrency(effectiveBudget, project.currency || 'INR')}</span>
                </span>
              )}

              {formattedDeadline && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-neutral-50 dark:bg-[#0F172A] text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-[#334155]">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Target: {formattedDeadline}</span>
                </span>
              )}
            </div>

            {/* Tech Stack Pills */}
            {techStack.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[11px] text-neutral-400 font-semibold mr-1 flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Stack:
                </span>
                {techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-100 dark:bg-[#0F172A] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-[#334155]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => togglePinMutation.mutate(project._id)}
              disabled={togglePinMutation.isPending}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold border transition-colors cursor-pointer',
                project.isPinned
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/25'
                  : 'bg-neutral-100 dark:bg-[#0F172A] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-[#334155] hover:bg-neutral-200 dark:hover:bg-neutral-800'
              )}
              title={project.isPinned ? 'Unpin project' : 'Pin project to top'}
            >
              <Pin className={cn('w-3.5 h-3.5', project.isPinned ? 'fill-amber-500 rotate-45' : '')} />
              <span>{project.isPinned ? 'Pinned' : 'Pin Project'}</span>
            </button>
            <Link
              href={`/projects/${project._id}/kanban`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-neutral-100 dark:bg-[#0F172A] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-[#334155] transition-colors"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban Board</span>
            </Link>
            <button
              onClick={onAddTask}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-neutral-100 dark:bg-[#0F172A] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-[#334155] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Task</span>
            </button>
            <button
              onClick={onAddMilestone}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-neutral-100 dark:bg-[#0F172A] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-[#334155] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Milestone</span>
            </button>
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-bold shadow-sm transition-all"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Project</span>
            </button>
          </div>
        </div>

        {/* Project Description (if present) */}
        {project.description && (
          <div className="pt-3 border-t border-neutral-100 dark:border-[#334155]/60 max-w-4xl space-y-2">
            <div className="relative">
              <div
                className={cn(
                  'transition-all duration-300 ease-in-out overflow-hidden',
                  !isDescriptionExpanded ? 'max-h-36' : 'max-h-none'
                )}
              >
                <SafeHTML
                  html={project.description}
                  className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed"
                />
              </div>

              {/* Gradient fade overlay when collapsed */}
              {!isDescriptionExpanded && (
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white dark:from-[#1E293B] to-transparent pointer-events-none" />
              )}
            </div>

            {/* Show More / Show Less Button */}
            <div>
              <button
                type="button"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100/90 dark:bg-neutral-800/90 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 transition-colors shadow-2xs"
              >
                <span>{isDescriptionExpanded ? 'Show Less' : 'Show More'}</span>
                {isDescriptionExpanded ? (
                  <ChevronUp className="w-3 h-3 text-neutral-500" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-neutral-500" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Milestone Progression */}
        <div className="space-y-1.5 pt-2 border-t border-neutral-200 dark:border-[#334155]">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-neutral-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>Milestone Progression</span>
              {validMilestones.length > 0 && (
                <span className="text-[11px] text-neutral-400">
                  ({completedMilestones.length} of {validMilestones.length} milestones completed)
                </span>
              )}
            </span>
            <span className="font-bold text-neutral-900 dark:text-white font-mono flex items-center gap-1.5">
              {progressPercentage === 100 && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              )}
              <span>{progressPercentage}% Complete</span>
            </span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-[#0F172A] h-2.5 rounded-full overflow-hidden p-0.5 border border-neutral-200 dark:border-[#334155]">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-700 ease-out',
                progressPercentage === 100
                  ? 'bg-emerald-500'
                  : progressPercentage > 0
                  ? 'bg-neutral-900 dark:bg-white'
                  : 'bg-transparent'
              )}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectHeader;
