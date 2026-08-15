import { z } from 'zod';

export const TaskPriorityEnum = z.enum(['low', 'medium', 'high', 'critical', 'urgent']);
export const TaskStatusEnum = z.enum(['todo', 'in_progress', 'review', 'done']);

export const createTaskSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required').regex(/^[0-9a-fA-F]{24}$/, 'Invalid Project ObjectId'),
  milestoneId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Milestone ObjectId').optional().or(z.literal('')),
  title: z.string().min(1, 'Task title is required').max(200, 'Title cannot exceed 200 characters'),
  description: z.string().max(5000, 'Description cannot exceed 5000 characters').optional(),
  priority: TaskPriorityEnum.default('medium'),
  status: TaskStatusEnum.default('todo'),
  estimatedHours: z.number().min(0, 'Estimated hours must be non-negative').optional(),
  loggedHours: z.number().min(0, 'Logged hours must be non-negative').default(0),
  dueDate: z.coerce.date().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const updateTaskStatusSchema = z.object({
  status: TaskStatusEnum,
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
