import { z } from 'zod';

export const MilestoneStatusEnum = z.enum(['pending', 'in_progress', 'completed', 'invoiced', 'cancelled']);

export const createMilestoneSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required').regex(/^[0-9a-fA-F]{24}$/, 'Invalid Project ObjectId'),
  title: z.string().min(1, 'Milestone title is required').max(200, 'Title cannot exceed 200 characters'),
  description: z.string().max(10000, 'Description cannot exceed 10000 characters').optional().or(z.literal('')),
  allocatedAmount: z.number().min(0, 'Allocated amount must be non-negative').optional(),
  amount: z.number().min(0, 'Amount must be non-negative').optional(),
  order: z.number().int().min(0).default(0),
  status: MilestoneStatusEnum.default('pending'),
  dueDate: z.coerce.date().optional(),
  invoiceId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Invoice ObjectId').optional().or(z.literal('')),
});

export const updateMilestoneSchema = createMilestoneSchema.partial();

export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;
export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;
