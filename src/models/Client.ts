import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IClient extends Document {
  name: string;
  companyName?: string;
  email: string;
  phone?: string;
  country?: string;
  currency: 'USD' | 'EUR' | 'INR' | 'AED' | 'GBP';
  notes?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    companyName: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    country: { type: String },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'INR', 'AED', 'GBP'],
      default: 'INR',
      required: true,
    },
    notes: { type: String },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ClientSchema.index({ email: 1 });
ClientSchema.index({ status: 1 });

const Client: Model<IClient> =
  mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);

export default Client;
