import { z } from 'zod';

export const ProjectStatusEnum = z.enum(['discovery', 'in_progress', 'review', 'completed', 'on_hold']);
export const BudgetTypeEnum = z.enum(['fixed', 'hourly']);

export const createProjectSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required').regex(/^[0-9a-fA-F]{24}$/, 'Invalid Client ObjectId'),
  title: z.string().min(1, 'Project title is required').max(150, 'Title cannot exceed 150 characters'),
  description: z.string().max(5000, 'Description cannot exceed 5000 characters').optional(),
  status: ProjectStatusEnum.default('discovery'),
  budgetType: BudgetTypeEnum.default('fixed'),
  totalBudget: z.number().min(0, 'Total budget must be non-negative').optional(),
  currency: z.string().min(1, 'Currency is required').default('INR'),
  repoUrl: z.string().url('Invalid repository URL').optional().or(z.literal('')),
  liveUrl: z.string().url('Invalid deployment URL').optional().or(z.literal('')),
  techStack: z.array(z.string()).default([]),
  progressPercentage: z.number().min(0).max(100).default(0),
  startDate: z.coerce.date().optional(),
  targetDeadline: z.coerce.date().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
