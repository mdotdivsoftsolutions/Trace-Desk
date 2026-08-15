'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { useCreateTask, useUpdateTask } from '@/hooks/useTasks';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { RichTextEditor } from '@/components/common/RichTextEditor';

interface TaskFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  task?: Task | null;
  defaultStatus?: TaskStatus;
}

export function TaskFormDrawer({ isOpen, onClose, projectId, task, defaultStatus = 'todo' }: TaskFormDrawerProps) {
  const [form, setForm] = useState({ title: '', description: '', status: defaultStatus as TaskStatus, priority: 'medium' as TaskPriority, dueDate: '' });
  const createTaskMutation = useCreateTask(projectId);
  const updateTaskMutation = useUpdateTask(projectId);

  useEffect(() => {
    if (task) {
      setForm({ title: task.title, description: task.description || '', status: task.status, priority: task.priority, dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '' });
    } else {
      setForm({ title: '', description: '', status: defaultStatus, priority: 'medium', dueDate: '' });
    }
  }, [task, defaultStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title: form.title, description: form.description || undefined, status: form.status, priority: form.priority, dueDate: form.dueDate ? new Date(form.dueDate) : undefined, loggedHours: 0 };
    if (task) {
      await updateTaskMutation.mutateAsync({ id: task._id, projectId, data: payload });
    } else {
      await createTaskMutation.mutateAsync({ projectId, ...payload });
    }
    onClose();
  };

  const isPending = createTaskMutation.isPending || updateTaskMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#1E293B] border-l border-neutral-200 dark:border-[#334155] shadow-2xl flex flex-col">
          <div className="h-16 px-6 border-b border-neutral-200 dark:border-[#334155] flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-neutral-900 dark:text-white">{task ? 'Edit Task' : 'Create New Task'}</h2>
            <button onClick={onClose} className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold">Task Title *</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })} className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs">
                  <option value="todo">To Do</option><option value="in_progress">In Progress</option><option value="review">Review</option><option value="done">Done</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold">Priority</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })} className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs">
                  <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold">Due Date</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold">Description</label>
              <RichTextEditor value={form.description} onChange={(v) => setForm({ ...form, description: v })} placeholder="Task details and instructions..." />
            </div>
            <div className="pt-4 border-t border-neutral-200 dark:border-[#334155] flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-3.5 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 text-xs font-semibold">Cancel</button>
              <button type="submit" disabled={isPending} className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold disabled:opacity-50">
                {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}<span>{task ? 'Save Task' : 'Create Task'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskFormDrawer;
