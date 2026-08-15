'use client';

import React from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Task, TaskStatus } from '@/types';
import { useReorderTasks } from '@/hooks/useTasks';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  tasks: Task[];
  projectId?: string;
  showProjectBadge?: boolean;
  onAddTask: (status?: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

const columns: Array<{ id: TaskStatus; title: string }> = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review / QA' },
  { id: 'done', title: 'Done' },
];

export function KanbanBoard({
  tasks,
  projectId,
  showProjectBadge = false,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: KanbanBoardProps) {
  const reorderTasksMutation = useReorderTasks(projectId);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceStatus = source.droppableId as TaskStatus;
    const destStatus = destination.droppableId as TaskStatus;

    if (sourceStatus === destStatus) {
      // Reordering within the same column
      const colTasks = [...tasks.filter((t) => t.status === sourceStatus)];
      const [movedItem] = colTasks.splice(source.index, 1);
      if (!movedItem) return;
      colTasks.splice(destination.index, 0, movedItem);

      const items = colTasks.map((t, idx) => ({
        id: t._id,
        order: idx,
        status: sourceStatus,
      }));

      reorderTasksMutation.mutate({ items });
    } else {
      // Moving to a different column at specific index
      const destTasks = [...tasks.filter((t) => t.status === destStatus)];
      const movedItem = tasks.find((t) => t._id === draggableId);
      if (!movedItem) return;

      destTasks.splice(destination.index, 0, { ...movedItem, status: destStatus });

      const items = destTasks.map((t, idx) => ({
        id: t._id,
        order: idx,
        status: destStatus,
      }));

      reorderTasksMutation.mutate({ items });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <KanbanColumn
              key={col.id}
              status={col.id}
              title={col.title}
              tasks={colTasks}
              showProjectBadge={showProjectBadge}
              onAddTask={(st) => onAddTask(st)}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
}

export default KanbanBoard;
