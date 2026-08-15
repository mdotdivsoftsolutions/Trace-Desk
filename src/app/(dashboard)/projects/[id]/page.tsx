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
import { Milestone, Task } from '@/types';
import { cn } from '@/lib/utils';

export default function ProjectWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'milestones' | 'tasks' | 'financials' | 'credentials'>('milestones');

  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
  const [isMilestoneDrawerOpen, setIsMilestoneDrawerOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { data: project, isLoading: isProjectLoading } = useProject(id);
  const { data: milestones = [] } = useMilestones(id);
  const { data: tasks = [] } = useTasks(id);
  const { data: invoicesData } = useInvoices({ projectId: id });

  if (isProjectLoading) {
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

  return (
    <div className="space-y-6">
      <ProjectHeader
        project={project}
        onEdit={() => router.push(`/projects/${id}/edit`)}
        onAddTask={() => { setEditingTask(null); setIsTaskDrawerOpen(true); }}
        onAddMilestone={() => { setEditingMilestone(null); setIsMilestoneDrawerOpen(true); }}
      />

      <ProjectClientSnapshot project={project} />

      <div className="border-b border-neutral-200 dark:border-[#334155] flex gap-6 text-xs font-semibold">
        {(['milestones', 'tasks', 'financials', 'credentials'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'pb-3 capitalize transition-colors relative',
              activeTab === tab
                ? 'text-neutral-900 dark:text-white border-b-2 border-neutral-900 dark:border-white font-bold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            )}
          >
            {tab} {tab === 'milestones' && `(${milestones.length})`} {tab === 'tasks' && `(${tasks.length})`}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'milestones' && (
          <ProjectMilestonesTab
            milestones={milestones}
            projectId={id}
            onAddMilestone={() => { setEditingMilestone(null); setIsMilestoneDrawerOpen(true); }}
            onEditMilestone={(m) => { setEditingMilestone(m); setIsMilestoneDrawerOpen(true); }}
            onDeleteMilestone={() => {}}
          />
        )}
        {activeTab === 'tasks' && (
          <ProjectTasksTab
            tasks={tasks}
            projectId={id}
            onAddTask={() => { setEditingTask(null); setIsTaskDrawerOpen(true); }}
            onEditTask={(t) => { setEditingTask(t); setIsTaskDrawerOpen(true); }}
            onDeleteTask={() => {}}
          />
        )}
        {activeTab === 'financials' && (
          <ProjectFinancialsTab
            invoices={invoicesData?.items || []}
            projectId={id}
            totalBudget={project.totalBudget || 0}
          />
        )}
        {activeTab === 'credentials' && <ProjectCredentialsTab project={project} />}
      </div>

      <TaskFormDrawer isOpen={isTaskDrawerOpen} onClose={() => { setIsTaskDrawerOpen(false); setEditingTask(null); }} projectId={id} task={editingTask} />
      <MilestoneFormDrawer isOpen={isMilestoneDrawerOpen} onClose={() => { setIsMilestoneDrawerOpen(false); setEditingMilestone(null); }} projectId={id} milestone={editingMilestone} />
    </div>
  );
}
