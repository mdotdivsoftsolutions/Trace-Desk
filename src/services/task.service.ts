import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { Task, Project, Milestone, recalculateProjectBudget, ITask } from '@/models';
import { CreateTaskInput, UpdateTaskInput } from '@/lib/validations/task.schema';

export class TaskService {
  /**
   * Recalculates and updates the project's progressPercentage
   * based on milestones or the ratio of completed tasks to total tasks.
   */
  static async calculateAndUpdateProjectProgress(
    projectId: string | mongoose.Types.ObjectId
  ): Promise<number> {
    await dbConnect();
    const pid = typeof projectId === 'string' ? new mongoose.Types.ObjectId(projectId) : projectId;

    const milestoneCount = await Milestone.countDocuments({ projectId: pid, status: { $ne: 'cancelled' } });
    if (milestoneCount > 0) {
      await recalculateProjectBudget(pid);
      const proj = await Project.findById(pid);
      return proj?.progressPercentage || 0;
    }

    const totalTasks = await Task.countDocuments({ projectId: pid });
    if (totalTasks === 0) {
      await Project.findByIdAndUpdate(pid, { progressPercentage: 0 });
      return 0;
    }

    const doneTasks = await Task.countDocuments({
      projectId: pid,
      status: 'done',
    });

    const progressPercentage = Math.min(100, Math.max(0, Math.round((doneTasks / totalTasks) * 100)));

    await Project.findByIdAndUpdate(pid, { progressPercentage });
    return progressPercentage;
  }

  /**
   * Creates a new task and triggers progress recalculation.
   */
  static async createTask(data: CreateTaskInput): Promise<ITask> {
    await dbConnect();

    const taskData: Record<string, unknown> = {
      ...data,
      projectId: new mongoose.Types.ObjectId(data.projectId),
      milestoneId: data.milestoneId ? new mongoose.Types.ObjectId(data.milestoneId) : undefined,
    };

    const task = await Task.create(taskData);
    await this.calculateAndUpdateProjectProgress(task.projectId);
    return task;
  }

  static async getTasks(filter: {
    projectId?: string;
    milestoneId?: string;
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<ITask[]> {
    await dbConnect();
    const query: Record<string, unknown> = {};

    if (filter.projectId) query.projectId = new mongoose.Types.ObjectId(filter.projectId);
    if (filter.milestoneId) query.milestoneId = new mongoose.Types.ObjectId(filter.milestoneId);
    if (filter.status) query.status = filter.status;
    if (filter.priority) query.priority = filter.priority;
    if (filter.search) {
      query.title = { $regex: filter.search, $options: 'i' };
    }

    return Task.find(query)
      .populate('projectId', 'title isPinned status clientId')
      .populate('milestoneId', 'title status')
      .sort({ order: 1, createdAt: -1 })
      .lean();
  }

  /**
   * Retrieves a single task by its ID.
   */
  static async getTaskById(id: string): Promise<ITask | null> {
    await dbConnect();
    return Task.findById(id).populate('milestoneId', 'title status').populate('projectId', 'title');
  }

  /**
   * Bulk reorders tasks and optionally transitions their statuses.
   */
  static async reorderTasks(
    items: Array<{ id: string; order: number; status?: 'todo' | 'in_progress' | 'review' | 'done' }>
  ): Promise<boolean> {
    await dbConnect();
    if (!items || items.length === 0) return true;

    const operations = items.map((item) => {
      const updateFields: Record<string, unknown> = { order: item.order };
      if (item.status) {
        updateFields.status = item.status;
      }
      return {
        updateOne: {
          filter: { _id: new mongoose.Types.ObjectId(item.id) },
          update: { $set: updateFields },
        },
      };
    });

    await Task.bulkWrite(operations);

    // If any item changed status, trigger recalculation for affected projects
    const affectedTask = await Task.findById(items[0].id).select('projectId');
    if (affectedTask?.projectId) {
      await this.calculateAndUpdateProjectProgress(affectedTask.projectId);
    }

    return true;
  }

  /**
   * Updates task details. If status changed, recalculates project progress.
   */
  static async updateTask(id: string, data: UpdateTaskInput): Promise<ITask | null> {
    await dbConnect();
    const existing = await Task.findById(id);
    if (!existing) return null;

    const updateData: Record<string, unknown> = { ...data };
    if (data.projectId) updateData.projectId = new mongoose.Types.ObjectId(data.projectId);
    if (data.milestoneId !== undefined) {
      updateData.milestoneId = data.milestoneId ? new mongoose.Types.ObjectId(data.milestoneId) : undefined;
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });

    if (data.status && data.status !== existing.status) {
      await this.calculateAndUpdateProjectProgress(existing.projectId);
    }

    return updatedTask;
  }

  /**
   * Fast status transition for Kanban drag-and-drop.
   */
  static async updateTaskStatus(id: string, status: 'todo' | 'in_progress' | 'review' | 'done'): Promise<ITask | null> {
    await dbConnect();
    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    if (!task) return null;

    await this.calculateAndUpdateProjectProgress(task.projectId);
    return task;
  }

  /**
   * Deletes a task and recalculates project progress.
   */
  static async deleteTask(id: string): Promise<boolean> {
    await dbConnect();
    const task = await Task.findByIdAndDelete(id);
    if (!task) return false;

    await this.calculateAndUpdateProjectProgress(task.projectId);
    return true;
  }
}

export default TaskService;
