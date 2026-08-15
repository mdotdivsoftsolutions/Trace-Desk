'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { useProject } from '@/hooks/useProjects';
import { useTasks, useDeleteTask } from '@/hooks/useTasks';
import { KanbanBoard } from '@/components/modules/tasks/KanbanBoard';
import { TaskFormDrawer } from '@/components/modules/tasks/TaskFormDrawer';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Task, TaskStatus } from '@/types';

export default function ProjectKanbanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [preselectedStatus, setPreselectedStatus] = useState<TaskStatus>('todo');
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const { data: project, isLoading: isProjectLoading } = useProject(id);
  const { data: tasks = [], isLoading: isTasksLoading } = useTasks(id);
  const deleteTaskMutation = useDeleteTask(id);

  if (isProjectLoading || isTasksLoading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block w-8 h-8 border-2 border-neutral-900 dark:border-white border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-neutral-500 mt-2">Loading Kanban board...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href={`/projects/${id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
            <ArrowLeft className="w-3.5 h-3.5" /><span>Back to {project?.title || 'Project'}</span>
          </Link>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Kanban Task Board
          </h1>
        </div>
        <button
          onClick={() => { setEditingTask(null); setPreselectedStatus('todo'); setIsTaskDrawerOpen(true); }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /><span>+ Add New Task</span>
        </button>
      </div>

      <KanbanBoard
        tasks={tasks}
        projectId={id}
        onAddTask={(st) => { setEditingTask(null); if (st) setPreselectedStatus(st); setIsTaskDrawerOpen(true); }}
        onEditTask={(t) => { setEditingTask(t); setIsTaskDrawerOpen(true); }}
        onDeleteTask={(t) => setDeletingTask(t)}
      />

      <TaskFormDrawer
        isOpen={isTaskDrawerOpen}
        onClose={() => { setIsTaskDrawerOpen(false); setEditingTask(null); }}
        projectId={id}
        task={editingTask}
        defaultStatus={preselectedStatus}
      />

      <ConfirmDialog
        isOpen={!!deletingTask}
        title="Delete Task"
        description={`Delete "${deletingTask?.title}" from board?`}
        confirmText="Delete"
        variant="danger"
        isLoading={deleteTaskMutation.isPending}
        onConfirm={async () => { if (deletingTask) { await deleteTaskMutation.mutateAsync(deletingTask._id); setDeletingTask(null); } }}
        onCancel={() => setDeletingTask(null)}
      />
    </div>
  );
}
