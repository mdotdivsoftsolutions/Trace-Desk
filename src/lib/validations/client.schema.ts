import { z } from 'zod';

export const ClientCurrencyEnum = z.enum(['USD', 'EUR', 'INR', 'AED', 'GBP']);
export const ClientStatusEnum = z.enum(['active', 'inactive']);

export const createClientSchema = z.object({
  name: z.string().min(1, 'Client name is required').max(100, 'Name cannot exceed 100 characters'),
  companyName: z.string().max(150, 'Company name cannot exceed 150 characters').optional(),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().max(30, 'Phone number cannot exceed 30 characters').optional(),
  country: z.string().max(100, 'Country cannot exceed 100 characters').optional(),
  currency: ClientCurrencyEnum.default('INR'),
  notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional(),
  status: ClientStatusEnum.default('active'),
});

export const updateClientSchema = createClientSchema.partial();

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
