import { z } from 'zod';

export const PaymentMethodEnum = z.enum([
  'bank_transfer',
  'stripe',
  'upi',
  'paypal',
  'wire',
  'cash',
]);

export const createPaymentSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice ID is required').regex(/^[0-9a-fA-F]{24}$/, 'Invalid Invoice ObjectId'),
  clientId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Client ObjectId').optional(), // can be inferred from invoice
  amount: z.number().positive('Payment amount must be greater than 0'),
  paymentMethod: PaymentMethodEnum,
  transactionReference: z.string().max(150, 'Transaction reference cannot exceed 150 characters').optional(),
  paymentDate: z.coerce.date().default(() => new Date()),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
});

export const updatePaymentSchema = createPaymentSchema.partial();

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
