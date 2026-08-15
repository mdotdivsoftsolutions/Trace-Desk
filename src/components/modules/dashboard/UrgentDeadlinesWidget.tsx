import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { formatRelativeDeadline } from '@/lib/formatters';
import { DashboardMetrics } from '@/types';

interface UrgentDeadlinesWidgetProps {
  metrics: DashboardMetrics | undefined;
  isLoading: boolean;
}

export function UrgentDeadlinesWidget({ metrics, isLoading }: UrgentDeadlinesWidgetProps) {
  const totalUrgent = (metrics?.tasks.upcomingTasks48h?.length || 0) + (metrics?.tasks.overdueTasks?.length || 0);

  return (
    <div className="p-5 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-[#334155] pb-3">
        <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
          <span>Urgent Deadlines (48h)</span>
        </h3>
        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155] font-mono">
          {totalUrgent}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <div className="h-12 bg-neutral-100 dark:bg-[#0F172A] rounded-md animate-pulse" />
          <div className="h-12 bg-neutral-100 dark:bg-[#0F172A] rounded-md animate-pulse" />
        </div>
      ) : totalUrgent === 0 ? (
        <div className="py-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
          <CheckCircle className="w-8 h-8 text-neutral-700 dark:text-neutral-300 mx-auto mb-2 opacity-80" />
          No impending deadlines in the next 48 hours.
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {metrics?.tasks.overdueTasks?.map((task: any) => {
            const deadline = formatRelativeDeadline(task.dueDate);
            return (
              <div key={task._id} className="p-2.5 rounded-md bg-rose-500/10 border border-rose-500/20 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 truncate">{task.title}</div>
                  <div className="text-[10px] text-neutral-500 truncate">{task.projectId?.title || 'Project'}</div>
                </div>
                <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300 flex-shrink-0">{deadline.text}</span>
              </div>
            );
          })}
          {metrics?.tasks.upcomingTasks48h?.map((task: any) => {
            const deadline = formatRelativeDeadline(task.dueDate);
            return (
              <div key={task._id} className="p-2.5 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">{task.title}</div>
                  <div className="text-[10px] text-neutral-500 truncate">{task.projectId?.title || 'Project'}</div>
                </div>
                <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300 flex-shrink-0">{deadline.text}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UrgentDeadlinesWidget;
