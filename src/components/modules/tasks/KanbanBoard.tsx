'use client';

import React, { useState, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import {
  Plus,
  Clock,
  Milestone,
  Trash2,
  Edit2,
  ArrowRight,
  ArrowLeft,
  GripVertical,
  Filter,
  CheckCircle2,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { useUpdateTaskStatus, useDeleteTask } from '@/hooks';
import { formatDate, formatRelativeDeadline, cn } from '@/lib/utils';
import { TaskType, MilestoneType } from '@/types';

interface KanbanBoardProps {
  projectId: string;
  tasks?: TaskType[];
  milestones?: MilestoneType[];
  onOpenCreateTask: (status: 'todo' | 'in_progress' | 'review' | 'done', milestoneId?: string) => void;
  onOpenEditTask: (task: TaskType) => void;
}

type ColumnId = 'todo' | 'in_progress' | 'review' | 'done';

interface ColumnConfig {
  id: ColumnId;
  title: string;
  dotColor: string;
  badgeBg: string;
  borderAccent: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'todo',
    title: 'To Do',
    dotColor: 'bg-neutral-400',
    badgeBg: 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400',
    borderAccent: 'border-neutral-200/80 dark:border-neutral-800/80',
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    dotColor: 'bg-indigo-500',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400',
    borderAccent: 'border-indigo-500/20',
  },
  {
    id: 'review',
    title: 'Review / QA',
    dotColor: 'bg-purple-500',
    badgeBg: 'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400',
    borderAccent: 'border-purple-500/20',
  },
  {
    id: 'done',
    title: 'Done',
    dotColor: 'bg-emerald-500',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400',
    borderAccent: 'border-emerald-500/20',
  },
];

const priorityBadges: Record<string, string> = {
  low: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
  medium: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
  high: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold',
  critical: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold animate-pulse',
};

export function KanbanBoard({
  projectId,
  tasks = [],
  milestones = [],
  onOpenCreateTask,
  onOpenEditTask,
}: KanbanBoardProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedMilestoneFilter, setSelectedMilestoneFilter] = useState<string>('all');

  const updateStatusMutation = useUpdateTaskStatus(projectId);
  const deleteTaskMutation = useDeleteTask(projectId);

  // Fix SSR hydration issues for Drag and Drop
  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTasks = tasks.filter((t) => {
    if (selectedMilestoneFilter === 'all') return true;
    const milestoneId = typeof t.milestoneId === 'object' ? (t.milestoneId as any)?._id : t.milestoneId;
    return milestoneId === selectedMilestoneFilter;
  });

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as ColumnId;
    updateStatusMutation.mutate({
      id: draggableId,
      status: newStatus,
    });
  };

  const handleShiftStatus = (
    taskId: string,
    currentStatus: ColumnId,
    direction: 'next' | 'prev'
  ) => {
    const sequence: ColumnId[] = ['todo', 'in_progress', 'review', 'done'];
    const currentIndex = sequence.indexOf(currentStatus);
    const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (targetIndex >= 0 && targetIndex < sequence.length) {
      updateStatusMutation.mutate({
        id: taskId,
        status: sequence[targetIndex],
      });
    }
  };

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((col) => (
          <div
            key={col.id}
            className="p-4 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800/80 min-h-[480px] animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Board Controls / Milestone Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-400" />
          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Filter Milestone:
          </span>
          <select
            value={selectedMilestoneFilter}
            onChange={(e) => setSelectedMilestoneFilter(e.target.value)}
            className="px-2.5 py-1 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Delivery Phases ({tasks.length})</option>
            {milestones.map((m) => (
              <option key={m._id} value={m._id}>
                Phase: {m.title}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => onOpenCreateTask('todo', selectedMilestoneFilter !== 'all' ? selectedMilestoneFilter : undefined)}
          className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Drag and Drop Context */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className={cn(
                  'p-4 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/60 border flex flex-col justify-between min-h-[500px]',
                  col.borderAccent
                )}
              >
                <div className="space-y-3">
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200/60 dark:border-neutral-800/60">
                    <div className="flex items-center gap-2">
                      <span className={cn('w-2 h-2 rounded-full', col.dotColor)} />
                      <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        {col.title}
                      </h3>
                      <span className={cn('px-1.5 py-0.5 text-[10px] font-bold rounded-full', col.badgeBg)}>
                        {colTasks.length}
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenCreateTask(col.id)}
                      className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors"
                      title={`Add task to ${col.title}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Droppable Area */}
                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                          'space-y-2.5 min-h-[380px] p-1 rounded-xl transition-colors',
                          snapshot.isDraggingOver && 'bg-indigo-50/50 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20'
                        )}
                      >
                        {colTasks.length === 0 && !snapshot.isDraggingOver ? (
                          <div className="h-32 flex flex-col items-center justify-center text-center p-3 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-400 text-xs">
                            <span>Drop tasks here</span>
                          </div>
                        ) : (
                          colTasks.map((task, index) => {
                            const milestoneTitle =
                              typeof task.milestoneId === 'object'
                                ? (task.milestoneId as any)?.title
                                : null;
                            const deadline = formatRelativeDeadline(task.dueDate);

                            return (
                              <Draggable
                                key={task._id}
                                draggableId={task._id}
                                index={index}
                              >
                                {(dragProvided, dragSnapshot) => (
                                  <div
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    className={cn(
                                      'p-3.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 shadow-sm transition-all space-y-2.5 group cursor-grab active:cursor-grabbing',
                                      dragSnapshot.isDragging && 'shadow-2xl ring-2 ring-indigo-500 scale-[1.02] rotate-1 z-50 bg-white dark:bg-neutral-800'
                                    )}
                                  >
                                    {/* Priority & Top Actions */}
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-1.5">
                                        <div
                                          {...dragProvided.dragHandleProps}
                                          className="text-neutral-300 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-300 cursor-grab"
                                        >
                                          <GripVertical className="w-3.5 h-3.5" />
                                        </div>
                                        <span
                                          className={cn(
                                            'px-2 py-0.5 text-[10px] rounded-md uppercase tracking-wider',
                                            priorityBadges[task.priority] || 'bg-neutral-100 text-neutral-600'
                                          )}
                                        >
                                          {task.priority}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                          onClick={() => onOpenEditTask(task)}
                                          className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                          title="Edit Task"
                                        >
                                          <Edit2 className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            if (confirm('Delete task?')) deleteTaskMutation.mutate(task._id);
                                          }}
                                          className="p-1 text-neutral-400 hover:text-rose-500 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                          title="Delete Task"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Title & Description */}
                                    <div className="space-y-1">
                                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-2 leading-snug">
                                        {task.title}
                                      </h4>
                                      {task.description && (
                                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                                          {task.description}
                                        </p>
                                      )}
                                    </div>

                                    {/* Milestone Badge */}
                                    {milestoneTitle && (
                                      <div className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md truncate border border-indigo-200/40 dark:border-indigo-800/40">
                                        <Milestone className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate">{milestoneTitle}</span>
                                      </div>
                                    )}

                                    {/* Card Footer: Hours, Due Date, and Shift Controls */}
                                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-700/60 flex items-center justify-between text-[10px] text-neutral-400">
                                      <div className="flex items-center gap-2">
                                        {task.estimatedHours ? (
                                          <span className="font-semibold text-neutral-600 dark:text-neutral-300">
                                            {task.loggedHours > 0 ? `${task.loggedHours}/` : ''}{task.estimatedHours}h
                                          </span>
                                        ) : null}

                                        {task.dueDate && (
                                          <span
                                            className={cn(
                                              'flex items-center gap-1 font-medium',
                                              deadline.isOverdue
                                                ? 'text-rose-500 font-bold'
                                                : deadline.isUrgent
                                                ? 'text-amber-500 font-semibold'
                                                : 'text-neutral-500'
                                            )}
                                          >
                                            <Clock className="w-3 h-3" />
                                            <span>{deadline.text}</span>
                                          </span>
                                        )}
                                      </div>

                                      {/* Quick Shift fallback */}
                                      <div className="flex items-center gap-1">
                                        {col.id !== 'todo' && (
                                          <button
                                            onClick={() => handleShiftStatus(task._id, task.status, 'prev')}
                                            className="p-1 rounded bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 text-neutral-600 dark:text-neutral-300"
                                            title="Move Left"
                                          >
                                            <ArrowLeft className="w-2.5 h-2.5" />
                                          </button>
                                        )}
                                        {col.id !== 'done' && (
                                          <button
                                            onClick={() => handleShiftStatus(task._id, task.status, 'next')}
                                            className="p-1 rounded bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400"
                                            title="Move Right"
                                          >
                                            <ArrowRight className="w-2.5 h-2.5" />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>

                {/* Quick Add Button at bottom of column */}
                <button
                  onClick={() => onOpenCreateTask(col.id)}
                  className="w-full py-2 mt-3 text-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-400 transition-colors"
                >
                  + Add Card
                </button>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}

export default KanbanBoard;
