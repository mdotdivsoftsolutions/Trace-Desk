import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBankDetails {
  id?: string;
  accountLabel?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
  swiftCode?: string;
  accountType?: string;
  isPrimary?: boolean;
}

export interface ISettings extends Document {
  agencyName: string;
  agencyEmail?: string;
  agencyPhone?: string;
  agencyAddress?: string;
  logoUrl?: string;
  gstinOrTaxId?: string;
  taxNumber?: string;
  defaultCurrency: 'INR' | 'USD' | 'EUR' | 'AED' | 'GBP';
  currencySymbol: string;
  hourlyRate?: number;
  paymentTermsDays?: number;
  invoicePrefix: string;
  nextInvoiceNumber?: number;
  invoiceNotes?: string;
  defaultTaxRate: number;
  bankDetails?: IBankDetails;
  bankAccounts?: IBankDetails[];
  createdAt: Date;
  updatedAt: Date;
}

const BankDetailsSchema = new Schema<IBankDetails>(
  {
    id: { type: String },
    accountLabel: { type: String },
    bankName: { type: String },
    accountName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    upiId: { type: String },
    swiftCode: { type: String },
    accountType: { type: String },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const SettingsSchema: Schema = new Schema(
  {
    agencyName: {
      type: String,
      default: 'M.Div Softsolutions',
      required: true,
    },
    agencyEmail: { type: String },
    agencyPhone: { type: String },
    agencyAddress: { type: String },
    logoUrl: { type: String },
    gstinOrTaxId: { type: String },
    taxNumber: { type: String },
    defaultCurrency: {
      type: String,
      enum: ['INR', 'USD', 'EUR', 'AED', 'GBP'],
      default: 'INR',
      required: true,
    },
    currencySymbol: {
      type: String,
      default: '₹',
      required: true,
    },
    hourlyRate: { type: Number, default: 0 },
    paymentTermsDays: { type: Number, default: 14 },
    bankDetails: {
      type: BankDetailsSchema,
      default: () => ({}),
    },
    bankAccounts: {
      type: [BankDetailsSchema],
      default: () => [],
    },
    invoicePrefix: {
      type: String,
      default: 'MDIV-',
      required: true,
    },
    nextInvoiceNumber: {
      type: Number,
      default: 1,
    },
    invoiceNotes: {
      type: String,
    },
    defaultTaxRate: {
      type: Number,
      default: 18,
      required: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

// Ensure model schema updates take effect during development HMR
if (process.env.NODE_ENV !== 'production' && mongoose.models.Settings) {
  delete (mongoose.models as Record<string, unknown>).Settings;
}

const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;

