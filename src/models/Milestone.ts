import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMilestone extends Document {
  projectId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  allocatedAmount?: number;
  amount?: number;
  invoiceId?: mongoose.Types.ObjectId;
  order: number;
  status: 'pending' | 'in_progress' | 'completed' | 'invoiced' | 'cancelled';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMilestoneModel extends Model<IMilestone> {
  recalculateProjectBudget(projectId: mongoose.Types.ObjectId | string): Promise<number>;
}

const MilestoneSchema = new Schema<IMilestone, IMilestoneModel>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    allocatedAmount: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    invoiceId: {
      type: Schema.Types.ObjectId,
      ref: 'Invoice',
    },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'invoiced', 'cancelled'],
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

export async function recalculateProjectBudget(projectId: mongoose.Types.ObjectId | string): Promise<number> {
  if (!projectId) return 0;
  const targetId = typeof projectId === 'string' ? new mongoose.Types.ObjectId(projectId) : projectId;

  const allMilestones = await Milestone.find({ projectId: targetId, status: { $ne: 'cancelled' } });

  let totalBudget = 0;
  let progressPercentage = 0;

  if (allMilestones.length > 0) {
    const totalAmount = allMilestones.reduce((sum, m) => sum + (m.allocatedAmount ?? m.amount ?? 0), 0);
    const completedMilestones = allMilestones.filter((m) => m.status === 'completed' || m.status === 'invoiced');
    const completedAmount = completedMilestones.reduce((sum, m) => sum + (m.allocatedAmount ?? m.amount ?? 0), 0);

    totalBudget = totalAmount;
    if (totalAmount > 0) {
      progressPercentage = Math.min(100, Math.max(0, Math.round((completedAmount / totalAmount) * 100)));
    } else {
      progressPercentage = Math.min(100, Math.max(0, Math.round((completedMilestones.length / allMilestones.length) * 100)));
    }
  } else {
    // If no milestones exist for this project, check tasks
    const TaskModel = mongoose.models.Task;
    if (TaskModel) {
      const totalTasks = await TaskModel.countDocuments({ projectId: targetId });
      if (totalTasks > 0) {
        const doneTasks = await TaskModel.countDocuments({ projectId: targetId, status: 'done' });
        progressPercentage = Math.min(100, Math.max(0, Math.round((doneTasks / totalTasks) * 100)));
      }
    }
  }

  await mongoose.model('Project').findByIdAndUpdate(targetId, { totalBudget, progressPercentage });
  return totalBudget;
}

MilestoneSchema.statics.recalculateProjectBudget = recalculateProjectBudget;

MilestoneSchema.post('save', function (doc) {
  if (doc?.projectId) {
    recalculateProjectBudget(doc.projectId).catch((err) => console.error('Error recalculating budget on save:', err));
  }
});

MilestoneSchema.post('findOneAndDelete', function (doc) {
  if (doc?.projectId) {
    recalculateProjectBudget(doc.projectId).catch((err) => console.error('Error recalculating budget on delete:', err));
  }
});

MilestoneSchema.post('findOneAndUpdate', function (doc) {
  if (doc?.projectId) {
    recalculateProjectBudget(doc.projectId).catch((err) => console.error('Error recalculating budget on update:', err));
  }
});

const Milestone: IMilestoneModel =
  (mongoose.models.Milestone as IMilestoneModel) ||
  mongoose.model<IMilestone, IMilestoneModel>('Milestone', MilestoneSchema);

// Guarantee method exists on cached model instances (e.g. across Next.js HMR)
if (!Milestone.recalculateProjectBudget) {
  Milestone.recalculateProjectBudget = recalculateProjectBudget;
}

export default Milestone;
