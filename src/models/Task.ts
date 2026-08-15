import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITask extends Document {
  projectId: mongoose.Types.ObjectId;
  milestoneId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'todo' | 'in_progress' | 'review' | 'done';
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
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      required: true,
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'review', 'done'],
      default: 'todo',
      required: true,
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

const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
