'use client';

import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, Clock, Edit, Trash2, User } from 'lucide-react';
import { Task } from '@/types';
import { formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface KanbanCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const priorityBadge: Record<string, string> = {
  low: 'bg-neutral-100 dark:bg-[#334155] text-neutral-600 dark:text-neutral-400',
  medium: 'bg-neutral-100 dark:bg-[#334155] text-neutral-800 dark:text-neutral-200 font-medium',
  high: 'bg-amber-500/10 text-neutral-700 dark:text-neutral-300 border-amber-500/20 font-semibold',
  urgent: 'bg-rose-500/10 text-rose-500 border-rose-500/20 font-bold',
};

export function KanbanCard({ task, index, onEdit, onDelete }: KanbanCardProps) {
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
          <div className="flex items-start justify-between gap-2">
            <span className="font-heading font-bold text-xs text-neutral-900 dark:text-white line-clamp-2 leading-snug">
              {task.title}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(task)} className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white"><Edit className="w-3.5 h-3.5" /></button>
              <button onClick={() => onDelete(task)} className="p-1 rounded text-neutral-400 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          {task.description && (
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
              {task.description}
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
