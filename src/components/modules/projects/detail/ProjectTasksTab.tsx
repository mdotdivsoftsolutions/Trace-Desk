import React from 'react';
import Link from 'next/link';
import { Kanban, Plus, Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { Task } from '@/types';
import { formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface ProjectTasksTabProps {
  tasks: Task[];
  projectId: string;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

const taskStatusBadge: Record<string, string> = {
  todo: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
  in_progress: 'bg-neutral-100 dark:bg-[#334155] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-[#334155]',
  review: 'bg-purple-500/10 text-neutral-700 dark:text-neutral-300 border-purple-500/20',
  done: 'bg-emerald-500/10 text-neutral-700 dark:text-neutral-300 border-emerald-500/20',
};

export function ProjectTasksTab({
  tasks,
  projectId,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: ProjectTasksTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Execution Backlog ({tasks.length})</h3>
        <div className="flex items-center gap-2">
          <Link href={`/projects/${projectId}/kanban`} className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-[#0F172A] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-[#334155]">
            <Kanban className="w-3.5 h-3.5" /><span>Open Kanban Board</span>
          </Link>
          <button onClick={onAddTask} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-bold shadow-sm transition-all">
            <Plus className="w-3.5 h-3.5" /><span>+ Add Task</span>
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="p-12 text-center rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] space-y-3">
          <Kanban className="w-8 h-8 text-neutral-400 mx-auto" />
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">No tasks created yet</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">Add development tasks to prioritize backlog items on your Kanban board.</p>
          <button onClick={onAddTask} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
            <Plus className="w-3.5 h-3.5" /><span>Create Task</span>
          </button>
        </div>
      ) : (
        <div className="rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-[#0F172A] text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-[#334155]">
              <tr>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Task Title</th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Priority</th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Due Date</th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-[#334155]">
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-neutral-900 dark:text-white">{task.title}</td>
                  <td className="px-5 py-3.5 uppercase font-bold text-[10px] text-neutral-500">{task.priority}</td>
                  <td className="px-5 py-3.5 text-neutral-500">{task.dueDate ? formatDate(task.dueDate) : '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider', taskStatusBadge[task.status] || 'bg-neutral-500/10 text-neutral-400')}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => onEditTask(task)} className="p-1.5 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => onDeleteTask(task)} className="p-1.5 rounded text-neutral-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProjectTasksTab;
