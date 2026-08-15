'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useProject } from '@/hooks/useProjects';
import { useMilestones, useDeleteMilestone } from '@/hooks/useMilestones';
import { useTasks, useDeleteTask } from '@/hooks/useTasks';
import { useInvoices } from '@/hooks/useInvoices';
import { ProjectHeader } from '@/components/modules/projects/detail/ProjectHeader';
import { ProjectClientSnapshot } from '@/components/modules/projects/detail/ProjectClientSnapshot';
import { ProjectMilestonesTab } from '@/components/modules/projects/detail/ProjectMilestonesTab';
import { ProjectTasksTab } from '@/components/modules/projects/detail/ProjectTasksTab';
import { ProjectFinancialsTab } from '@/components/modules/projects/detail/ProjectFinancialsTab';
import { ProjectCredentialsTab } from '@/components/modules/projects/detail/ProjectCredentialsTab';
import { ProjectLinksTab } from '@/components/modules/projects/detail/ProjectLinksTab';
import { TaskFormDrawer } from '@/components/modules/tasks/TaskFormDrawer';
import { MilestoneFormDrawer } from '@/components/modules/milestones/MilestoneFormDrawer';
import { TabBar, TabPanel } from '@/components/common/TabPanel';
import { Milestone, Task } from '@/types';
import { ProjectWorkspaceSkeleton } from '@/components/common/skeletons/ProjectWorkspaceSkeleton';

type ProjectTab = 'milestones' | 'tasks' | 'financials' | 'credentials' | 'links';

const PROJECT_TABS = (
  milestoneCount: number,
  taskCount: number,
  credCount: number,
  linkCount: number
) => [
  { key: 'milestones',  label: 'Milestones',         count: milestoneCount },
  { key: 'tasks',       label: 'Tasks',              count: taskCount },
  { key: 'financials',  label: 'Financials' },
  { key: 'credentials', label: 'Credentials',        count: credCount > 0 ? credCount : undefined },
  { key: 'links',       label: 'Links & Resources',  count: linkCount > 0 ? linkCount : undefined },
];

export default function ProjectWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProjectTab>('milestones');

  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
  const [isMilestoneDrawerOpen, setIsMilestoneDrawerOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { data: project, isLoading } = useProject(id);
  const { data: milestones = [] } = useMilestones(id);
  const { data: tasks = [] } = useTasks(id);
  const { data: invoicesData } = useInvoices({ projectId: id });
  const deleteMilestoneMutation = useDeleteMilestone();
  const deleteTaskMutation = useDeleteTask(id);

  if (isLoading) {
    return <ProjectWorkspaceSkeleton />;
  }
  if (!project) {
    return (
      <div className="p-12 text-center text-neutral-500">
        <h2 className="text-base font-bold text-neutral-900 dark:text-white">Project Not Found</h2>
        <p className="text-xs mt-1">This project may have been deleted or archived.</p>
      </div>
    );
  }

  // Count total links including repoUrl and liveUrl
  const directLinkCount = (project.links || []).length;
  const extraLinks = (project.repoUrl || project.githubRepo ? 1 : 0) + (project.liveUrl ? 1 : 0);
  const totalLinkCount = directLinkCount + extraLinks;
  const totalCredCount = (project.credentials || []).length;

  const tabs = PROJECT_TABS(milestones.length, tasks.length, totalCredCount, totalLinkCount);

  return (
    <div className="space-y-6">
      <ProjectHeader
        project={project}
        milestones={milestones}
        onEdit={() => router.push(`/projects/${id}/edit`)}
        onAddTask={() => { setEditingTask(null); setIsTaskDrawerOpen(true); }}
        onAddMilestone={() => { setEditingMilestone(null); setIsMilestoneDrawerOpen(true); }}
      />
      <ProjectClientSnapshot project={project} />

      {/* CLS-safe tab bar — fixed height, border always present */}
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(k) => setActiveTab(k as ProjectTab)}
      />

      {/* CLS-safe panels — opacity fade, stable min-height floor */}
      <TabPanel tabKey="milestones" activeTab={activeTab} minHeight={280}>
        <ProjectMilestonesTab
          milestones={milestones}
          projectId={id}
          onAddMilestone={() => { setEditingMilestone(null); setIsMilestoneDrawerOpen(true); }}
          onEditMilestone={(m) => { setEditingMilestone(m); setIsMilestoneDrawerOpen(true); }}
          onDeleteMilestone={(m) => {
            if (confirm(`Are you sure you want to delete milestone "${m.title}"?`)) {
              deleteMilestoneMutation.mutate({ id: m._id, projectId: id });
            }
          }}
        />
      </TabPanel>

      <TabPanel tabKey="tasks" activeTab={activeTab} minHeight={280}>
        <ProjectTasksTab
          tasks={tasks}
          projectId={id}
          onAddTask={() => { setEditingTask(null); setIsTaskDrawerOpen(true); }}
          onEditTask={(t) => { setEditingTask(t); setIsTaskDrawerOpen(true); }}
          onDeleteTask={(t) => {
            if (confirm(`Are you sure you want to delete task "${t.title}"?`)) {
              deleteTaskMutation.mutate(t._id);
            }
          }}
        />
      </TabPanel>

      <TabPanel tabKey="financials" activeTab={activeTab} minHeight={280}>
        <ProjectFinancialsTab
          invoices={invoicesData?.items || []}
          projectId={id}
          totalBudget={project.totalBudget || 0}
        />
      </TabPanel>

      <TabPanel tabKey="credentials" activeTab={activeTab} minHeight={200}>
        <ProjectCredentialsTab project={project} />
      </TabPanel>

      <TabPanel tabKey="links" activeTab={activeTab} minHeight={200}>
        <ProjectLinksTab project={project} />
      </TabPanel>

      <TaskFormDrawer
        isOpen={isTaskDrawerOpen}
        onClose={() => { setIsTaskDrawerOpen(false); setEditingTask(null); }}
        projectId={id}
        task={editingTask}
      />
      <MilestoneFormDrawer
        isOpen={isMilestoneDrawerOpen}
        onClose={() => { setIsMilestoneDrawerOpen(false); setEditingMilestone(null); }}
        projectId={id}
        milestone={editingMilestone}
      />
    </div>
  );
}
