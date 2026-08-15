'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { useCreateProject, useUpdateProject } from '@/hooks/useProjects';
import { ProjectType } from '@/types';
import { ProjectBasicInfoFields } from './form/ProjectBasicInfoFields';
import { ProjectTechStackFields } from './form/ProjectTechStackFields';
import { ProjectMilestoneInputs, MilestoneDraft } from './form/ProjectMilestoneInputs';

interface ProjectFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project?: ProjectType | null;
  preselectedClientId?: string;
}

export function ProjectFormDrawer({ isOpen, onClose, project, preselectedClientId }: ProjectFormDrawerProps) {
  const { data: clientsData } = useClients({ limit: 100 });
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();

  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('in_progress');
  const [targetDeadline, setTargetDeadline] = useState('');
  const [techStack, setTechStack] = useState<string[]>(['Next.js', 'TypeScript']);
  const [techInput, setTechInput] = useState('');
  const [milestones, setMilestones] = useState<MilestoneDraft[]>([]);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setClientId(typeof project.clientId === 'object' ? (project.clientId as any)._id : project.clientId);
      setDescription(project.description || '');
      setStatus(project.status);
      setTargetDeadline(project.targetDeadline ? new Date(project.targetDeadline).toISOString().split('T')[0] : '');
      setTechStack(project.techStack || []);
      setMilestones([]);
    } else {
      setTitle('');
      setClientId(preselectedClientId || '');
      setDescription('');
      setStatus('in_progress');
      setTargetDeadline('');
      setTechStack(['Next.js', 'TypeScript']);
      setMilestones([]);
    }
  }, [project, preselectedClientId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalBudget = milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);
    if (project) {
      await updateProjectMutation.mutateAsync({ id: project._id, data: { title, clientId, description, status: status as any, targetDeadline: targetDeadline ? new Date(targetDeadline) : undefined, techStack } });
    } else {
      await createProjectMutation.mutateAsync({ title, clientId, description, status: status as any, budgetType: 'fixed' as const, currency: 'INR', links: [], credentials: [], progressPercentage: 0, targetDeadline: targetDeadline ? new Date(targetDeadline) : undefined, techStack, totalBudget });
    }
    onClose();
  };

  const isPending = createProjectMutation.isPending || updateProjectMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white dark:bg-[#1E293B] border-l border-neutral-200 dark:border-[#334155] shadow-2xl flex flex-col">
          <div className="h-16 px-6 border-b border-neutral-200 dark:border-[#334155] flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-neutral-900 dark:text-white">{project ? 'Edit Project' : 'Create Project'}</h2>
            <button onClick={onClose} className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            <ProjectBasicInfoFields title={title} onTitleChange={setTitle} clientId={clientId} onClientChange={setClientId} clients={clientsData?.items || []} status={status} onStatusChange={setStatus} targetDeadline={targetDeadline} onDeadlineChange={setTargetDeadline} description={description} onDescriptionChange={setDescription} />
            <hr className="border-neutral-200 dark:border-[#334155]" />
            <ProjectTechStackFields techStack={techStack} techInput={techInput} onTechInputChange={setTechInput} onAddTech={() => { if (techInput.trim() && !techStack.includes(techInput.trim())) { setTechStack([...techStack, techInput.trim()]); setTechInput(''); } }} onRemoveTech={(t) => setTechStack(techStack.filter((x) => x !== t))} />
            {!project && (
              <>
                <hr className="border-neutral-200 dark:border-[#334155]" />
                <ProjectMilestoneInputs milestones={milestones} onAddMilestone={() => setMilestones([...milestones, { title: '', amount: 0 }])} onRemoveMilestone={(i) => setMilestones(milestones.filter((_, idx) => idx !== i))} onUpdateMilestone={(i, f, v) => setMilestones(milestones.map((m, idx) => idx === i ? { ...m, [f]: v } : m))} />
              </>
            )}
            <div className="pt-4 border-t border-neutral-200 dark:border-[#334155] flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-neutral-200 dark:border-[#334155] text-xs font-semibold">Cancel</button>
              <button type="submit" disabled={isPending} className="flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold disabled:opacity-50">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}<span>{project ? 'Save Changes' : 'Create Project'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProjectFormDrawer;
