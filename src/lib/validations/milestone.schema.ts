import { z } from 'zod';

export const MilestoneStatusEnum = z.enum(['pending', 'in_progress', 'completed', 'invoiced']);

export const createMilestoneSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required').regex(/^[0-9a-fA-F]{24}$/, 'Invalid Project ObjectId'),
  title: z.string().min(1, 'Milestone title is required').max(150, 'Title cannot exceed 150 characters'),
  description: z.string().max(3000, 'Description cannot exceed 3000 characters').optional(),
  allocatedAmount: z.number().min(0, 'Allocated amount must be non-negative').optional(),
  order: z.number().int().min(0).default(0),
  status: MilestoneStatusEnum.default('pending'),
  dueDate: z.coerce.date().optional(),
});

export const updateMilestoneSchema = createMilestoneSchema.partial();

export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;
export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;
