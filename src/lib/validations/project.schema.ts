import { z } from 'zod';

export const ProjectStatusEnum = z.enum(['discovery', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled']);
export const BudgetTypeEnum = z.enum(['fixed', 'hourly']);
export const LinkCategoryEnum = z.enum(['production', 'staging', 'development', 'repository', 'design', 'api', 'other']);

export const projectLinkSchema = z.object({
  title: z.string().min(1, 'Link title is required'),
  url: z.string().min(1, 'URL is required'),
  category: LinkCategoryEnum.optional().default('production'),
});

export const projectCredentialSchema = z.object({
  serviceName: z.string().optional(),
  title: z.string().optional(),
  accountId: z.string().optional(),
  username: z.string().optional(),
  accessKeyOrUrl: z.string().optional(),
  password: z.string().optional(),
  url: z.string().optional(),
  environment: z.string().optional().default('development'),
  notes: z.string().optional(),
});

export const createProjectSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required').regex(/^[0-9a-fA-F]{24}$/, 'Invalid Client ObjectId'),
  title: z.string().min(1, 'Project title is required').max(150, 'Title cannot exceed 150 characters'),
  description: z.string().optional(),
  status: ProjectStatusEnum.default('discovery'),
  budgetType: BudgetTypeEnum.default('fixed'),
  totalBudget: z.number().min(0, 'Total budget must be non-negative').optional(),
  currency: z.string().min(1, 'Currency is required').default('INR'),
  repoUrl: z.string().optional().or(z.literal('')),
  liveUrl: z.string().optional().or(z.literal('')),
  links: z.array(projectLinkSchema).optional().default([]),
  credentials: z.array(projectCredentialSchema).optional().default([]),
  integrationNotes: z.string().optional(),
  techStack: z.array(z.string()).default([]),
  progressPercentage: z.number().min(0).max(100).default(0),
  isPinned: z.boolean().optional().default(false),
  startDate: z.coerce.date().optional(),
  targetDeadline: z.coerce.date().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectLinkInput = z.infer<typeof projectLinkSchema>;
export type ProjectCredentialInput = z.infer<typeof projectCredentialSchema>;
