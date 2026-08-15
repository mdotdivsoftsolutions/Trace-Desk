import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IInvoiceItem {
  description: string;
  milestoneId?: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  clientId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  items: IInvoiceItem[];
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  currency: string;
  status: 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';
  issueDate: Date;
  dueDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>({
  description: { type: String, required: true },
  milestoneId: { type: Schema.Types.ObjectId, ref: 'Milestone' },
  quantity: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true },
  amount: { type: Number, required: true },
});

const InvoiceSchema: Schema = new Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
    items: [InvoiceItemSchema],
    subtotal: { type: Number, required: true },
    taxRate: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    balanceDue: { type: Number, required: true },
    currency: { type: String, required: true, default: 'INR' },
    status: {
      type: String,
      enum: ['draft', 'sent', 'partially_paid', 'paid', 'overdue', 'cancelled'],
      default: 'draft',
      required: true,
    },
    issueDate: { type: Date, required: true, default: Date.now },
    dueDate: { type: Date, required: true },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

// Indexes
InvoiceSchema.index({ invoiceNumber: 1 });
InvoiceSchema.index({ clientId: 1 });
InvoiceSchema.index({ projectId: 1 });
InvoiceSchema.index({ status: 1 });

const Invoice: Model<IInvoice> =
  mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);

export default Invoice;
