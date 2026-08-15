import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProjectLink {
  title: string;
  url: string;
  category?: 'production' | 'staging' | 'development' | 'repository' | 'design' | 'api' | 'other';
}

export interface IProjectCredential {
  serviceName?: string;
  title?: string;
  accountId?: string;
  username?: string;
  accessKeyOrUrl?: string;
  password?: string;
  url?: string;
  environment?: string;
  notes?: string;
}

export interface IProject extends Document {
  clientId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: 'discovery' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled';
  budgetType: 'fixed' | 'hourly';
  totalBudget?: number;
  currency: string;
  repoUrl?: string;
  liveUrl?: string;
  links?: IProjectLink[];
  credentials?: IProjectCredential[];
  integrationNotes?: string;
  techStack?: string[];
  progressPercentage: number;
  isPinned?: boolean;
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
      enum: ['discovery', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled'],
      default: 'discovery',
      required: true,
    },
    budgetType: {
      type: String,
      enum: ['fixed', 'hourly'],
      default: 'fixed',
      required: true,
    },
    totalBudget: { type: Number },
    currency: { type: String, required: true, default: 'INR' },
    repoUrl: { type: String },
    liveUrl: { type: String },
    links: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        category: {
          type: String,
          enum: ['production', 'staging', 'development', 'repository', 'design', 'api', 'other'],
          default: 'production',
        },
      },
    ],
    credentials: [
      {
        serviceName: { type: String },
        title: { type: String },
        accountId: { type: String },
        username: { type: String },
        accessKeyOrUrl: { type: String },
        password: { type: String },
        url: { type: String },
        environment: { type: String, default: 'development' },
        notes: { type: String },
      },
    ],
    integrationNotes: { type: String },
    techStack: [{ type: String }],
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
    isPinned: { type: Boolean, default: false },
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
ProjectSchema.index({ isPinned: -1, createdAt: -1 });

if (mongoose.models.Project && !mongoose.models.Project.schema.path('isPinned')) {
  delete (mongoose.models as Record<string, unknown>).Project;
}

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
