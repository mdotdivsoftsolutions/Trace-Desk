import { z } from 'zod';

export const SettingsCurrencyEnum = z.enum(['INR', 'USD', 'EUR', 'AED', 'GBP']);

export const bankDetailsSchema = z.object({
  id: z.string().optional(),
  accountLabel: z.string().max(100).optional().or(z.literal('')),
  bankName: z.string().max(100).optional().or(z.literal('')),
  accountName: z.string().max(100).optional().or(z.literal('')),
  accountNumber: z.string().max(50).optional().or(z.literal('')),
  ifscCode: z.string().max(20).optional().or(z.literal('')),
  upiId: z.string().max(50).optional().or(z.literal('')),
  swiftCode: z.string().max(20).optional().or(z.literal('')),
  accountType: z.string().max(50).optional().or(z.literal('')),
  isPrimary: z.boolean().optional(),
});

export const updateSettingsSchema = z.object({
  agencyName: z.string().min(1, 'Agency name is required').max(100).default('M.Div Softsolutions'),
  agencyEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  agencyPhone: z.string().max(30).optional().or(z.literal('')),
  agencyAddress: z.string().max(500).optional().or(z.literal('')),
  gstinOrTaxId: z.string().max(50).optional().or(z.literal('')),
  taxNumber: z.string().max(50).optional().or(z.literal('')),
  defaultCurrency: SettingsCurrencyEnum.default('INR'),
  currencySymbol: z.string().min(1).max(10).default('₹'),
  hourlyRate: z.number().min(0).optional(),
  paymentTermsDays: z.number().min(0).optional(),
  bankDetails: bankDetailsSchema.optional(),
  bankAccounts: z.array(bankDetailsSchema).optional(),
  invoicePrefix: z.string().min(1, 'Invoice prefix is required').max(20).default('MDIV-'),
  nextInvoiceNumber: z.number().min(1).optional(),
  invoiceNotes: z.string().max(2000).optional().or(z.literal('')),
  defaultTaxRate: z.number().min(0).max(100).default(18),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
