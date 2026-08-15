import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBankDetails {
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
  swiftCode?: string;
}

export interface ISettings extends Document {
  agencyName: string;
  agencyEmail?: string;
  agencyPhone?: string;
  agencyAddress?: string;
  gstinOrTaxId?: string;
  defaultCurrency: 'INR' | 'USD' | 'EUR' | 'AED' | 'GBP';
  currencySymbol: string;
  bankDetails?: IBankDetails;
  invoicePrefix: string;
  defaultTaxRate: number;
  createdAt: Date;
  updatedAt: Date;
}

const BankDetailsSchema = new Schema<IBankDetails>(
  {
    bankName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    upiId: { type: String },
    swiftCode: { type: String },
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
    gstinOrTaxId: { type: String },
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
    bankDetails: {
      type: BankDetailsSchema,
      default: () => ({}),
    },
    invoicePrefix: {
      type: String,
      default: 'MDIV-',
      required: true,
    },
    defaultTaxRate: {
      type: Number,
      default: 18,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
