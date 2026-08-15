'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Kanban } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useTasks, useDeleteTask } from '@/hooks/useTasks';
import { useDebounce } from '@/hooks/useDebounce';
import { KanbanBoard } from '@/components/modules/tasks/KanbanBoard';
import { ProjectFilterTabs } from '@/components/modules/tasks/ProjectFilterTabs';
import { TaskFormDrawer } from '@/components/modules/tasks/TaskFormDrawer';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { KanbanBoardSkeleton } from '@/components/common/skeletons/KanbanBoardSkeleton';
import { Task, TaskStatus } from '@/types';

export default function GlobalKanbanPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [preselectedStatus, setPreselectedStatus] = useState<TaskStatus>('todo');
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Fetch all projects for horizontal filter and drawer assignment
  const { data: projectsData, isLoading: isProjectsLoading } = useProjects({ limit: 100 });
  const projects = projectsData?.items || [];

  // Fetch tasks
  const { data: allTasks = [], isLoading: isTasksLoading } = useTasks(
    undefined,
    {
      priority: priorityFilter === 'all' ? undefined : priorityFilter,
      search: debouncedSearch || undefined,
    }
  );

  // Filter tasks locally by selected project for instant UX
  const filteredTasks = useMemo(() => {
    if (selectedProjectId === 'all') return allTasks;
    return allTasks.filter((t) => {
      const pid =
        typeof t.projectId === 'object' && t.projectId !== null && '_id' in t.projectId
          ? (t.projectId as { _id: string })._id
          : typeof t.projectId === 'string'
          ? t.projectId
          : '';
      return pid === selectedProjectId;
    });
  }, [allTasks, selectedProjectId]);

  const deleteTaskMutation = useDeleteTask();

  const handleConfirmDelete = async () => {
    if (!deletingTask) return;
    await deleteTaskMutation.mutateAsync(deletingTask._id);
    setDeletingTask(null);
  };

  const isInitialLoading = isProjectsLoading || isTasksLoading;

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              <Kanban className="w-4 h-4" />
            </span>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Global Kanban Task Board
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Track and manage deliverables, sprint tasks, and review workflows across all active project workspaces.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingTask(null);
            setPreselectedStatus('todo');
            setIsTaskDrawerOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-bold shadow-sm self-start sm:self-auto cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Horizontal Project Filter Tabs */}
      <div className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-xs space-y-4">
        <ProjectFilterTabs
          projects={projects}
          tasks={allTasks}
          selectedProjectId={selectedProjectId}
          onSelectProject={(pid) => setSelectedProjectId(pid)}
        />

        {/* Search & Priority Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-100 dark:border-[#334155]/60">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search tasks across projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155] text-xs font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Priority:</span>
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155] text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board Area */}
      {isInitialLoading ? (
        <KanbanBoardSkeleton />
      ) : (
        <KanbanBoard
          tasks={filteredTasks}
          projectId={selectedProjectId === 'all' ? undefined : selectedProjectId}
          showProjectBadge={selectedProjectId === 'all'}
          onAddTask={(st) => {
            setEditingTask(null);
            if (st) setPreselectedStatus(st);
            setIsTaskDrawerOpen(true);
          }}
          onEditTask={(t) => {
            setEditingTask(t);
            setIsTaskDrawerOpen(true);
          }}
          onDeleteTask={(t) => setDeletingTask(t)}
        />
      )}

      {/* Task Drawer */}
      <TaskFormDrawer
        isOpen={isTaskDrawerOpen}
        onClose={() => {
          setIsTaskDrawerOpen(false);
          setEditingTask(null);
        }}
        projectId={selectedProjectId === 'all' ? undefined : selectedProjectId}
        projects={projects}
        task={editingTask}
        defaultStatus={preselectedStatus}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingTask}
        title="Delete Task"
        description={`Are you sure you want to delete "${deletingTask?.title}" from the task board?`}
        confirmText="Delete Task"
        variant="danger"
        isLoading={deleteTaskMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTask(null)}
      />
    </div>
  );
}
