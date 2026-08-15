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

MilestoneSchema.statics.recalculateProjectBudget = async function (projectId: mongoose.Types.ObjectId) {
  const result = await this.aggregate([
    { $match: { projectId: new mongoose.Types.ObjectId(projectId) } },
    { $group: { _id: '$projectId', totalBudget: { $sum: '$allocatedAmount' } } }
  ]);
  
  const totalBudget = result.length > 0 ? result[0].totalBudget : 0;
  
  await mongoose.model('Project').findByIdAndUpdate(projectId, { totalBudget });
};

MilestoneSchema.post('save', function (doc) {
  (this.constructor as any).recalculateProjectBudget(doc.projectId);
});

MilestoneSchema.post('findOneAndDelete', function (doc) {
  if (doc) {
    (doc.constructor as any).recalculateProjectBudget(doc.projectId);
  }
});

MilestoneSchema.post('findOneAndUpdate', function (doc) {
  if (doc) {
    (doc.constructor as any).recalculateProjectBudget(doc.projectId);
  }
});

const Milestone =
  mongoose.models.Milestone || mongoose.model('Milestone', MilestoneSchema);

export default Milestone;

