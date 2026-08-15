import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITask extends Document {
  projectId: mongoose.Types.ObjectId;
  milestoneId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical' | 'urgent';
  status: 'todo' | 'in_progress' | 'review' | 'done';
  order: number;
  estimatedHours?: number;
  loggedHours: number;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    milestoneId: {
      type: Schema.Types.ObjectId,
      ref: 'Milestone',
    },
    title: { type: String, required: true },
    description: { type: String },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical', 'urgent'],
      default: 'medium',
      required: true,
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'review', 'done'],
      default: 'todo',
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    estimatedHours: { type: Number },
    loggedHours: { type: Number, default: 0 },
    dueDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Indexes
TaskSchema.index({ projectId: 1 });
TaskSchema.index({ milestoneId: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ order: 1 });
TaskSchema.index({ projectId: 1, status: 1, order: 1 });

if (mongoose.models.Task && !mongoose.models.Task.schema.path('order')) {
  delete mongoose.models.Task;
}

const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
