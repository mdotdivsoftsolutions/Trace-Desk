'use client';

import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { Task, TaskStatus } from '@/types';
import { KanbanCard } from './KanbanCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  showProjectBadge?: boolean;
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

export function KanbanColumn({
  status,
  title,
  tasks,
  showProjectBadge = false,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: KanbanColumnProps) {
  return (
    <div className="flex flex-col rounded-lg bg-neutral-100/60 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155] p-3 space-y-3 min-h-[500px]">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="font-heading font-bold text-xs text-neutral-900 dark:text-white uppercase tracking-wider">
            {title}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white dark:bg-[#1E293B] text-[10px] font-bold text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-[#334155] font-mono">
            {tasks.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onAddTask(status)}
          className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
          title={`Add task to ${title}`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 space-y-2.5 rounded-md p-1 transition-colors min-h-[150px]',
              snapshot.isDraggingOver && 'bg-neutral-200/50 dark:bg-[#1E293B]/50'
            )}
          >
            {tasks.map((task, index) => (
              <KanbanCard
                key={task._id}
                task={task}
                index={index}
                showProjectBadge={showProjectBadge}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default KanbanColumn;
