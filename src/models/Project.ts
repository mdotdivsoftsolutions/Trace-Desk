import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProject extends Document {
  clientId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: 'discovery' | 'in_progress' | 'review' | 'completed' | 'on_hold';
  budgetType: 'fixed' | 'hourly';
  totalBudget?: number;
  currency: string;
  repoUrl?: string;
  liveUrl?: string;
  techStack?: string[];
  progressPercentage: number;
  startDate?: Date;
  targetDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ['discovery', 'in_progress', 'review', 'completed', 'on_hold'],
      default: 'discovery',
      required: true,
    },
    budgetType: {
      type: String,
      enum: ['fixed', 'hourly'],
      required: true,
    },
    totalBudget: { type: Number },
    currency: { type: String, required: true, default: 'INR' },
    repoUrl: { type: String },
    liveUrl: { type: String },
    techStack: [{ type: String }],
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
    startDate: { type: Date },
    targetDeadline: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Indexes
ProjectSchema.index({ clientId: 1 });
ProjectSchema.index({ status: 1 });

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
