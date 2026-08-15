import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMilestone extends Document {
  projectId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  allocatedAmount?: number;
  order: number;
  status: 'pending' | 'in_progress' | 'completed' | 'invoiced';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema: Schema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    allocatedAmount: { type: Number },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'invoiced'],
      default: 'pending',
      required: true,
    },
    dueDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Indexes
MilestoneSchema.index({ projectId: 1, order: 1 });
MilestoneSchema.index({ status: 1 });

const Milestone: Model<IMilestone> =
  mongoose.models.Milestone || mongoose.model<IMilestone>('Milestone', MilestoneSchema);

export default Milestone;
