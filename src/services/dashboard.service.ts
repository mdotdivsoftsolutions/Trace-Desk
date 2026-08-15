import dbConnect from '@/lib/db';
import { Project, Task, Invoice, Payment, Milestone } from '@/models';

export interface DashboardMetrics {
  financials: {
    totalRevenue: number;
    pendingReceivables: number;
    overdueReceivables: number;
    currency: string;
  };
  projects: {
    activeCount: number;
    totalCount: number;
    averageCompletionRate: number;
    statusBreakdown: Record<string, number>;
  };
  tasks: {
    upcomingTasks48h: any[];
    overdueTasks: any[];
    totalOpenTasks: number;
  };
  milestones: {
    unbilledMilestones: any[];
    unbilledTotalAmount: number;
  };
  recentActivities: {
    recentPayments: any[];
    recentProjects: any[];
  };
}

export class DashboardService {
  /**
   * Aggregates all high-level metrics for the executive dashboard with dynamic live milestone progress.
   */
  static async getExecutiveMetrics(): Promise<DashboardMetrics> {
    await dbConnect();

    const now = new Date();
    const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    // 1. Financial Aggregations
    const [financialTotals] = (await Invoice.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$paidAmount' },
          pendingReceivables: { $sum: '$balanceDue' },
        },
      },
    ])) || [{ totalRevenue: 0, pendingReceivables: 0 }];

    const [overdueTotals] = (await Invoice.aggregate([
      {
        $match: {
          status: { $in: ['sent', 'partially_paid', 'overdue'] },
          dueDate: { $lt: now },
        },
      },
      {
        $group: {
          _id: null,
          overdueReceivables: { $sum: '$balanceDue' },
        },
      },
    ])) || [{ overdueReceivables: 0 }];

    // 2. Project Statistics with Live Dynamic Milestone Progress Calculation
    const allRawProjects = await Project.find({}).lean();
    const projectIds = allRawProjects.map((p) => p._id);

    const allMilestones = await Milestone.find({
      projectId: { $in: projectIds },
      status: { $ne: 'cancelled' },
    }).lean();

    const milestonesByProject = new Map<string, typeof allMilestones>();
    for (const m of allMilestones) {
      const pid = m.projectId.toString();
      if (!milestonesByProject.has(pid)) {
        milestonesByProject.set(pid, []);
      }
      milestonesByProject.get(pid)!.push(m);
    }

    const allProjects = allRawProjects.map((p) => {
      const pMilestones = milestonesByProject.get(p._id.toString()) || [];
      let progressPercentage = p.progressPercentage || 0;
      let totalBudget = p.totalBudget || 0;

      if (pMilestones.length > 0) {
        const totalAmount = pMilestones.reduce((sum, m) => sum + (m.allocatedAmount ?? m.amount ?? 0), 0);
        const completedMilestones = pMilestones.filter((m) => m.status === 'completed' || m.status === 'invoiced');
        const completedAmount = completedMilestones.reduce((sum, m) => sum + (m.allocatedAmount ?? m.amount ?? 0), 0);

        totalBudget = totalAmount > 0 ? totalAmount : totalBudget;
        progressPercentage =
          totalAmount > 0
            ? Math.min(100, Math.max(0, Math.round((completedAmount / totalAmount) * 100)))
            : Math.min(100, Math.max(0, Math.round((completedMilestones.length / pMilestones.length) * 100)));

        if (p.progressPercentage !== progressPercentage || p.totalBudget !== totalBudget) {
          Project.findByIdAndUpdate(p._id, { totalBudget, progressPercentage }).catch(() => {});
        }
      }

      return {
        ...p,
        progressPercentage,
        totalBudget,
      };
    });

    const activeProjects = allProjects.filter((p) =>
      ['discovery', 'in_progress', 'review'].includes(p.status)
    );

    const activeCount = activeProjects.length;
    const totalCount = allProjects.length;

    const averageCompletionRate =
      activeCount > 0
        ? Math.round(
            activeProjects.reduce((acc, curr) => acc + (curr.progressPercentage || 0), 0) /
              activeCount
          )
        : 0;

    const statusBreakdown = allProjects.reduce((acc: Record<string, number>, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {});

    // 3. Task Deadlines (Upcoming next 48h & Overdue)
    const upcomingTasks48h = await Task.find({
      status: { $ne: 'done' },
      dueDate: { $gte: now, $lte: in48Hours },
    })
      .populate('projectId', 'title')
      .sort({ dueDate: 1 })
      .limit(10)
      .lean();

    const overdueTasks = await Task.find({
      status: { $ne: 'done' },
      dueDate: { $lt: now },
    })
      .populate('projectId', 'title')
      .sort({ dueDate: 1 })
      .limit(10)
      .lean();

    const totalOpenTasks = await Task.countDocuments({ status: { $ne: 'done' } });

    // 4. Unbilled Milestones (completed but not yet invoiced)
    const unbilledMilestones = await Milestone.find({
      status: 'completed',
    })
      .populate('projectId', 'title clientId currency')
      .sort({ updatedAt: -1 })
      .lean();

    const unbilledTotalAmount = unbilledMilestones.reduce(
      (sum, m) => sum + (m.allocatedAmount || 0),
      0
    );

    // 5. Recent Activities
    const recentPayments = await Payment.find({})
      .populate('clientId', 'name companyName')
      .populate('invoiceId', 'invoiceNumber')
      .sort({ paymentDate: -1 })
      .limit(5)
      .lean();

    const rawRecentProjects = await Project.find({})
      .populate('clientId', 'name companyName')
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean();

    const recentProjects = rawRecentProjects.map((p) => {
      const pMilestones = milestonesByProject.get(p._id.toString()) || [];
      let progressPercentage = p.progressPercentage || 0;
      let totalBudget = p.totalBudget || 0;

      if (pMilestones.length > 0) {
        const totalAmount = pMilestones.reduce((sum, m) => sum + (m.allocatedAmount ?? m.amount ?? 0), 0);
        const completedMilestones = pMilestones.filter((m) => m.status === 'completed' || m.status === 'invoiced');
        const completedAmount = completedMilestones.reduce((sum, m) => sum + (m.allocatedAmount ?? m.amount ?? 0), 0);

        totalBudget = totalAmount > 0 ? totalAmount : totalBudget;
        progressPercentage =
          totalAmount > 0
            ? Math.min(100, Math.max(0, Math.round((completedAmount / totalAmount) * 100)))
            : Math.min(100, Math.max(0, Math.round((completedMilestones.length / pMilestones.length) * 100)));
      }

      return {
        ...p,
        progressPercentage,
        totalBudget,
      };
    });

    return {
      financials: {
        totalRevenue: Number((financialTotals?.totalRevenue || 0).toFixed(2)),
        pendingReceivables: Number((financialTotals?.pendingReceivables || 0).toFixed(2)),
        overdueReceivables: Number((overdueTotals?.overdueReceivables || 0).toFixed(2)),
        currency: 'INR',
      },
      projects: {
        activeCount,
        totalCount,
        averageCompletionRate,
        statusBreakdown,
      },
      tasks: {
        upcomingTasks48h,
        overdueTasks,
        totalOpenTasks,
      },
      milestones: {
        unbilledMilestones,
        unbilledTotalAmount: Number(unbilledTotalAmount.toFixed(2)),
      },
      recentActivities: {
        recentPayments,
        recentProjects,
      },
    };
  }
}

export default DashboardService;
