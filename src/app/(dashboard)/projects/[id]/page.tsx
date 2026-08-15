'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useProject } from '@/hooks/useProjects';
import { useMilestones } from '@/hooks/useMilestones';
import { useTasks } from '@/hooks/useTasks';
import { useInvoices } from '@/hooks/useInvoices';
import { ProjectHeader } from '@/components/modules/projects/detail/ProjectHeader';
import { ProjectClientSnapshot } from '@/components/modules/projects/detail/ProjectClientSnapshot';
import { ProjectMilestonesTab } from '@/components/modules/projects/detail/ProjectMilestonesTab';
import { ProjectTasksTab } from '@/components/modules/projects/detail/ProjectTasksTab';
import { ProjectFinancialsTab } from '@/components/modules/projects/detail/ProjectFinancialsTab';
import { ProjectCredentialsTab } from '@/components/modules/projects/detail/ProjectCredentialsTab';
import { TaskFormDrawer } from '@/components/modules/tasks/TaskFormDrawer';
import { MilestoneFormDrawer } from '@/components/modules/milestones/MilestoneFormDrawer';
import { TabBar, TabPanel } from '@/components/common/TabPanel';
import { Milestone, Task } from '@/types';

type ProjectTab = 'milestones' | 'tasks' | 'financials' | 'credentials';

const PROJECT_TABS = (milestoneCount: number, taskCount: number) => [
  { key: 'milestones', label: 'Milestones', count: milestoneCount },
  { key: 'tasks',      label: 'Tasks',      count: taskCount },
  { key: 'financials', label: 'Financials' },
  { key: 'credentials',label: 'Credentials' },
] as const;

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

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block w-8 h-8 border-2 border-neutral-900 dark:border-white border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-neutral-500 mt-2">Loading workspace...</p>
      </div>
    );
  }
  if (!project) {
    return (
      <div className="p-12 text-center text-neutral-500">
        <h2 className="text-base font-bold text-neutral-900 dark:text-white">Project Not Found</h2>
        <p className="text-xs mt-1">This project may have been deleted or archived.</p>
      </div>
    );
  }

  const tabs = PROJECT_TABS(milestones.length, tasks.length);

  return (
    <div className="space-y-6">
      <ProjectHeader
        project={project}
        onEdit={() => router.push(`/projects/${id}/edit`)}
        onAddTask={() => { setEditingTask(null); setIsTaskDrawerOpen(true); }}
        onAddMilestone={() => { setEditingMilestone(null); setIsMilestoneDrawerOpen(true); }}
      />
      <ProjectClientSnapshot project={project} />

      {/* CLS-safe tab bar — fixed height, border always present */}
      <TabBar
        tabs={tabs as any}
        activeTab={activeTab}
        onTabChange={(k) => setActiveTab(k as ProjectTab)}
      />

      {/* CLS-safe panels — opacity fade, stable min-height floor */}
      <TabPanel tabKey="milestones" activeTab={activeTab} minHeight={280}>
        <ProjectMilestonesTab
          milestones={milestones} projectId={id}
          onAddMilestone={() => { setEditingMilestone(null); setIsMilestoneDrawerOpen(true); }}
          onEditMilestone={(m) => { setEditingMilestone(m); setIsMilestoneDrawerOpen(true); }}
          onDeleteMilestone={() => {}}
        />
      </TabPanel>
      <TabPanel tabKey="tasks" activeTab={activeTab} minHeight={280}>
        <ProjectTasksTab
          tasks={tasks} projectId={id}
          onAddTask={() => { setEditingTask(null); setIsTaskDrawerOpen(true); }}
          onEditTask={(t) => { setEditingTask(t); setIsTaskDrawerOpen(true); }}
          onDeleteTask={() => {}}
        />
      </TabPanel>
      <TabPanel tabKey="financials" activeTab={activeTab} minHeight={280}>
        <ProjectFinancialsTab invoices={invoicesData?.items || []} projectId={id} totalBudget={project.totalBudget || 0} />
      </TabPanel>
      <TabPanel tabKey="credentials" activeTab={activeTab} minHeight={200}>
        <ProjectCredentialsTab project={project} />
      </TabPanel>

      <TaskFormDrawer isOpen={isTaskDrawerOpen} onClose={() => { setIsTaskDrawerOpen(false); setEditingTask(null); }} projectId={id} task={editingTask} />
      <MilestoneFormDrawer isOpen={isMilestoneDrawerOpen} onClose={() => { setIsMilestoneDrawerOpen(false); setEditingMilestone(null); }} projectId={id} milestone={editingMilestone} />
    </div>
  );
}
