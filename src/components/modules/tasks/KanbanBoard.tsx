'use client';

import React from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Task, TaskStatus } from '@/types';
import { useUpdateTaskStatus } from '@/hooks/useTasks';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  tasks: Task[];
  projectId: string;
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
  onAddTask,
  onEditTask,
  onDeleteTask,
}: KanbanBoardProps) {
  const updateTaskStatusMutation = useUpdateTaskStatus(projectId);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as TaskStatus;
    await updateTaskStatusMutation.mutateAsync({
      id: draggableId,
      status: newStatus,
    });
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
