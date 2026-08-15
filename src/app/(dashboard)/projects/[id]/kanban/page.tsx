'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  Building2,
  Calendar,
  DollarSign,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { useProject, useTasks } from '@/hooks';
import { KanbanBoard } from '@/components/modules/tasks/KanbanBoard';
import { TaskFormModal } from '@/components/modules/tasks/task-form-modal';
import { formatCurrency, formatDate } from '@/lib/utils';
import { TaskType } from '@/types';

export default function ProjectKanbanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = use(params);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState<'todo' | 'in_progress' | 'review' | 'done'>('todo');
  const [defaultMilestoneId, setDefaultMilestoneId] = useState<string | undefined>(undefined);

  const { data: project, isLoading: isProjectLoading } = useProject(projectId);
  const { data: tasks, isLoading: isTasksLoading } = useTasks(projectId);

  if (isProjectLoading || isTasksLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 rounded-3xl bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-96 rounded-3xl bg-neutral-200 dark:bg-neutral-800" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-12 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-neutral-700 dark:text-neutral-300 mx-auto" />
        <h2 className="text-lg font-bold">Project Not Found</h2>
        <Link href="/projects" className="text-xs font-semibold text-neutral-900 dark:text-white hover:underline">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const clientName =
    typeof project.clientId === 'object' ? (project.clientId as any)?.name : 'Client';

  const handleOpenCreateTask = (
    status: 'todo' | 'in_progress' | 'review' | 'done' = 'todo',
    milestoneId?: string
  ) => {
    setEditingTask(null);
    setDefaultTaskStatus(status);
    setDefaultMilestoneId(milestoneId);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: TaskType) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
            <Link href="/projects" className="hover:text-neutral-900 dark:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Projects</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/projects/${projectId}`} className="hover:text-neutral-900 dark:text-white transition-colors">
              {project.title}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-neutral-900 dark:text-white font-semibold">Kanban Board</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-neutral-900 dark:text-white">
              {project.progressPercentage}% Completed
            </span>
            <div className="w-24 bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-neutral-900 dark:bg-white h-full rounded-full transition-all"
                style={{ width: `${project.progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white flex items-center gap-2.5">
              <FolderKanban className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
              <span>{project.title} &mdash; Task Pipeline</span>
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Client: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{clientName}</span> • Drag cards to update statuses and recalculate project velocity.
            </p>
          </div>

          <Link
            href={`/projects/${projectId}`}
            className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors"
          >
            Open Full Workspace
          </Link>
        </div>
      </div>

      {/* Interactive Kanban Board */}
      <KanbanBoard
        projectId={projectId}
        tasks={tasks}
        milestones={project.milestones}
        onOpenCreateTask={handleOpenCreateTask}
        onOpenEditTask={handleOpenEditTask}
      />

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        projectId={projectId}
        milestones={project.milestones}
        task={editingTask}
        defaultStatus={defaultTaskStatus}
      />
    </div>
  );
}
