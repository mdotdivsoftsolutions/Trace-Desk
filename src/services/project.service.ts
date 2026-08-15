import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { Project, Milestone, Task, Invoice, IProject } from '@/models';
import { CreateProjectInput, UpdateProjectInput } from '@/lib/validations/project.schema';

export class ProjectService {
  static async createProject(data: CreateProjectInput): Promise<IProject> {
    await dbConnect();
    const projectData: any = {
      ...data,
      clientId: new mongoose.Types.ObjectId(data.clientId),
    };
    return Project.create(projectData);
  }

  static async getProjects(filter: {
    clientId?: string;
    status?: string;
    search?: string;
  } = {}): Promise<IProject[]> {
    await dbConnect();
    const query: any = {};

    if (filter.clientId) {
      query.clientId = new mongoose.Types.ObjectId(filter.clientId);
    }

    if (filter.status) {
      query.status = filter.status;
    }

    if (filter.search) {
      query.$or = [
        { title: { $regex: filter.search, $options: 'i' } },
        { description: { $regex: filter.search, $options: 'i' } },
      ];
    }

    return Project.find(query)
      .populate('clientId', 'name companyName email currency')
      .sort({ createdAt: -1 });
  }

  static async getProjectById(id: string): Promise<any> {
    await dbConnect();
    const project = await Project.findById(id).populate('clientId', 'name companyName email currency');
    if (!project) return null;

    const milestones = await Milestone.find({ projectId: project._id }).sort({ order: 1 });
    const tasks = await Task.find({ projectId: project._id }).sort({ createdAt: -1 });
    const invoices = await Invoice.find({ projectId: project._id }).sort({ createdAt: -1 });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'done').length;

    return {
      ...project.toObject(),
      milestones,
      tasks,
      invoices,
      stats: {
        totalTasks,
        completedTasks,
        completionPercentage:
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : project.progressPercentage,
      },
    };
  }

  static async updateProject(id: string, data: UpdateProjectInput): Promise<IProject | null> {
    await dbConnect();
    const updateData: any = { ...data };
    if (data.clientId) {
      updateData.clientId = new mongoose.Types.ObjectId(data.clientId);
    }
    return Project.findByIdAndUpdate(id, updateData, { new: true });
  }

  static async deleteProject(id: string): Promise<boolean> {
    await dbConnect();
    const res = await Project.findByIdAndDelete(id);
    if (!res) return false;

    // Cascade delete linked tasks and milestones
    await Task.deleteMany({ projectId: res._id });
    await Milestone.deleteMany({ projectId: res._id });

    return true;
  }
}

export default ProjectService;
