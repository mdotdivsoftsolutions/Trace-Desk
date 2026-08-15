import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPayment extends Document {
  invoiceId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: 'bank_transfer' | 'stripe' | 'upi' | 'paypal' | 'wire' | 'cash';
  transactionReference?: string;
  paymentDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    invoiceId: {
      type: Schema.Types.ObjectId,
      ref: 'Invoice',
      required: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['bank_transfer', 'stripe', 'upi', 'paypal', 'wire', 'cash'],
      required: true,
    },
    transactionReference: { type: String },
    paymentDate: { type: Date, required: true, default: Date.now },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

// Indexes
PaymentSchema.index({ invoiceId: 1 });
PaymentSchema.index({ clientId: 1 });
PaymentSchema.index({ paymentDate: -1 });

const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
