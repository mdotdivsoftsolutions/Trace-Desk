'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Edit2, Check, Loader2 } from 'lucide-react';
import { useCreateTask, useUpdateTask } from '@/hooks';
import { CreateTaskInput } from '@/lib/validations';
import { TaskType, MilestoneType } from '@/types';

interface TaskFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  milestones?: MilestoneType[];
  task?: TaskType | null;
  defaultStatus?: 'todo' | 'in_progress' | 'review' | 'done';
}

export function TaskFormDrawer({
  isOpen,
  onClose,
  projectId,
  milestones,
  task,
  defaultStatus = 'todo',
}: TaskFormDrawerProps) {
  const isEditing = !!task;
  const createTaskMutation = useCreateTask(projectId);
  const updateTaskMutation = useUpdateTask(projectId);

  const [formData, setFormData] = useState<CreateTaskInput>({
    projectId,
    milestoneId: '',
    title: '',
    description: '',
    priority: 'medium',
    status: defaultStatus,
    estimatedHours: 0,
    loggedHours: 0,
    dueDate: undefined,
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      const initialMilestoneId =
        typeof task.milestoneId === 'object'
          ? (task.milestoneId as any)._id
          : task.milestoneId || '';

      setFormData({
        projectId,
        milestoneId: initialMilestoneId,
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || defaultStatus,
        estimatedHours: task.estimatedHours || 0,
        loggedHours: task.loggedHours || 0,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      });
    } else {
      setFormData({
        projectId,
        milestoneId: '',
        title: '',
        description: '',
        priority: 'medium',
        status: defaultStatus,
        estimatedHours: 0,
        loggedHours: 0,
        dueDate: undefined,
      });
    }
    setError(null);
  }, [task, projectId, defaultStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      ...formData,
      milestoneId: formData.milestoneId || undefined,
    };

    try {
      if (isEditing && task) {
        await updateTaskMutation.mutateAsync({
          id: task._id,
          data: payload,
        });
      } else {
        await createTaskMutation.mutateAsync(payload);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save task');
    }
  };

  const isLoading = createTaskMutation.isPending || updateTaskMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={() => {
          if (!isLoading) onClose();
        }}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md sm:max-w-lg bg-white dark:bg-[#1C2029] border-l border-neutral-200 dark:border-[#2D333F] shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-[#2D333F] flex items-center justify-between gap-3 bg-neutral-50/50 dark:bg-[#111318]/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-[#252B37] text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-[#2D333F] flex items-center justify-center font-bold">
                {isEditing ? <Edit2 className="w-4 h-4" /> : <CheckSquare className="w-4 h-4" />}
              </div>
              <div>
                <h2 className="font-heading text-base font-bold text-neutral-900 dark:text-white">
                  {isEditing ? 'Edit Task' : 'Create Project Task'}
                </h2>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {isEditing
                    ? 'Update task status, priority, and logged hours'
                    : 'Assign work items to delivery milestones'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Scrollable Body */}
          <form id="task-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Task Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Implement OAuth & RBAC middleware"
                className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#111318] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500"
              />
            </div>

            {/* Milestone Selector */}
            {milestones && milestones.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Linked Project Milestone
                </label>
                <select
                  value={formData.milestoneId || ''}
                  onChange={(e) => setFormData({ ...formData, milestoneId: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#111318] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500"
                >
                  <option value="">-- General Project Task (No Milestone) --</option>
                  {milestones.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Task Details & Acceptance Criteria
              </label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Specifications, endpoints, edge cases..."
                className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#111318] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500"
              />
            </div>

            {/* Priority & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Priority Level
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#111318] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical (Blocker)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Kanban Column Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#111318] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Under Review</option>
                  <option value="done">Completed / Done</option>
                </select>
              </div>
            </div>

            {/* Estimated & Logged Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.estimatedHours || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, estimatedHours: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0.0"
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#111318] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Logged / Spent Hours
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.loggedHours || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, loggedHours: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0.0"
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#111318] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 font-mono"
                />
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Target Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dueDate: e.target.value ? new Date(e.target.value) : undefined,
                  })
                }
                className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#111318] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500"
              />
            </div>
          </form>

          {/* Sticky Bottom Action Bar */}
          <div className="p-4 border-t border-neutral-200 dark:border-[#2D333F] flex items-center justify-end gap-2.5 bg-neutral-50 dark:bg-[#111318]">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1C2029] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="task-form"
              disabled={isLoading}
              className="flex items-center gap-1.5 px-5 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 active:scale-95 font-bold text-xs shadow-sm transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>{isEditing ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

export default TaskFormDrawer;
