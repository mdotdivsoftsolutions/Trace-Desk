import { z } from 'zod';

export const InvoiceStatusEnum = z.enum(['draft', 'sent', 'partially_paid', 'paid', 'overdue', 'cancelled']);

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Item description is required'),
  milestoneId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Milestone ObjectId').optional().or(z.literal('')),
  quantity: z.number().positive('Quantity must be greater than 0').default(1),
  unitPrice: z.number().min(0, 'Unit price must be non-negative'),
  amount: z.number().min(0, 'Amount must be non-negative').optional(), // can be computed automatically
});

export const createInvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  clientId: z.string().min(1, 'Client ID is required').regex(/^[0-9a-fA-F]{24}$/, 'Invalid Client ObjectId'),
  projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Project ObjectId').optional().or(z.literal('')),
  items: z.array(invoiceItemSchema).min(1, 'Invoice must have at least one line item'),
  taxRate: z.number().min(0, 'Tax rate must be non-negative').max(100, 'Tax rate cannot exceed 100%').default(0),
  discountAmount: z.number().min(0, 'Discount must be non-negative').default(0),
  currency: z.string().min(1, 'Currency is required').default('USD'),
  status: InvoiceStatusEnum.default('draft'),
  issueDate: z.coerce.date().default(() => new Date()),
  dueDate: z.coerce.date(),
  notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional(),
});

export const updateInvoiceSchema = createInvoiceSchema.partial();

export type InvoiceItemInput = z.infer<typeof invoiceItemSchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
