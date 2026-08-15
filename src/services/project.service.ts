import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { Project, Client, Milestone, Task, Invoice, IProject } from '@/models';
import { CreateProjectInput, UpdateProjectInput } from '@/lib/validations/project.schema';

export interface PaginatedProjectsResult {
  items: IProject[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export class ProjectService {
  static async createProject(data: CreateProjectInput): Promise<IProject> {
    await dbConnect();
    const projectData: Record<string, unknown> = {
      ...data,
      clientId: new mongoose.Types.ObjectId(data.clientId),
    };
    return Project.create(projectData);
  }

  static async getProjects(
    filter: {
      clientId?: string;
      status?: string;
      search?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<PaginatedProjectsResult> {
    await dbConnect();
    const query: Record<string, unknown> = {};

    if (filter.clientId && filter.clientId !== 'all') {
      query.clientId = new mongoose.Types.ObjectId(filter.clientId);
    }

    if (filter.status && filter.status !== 'all') {
      query.status = filter.status;
    }

    if (filter.startDate || filter.endDate) {
      const dateCond: Record<string, unknown> = {};
      if (filter.startDate) {
        dateCond.$gte = new Date(filter.startDate);
      }
      if (filter.endDate) {
        const end = new Date(filter.endDate);
        end.setHours(23, 59, 59, 999);
        dateCond.$lte = end;
      }
      query.createdAt = dateCond;
    }

    if (filter.search && filter.search.trim()) {
      const searchRegex = new RegExp(
        filter.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'i'
      );

      const matchingClients = await Client.find({
        $or: [
          { name: searchRegex },
          { companyName: searchRegex },
        ],
      }).select('_id').lean();
      const matchingClientIds = matchingClients.map((c) => c._id);

      const orConditions: Record<string, unknown>[] = [
        { title: searchRegex },
        { description: searchRegex },
      ];

      if (matchingClientIds.length > 0) {
        orConditions.push({ clientId: { $in: matchingClientIds } });
      }

      query.$or = orConditions;
    }

    const page = Math.max(1, Number(filter.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(filter.limit) || 12));
    const skip = (page - 1) * limit;

    const [total, rawProjects] = await Promise.all([
      Project.countDocuments(query),
      Project.find(query)
        .populate('clientId', 'name companyName email currency')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    const projectIds = rawProjects.map((p) => p._id);
    const milestones = await Milestone.find({
      projectId: { $in: projectIds },
      status: { $ne: 'cancelled' },
    });

    const milestonesByProject = new Map<string, typeof milestones>();
    for (const m of milestones) {
      const pid = m.projectId.toString();
      if (!milestonesByProject.has(pid)) {
        milestonesByProject.set(pid, []);
      }
      milestonesByProject.get(pid)!.push(m);
    }

    const items = rawProjects.map((project) => {
      const pObj = project.toObject();
      const pMilestones = milestonesByProject.get(project._id.toString()) || [];

      if (pMilestones.length > 0) {
        const totalAmount = pMilestones.reduce((sum, m) => sum + (m.allocatedAmount ?? m.amount ?? 0), 0);
        const completedMilestones = pMilestones.filter((m) => m.status === 'completed' || m.status === 'invoiced');
        const completedAmount = completedMilestones.reduce((sum, m) => sum + (m.allocatedAmount ?? m.amount ?? 0), 0);

        const totalBudget = totalAmount > 0 ? totalAmount : (project.totalBudget || 0);
        const progressPercentage =
          totalAmount > 0
            ? Math.min(100, Math.max(0, Math.round((completedAmount / totalAmount) * 100)))
            : Math.min(100, Math.max(0, Math.round((completedMilestones.length / pMilestones.length) * 100)));

        pObj.totalBudget = totalBudget;
        pObj.progressPercentage = progressPercentage;

        if (project.progressPercentage !== progressPercentage || project.totalBudget !== totalBudget) {
          Project.findByIdAndUpdate(project._id, { totalBudget, progressPercentage }).catch(() => {});
        }
      }

      return pObj;
    });

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items: items as unknown as IProject[],
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  static async getProjectById(id: string): Promise<Record<string, unknown> | null> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const project = await Project.findById(id).populate('clientId', 'name companyName email currency');
    if (!project) return null;

    const milestones = await Milestone.find({ projectId: project._id }).sort({ order: 1 });
    const tasks = await Task.find({ projectId: project._id }).sort({ createdAt: -1 });
    const invoices = await Invoice.find({ projectId: project._id }).sort({ createdAt: -1 });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'done').length;

    const projectObj = project.toObject();

    let totalBudget = project.totalBudget ?? 0;
    let progressPercentage = project.progressPercentage ?? 0;

    const validMilestones = milestones.filter((m) => m.status !== 'cancelled');
    if (validMilestones.length > 0) {
      const milestoneBudgetSum = validMilestones.reduce((sum, m) => sum + (m.allocatedAmount ?? m.amount ?? 0), 0);
      const completedMilestones = validMilestones.filter((m) => m.status === 'completed' || m.status === 'invoiced');
      const completedBudgetSum = completedMilestones.reduce((sum, m) => sum + (m.allocatedAmount ?? m.amount ?? 0), 0);

      totalBudget = milestoneBudgetSum;
      progressPercentage =
        milestoneBudgetSum > 0
          ? Math.min(100, Math.max(0, Math.round((completedBudgetSum / milestoneBudgetSum) * 100)))
          : Math.min(100, Math.max(0, Math.round((completedMilestones.length / validMilestones.length) * 100)));

      if (totalBudget !== project.totalBudget || progressPercentage !== project.progressPercentage) {
        projectObj.totalBudget = totalBudget;
        projectObj.progressPercentage = progressPercentage;
        await Project.findByIdAndUpdate(project._id, { totalBudget, progressPercentage });
      }
    } else if (totalTasks > 0) {
      progressPercentage = Math.min(100, Math.max(0, Math.round((completedTasks / totalTasks) * 100)));
      if (progressPercentage !== project.progressPercentage) {
        projectObj.progressPercentage = progressPercentage;
        await Project.findByIdAndUpdate(project._id, { progressPercentage });
      }
    }

    projectObj.progressPercentage = progressPercentage;
    projectObj.totalBudget = totalBudget;

    return {
      ...projectObj,
      milestones,
      tasks,
      invoices,
      stats: {
        totalTasks,
        completedTasks,
        completionPercentage: progressPercentage,
      },
    };
  }

  static async updateProject(id: string, data: UpdateProjectInput): Promise<IProject | null> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const updateData: Record<string, unknown> = { ...data };
    if (data.clientId) {
      updateData.clientId = new mongoose.Types.ObjectId(data.clientId);
    }
    return Project.findByIdAndUpdate(id, updateData, { new: true });
  }

  static async deleteProject(id: string): Promise<boolean> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const res = await Project.findByIdAndDelete(id);
    if (!res) return false;

    // Cascade delete linked tasks and milestones
    await Task.deleteMany({ projectId: res._id });
    await Milestone.deleteMany({ projectId: res._id });

    return true;
  }
}

export default ProjectService;
