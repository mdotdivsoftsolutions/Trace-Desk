'use client';

import React from 'react';
import { Pin, FolderKanban, Layers } from 'lucide-react';
import { ProjectType, TaskType } from '@/types';
import { cn } from '@/lib/utils';

interface ProjectFilterTabsProps {
  projects: ProjectType[];
  tasks: TaskType[];
  selectedProjectId: string;
  onSelectProject: (projectId: string) => void;
}

export function ProjectFilterTabs({
  projects,
  tasks,
  selectedProjectId,
  onSelectProject,
}: ProjectFilterTabsProps) {
  // Count tasks per project
  const taskCountsByProject = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const task of tasks) {
      const pid =
        typeof task.projectId === 'object' && task.projectId !== null && '_id' in task.projectId
          ? (task.projectId as { _id: string })._id
          : typeof task.projectId === 'string'
          ? task.projectId
          : '';
      if (pid) {
        counts[pid] = (counts[pid] || 0) + 1;
      }
    }
    return counts;
  }, [tasks]);

  // Filter projects to only those with available tasks (> 0), sorted with pinned first
  const activeProjectsWithTasks = React.useMemo(() => {
    return projects
      .filter((p) => (taskCountsByProject[p._id] || 0) > 0)
      .sort((a, b) => {
        if (Boolean(a.isPinned) !== Boolean(b.isPinned)) {
          return a.isPinned ? -1 : 1;
        }
        return a.title.localeCompare(b.title);
      });
  }, [projects, taskCountsByProject]);

  const totalTasks = tasks.length;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
          <Layers className="w-3.5 h-3.5 text-neutral-400" />
          <span>Filter by Project Workspace:</span>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* All Projects Tab */}
        <button
          type="button"
          onClick={() => onSelectProject('all')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer flex-shrink-0',
            selectedProjectId === 'all'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-sm'
              : 'bg-white dark:bg-[#1E293B] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-[#334155] hover:border-neutral-400 dark:hover:border-neutral-500'
          )}
        >
          <FolderKanban className="w-3.5 h-3.5" />
          <span>All Workspaces</span>
          <span
            className={cn(
              'px-1.5 py-0.2 rounded-full text-[10px] font-bold',
              selectedProjectId === 'all'
                ? 'bg-white/20 text-white dark:bg-neutral-900/20 dark:text-neutral-900'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            )}
          >
            {totalTasks}
          </span>
        </button>

        {/* Individual Project Tabs - Only Projects with Tasks */}
        {activeProjectsWithTasks.map((project) => {
          const isSelected = selectedProjectId === project._id;
          const count = taskCountsByProject[project._id] || 0;
          const isPinned = Boolean(project.isPinned);

          return (
            <button
              key={project._id}
              type="button"
              onClick={() => onSelectProject(project._id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer flex-shrink-0',
                isSelected
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-sm'
                  : isPinned
                  ? 'bg-white dark:bg-[#1E293B] text-neutral-800 dark:text-neutral-200 border-amber-500/30 hover:border-amber-500/60'
                  : 'bg-white dark:bg-[#1E293B] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-[#334155] hover:border-neutral-400 dark:hover:border-neutral-500'
              )}
            >
              {isPinned && (
                <Pin className="w-3 h-3 fill-amber-500 text-amber-500 rotate-45 flex-shrink-0" />
              )}
              <span className="truncate max-w-[140px]">{project.title}</span>
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded-full text-[10px] font-bold',
                  isSelected
                    ? 'bg-white/20 text-white dark:bg-neutral-900/20 dark:text-neutral-900'
                    : isPinned
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ProjectFilterTabs;
