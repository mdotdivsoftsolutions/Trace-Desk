'use client';

import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, Edit, Trash2, Pin } from 'lucide-react';
import { Task } from '@/types';
import { formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface KanbanCardProps {
  task: Task;
  index: number;
  showProjectBadge?: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const priorityBadge: Record<string, string> = {
  low: 'bg-neutral-100 dark:bg-[#334155] text-neutral-600 dark:text-neutral-400',
  medium: 'bg-neutral-100 dark:bg-[#334155] text-neutral-800 dark:text-neutral-200 font-medium',
  high: 'bg-amber-500/10 text-neutral-700 dark:text-neutral-300 border-amber-500/20 font-semibold',
  urgent: 'bg-rose-500/10 text-rose-500 border-rose-500/20 font-bold',
};

export function KanbanCard({ task, index, showProjectBadge = false, onEdit, onDelete }: KanbanCardProps) {
  const projectObj =
    typeof task.projectId === 'object' && task.projectId !== null && 'title' in task.projectId
      ? (task.projectId as { title: string; isPinned?: boolean })
      : null;

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            'p-3.5 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-2.5 transition-all group',
            snapshot.isDragging && 'shadow-xl ring-2 ring-neutral-400 dark:ring-white scale-[1.02] rotate-1 z-50'
          )}
        >
          {showProjectBadge && projectObj && (
            <div className="flex items-center gap-1 text-[10px]">
              <span className={cn(
                'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border truncate max-w-full',
                projectObj.isPinned
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
              )}>
                {projectObj.isPinned && <Pin className="w-2.5 h-2.5 fill-amber-500 text-amber-500 rotate-45 flex-shrink-0" />}
                <span className="truncate">{projectObj.title}</span>
              </span>
            </div>
          )}

          <div className="flex items-start justify-between gap-2">
            <span className="font-heading font-bold text-xs text-neutral-900 dark:text-white line-clamp-2 leading-snug">
              {task.title}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button type="button" onClick={() => onEdit(task)} className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => onDelete(task)} className="p-1 rounded text-neutral-400 hover:text-rose-600 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          {task.description && (
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
              {task.description.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim()}
            </p>
          )}

          <div className="flex items-center justify-between pt-1 border-t border-neutral-100 dark:border-[#334155]/60 text-[10px]">
            <span className={cn('px-2 py-0.5 rounded uppercase font-semibold border', priorityBadge[task.priority] || priorityBadge.medium)}>
              {task.priority}
            </span>

            {task.dueDate && (
              <span className="flex items-center gap-1 text-neutral-500 font-medium">
                <Calendar className="w-3 h-3 text-neutral-400" />
                <span>{formatDate(task.dueDate)}</span>
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default KanbanCard;
