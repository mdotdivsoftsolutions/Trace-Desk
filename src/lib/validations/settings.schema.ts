import { z } from 'zod';

export const SettingsCurrencyEnum = z.enum(['INR', 'USD', 'EUR', 'AED', 'GBP']);

export const bankDetailsSchema = z.object({
  bankName: z.string().max(100).optional().or(z.literal('')),
  accountNumber: z.string().max(50).optional().or(z.literal('')),
  ifscCode: z.string().max(20).optional().or(z.literal('')),
  upiId: z.string().max(50).optional().or(z.literal('')),
  swiftCode: z.string().max(20).optional().or(z.literal('')),
});

export const updateSettingsSchema = z.object({
  agencyName: z.string().min(1, 'Agency name is required').max(100).default('M.Div Softsolutions'),
  agencyEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  agencyPhone: z.string().max(30).optional().or(z.literal('')),
  agencyAddress: z.string().max(500).optional().or(z.literal('')),
  gstinOrTaxId: z.string().max(50).optional().or(z.literal('')),
  defaultCurrency: SettingsCurrencyEnum.default('INR'),
  currencySymbol: z.string().min(1).max(10).default('₹'),
  bankDetails: bankDetailsSchema.optional(),
  invoicePrefix: z.string().min(1, 'Invoice prefix is required').max(20).default('MDIV-'),
  defaultTaxRate: z.number().min(0).max(100).default(18),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
