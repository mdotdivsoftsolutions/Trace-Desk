'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { useCreateProject } from '@/hooks/useProjects';
import { ProjectBasicInfoFields } from '@/components/modules/projects/form/ProjectBasicInfoFields';
import { ProjectTechStackFields } from '@/components/modules/projects/form/ProjectTechStackFields';
import { ProjectMilestoneInputs, MilestoneDraft } from '@/components/modules/projects/form/ProjectMilestoneInputs';
import { ProjectCredentialInputs, CredentialDraft } from '@/components/modules/projects/form/ProjectCredentialInputs';

export default function NewProjectPage() {
  const router = useRouter();
  const { data: clientsData, isLoading: isClientsLoading } = useClients({ limit: 100 });
  const createProjectMutation = useCreateProject();

  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('in_progress');
  const [targetDeadline, setTargetDeadline] = useState('');
  const [techStack, setTechStack] = useState<string[]>(['Next.js', 'TypeScript', 'Tailwind']);
  const [techInput, setTechInput] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [milestones, setMilestones] = useState<MilestoneDraft[]>([]);
  const [credentials, setCredentials] = useState<CredentialDraft[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalBudget = milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);

    const formattedCredentials = credentials.map((c) => ({
      serviceName: c.title,
      accountId: c.username,
      accessKeyOrUrl: c.password || c.url,
      environment: c.environment,
      notes: c.url,
    }));

    const newProj = await createProjectMutation.mutateAsync({
      title,
      clientId,
      description: description || undefined,
      status: status as any,
      budgetType: 'fixed' as const,
      currency: 'INR',
      links: [],
      progressPercentage: 0,
      targetDeadline: targetDeadline ? new Date(targetDeadline) : undefined,
      techStack,
      repoUrl: githubRepo || undefined,
      liveUrl: liveUrl || undefined,
      totalBudget,
      credentials: formattedCredentials,
    });

    router.push(`/projects/${newProj._id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <Link href="/projects" className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
          <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Projects</span>
        </Link>
        <button
          type="submit"
          disabled={createProjectMutation.isPending || isClientsLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold shadow-sm disabled:opacity-50"
        >
          {createProjectMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Create Project Workspace</span>
        </button>
      </div>

      <div className="p-6 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-6">
        <h2 className="font-heading text-lg font-bold text-neutral-900 dark:text-white">New Project Configuration</h2>
        <ProjectBasicInfoFields
          title={title} onTitleChange={setTitle}
          clientId={clientId} onClientChange={setClientId}
          clients={clientsData?.items || []}
          status={status} onStatusChange={setStatus}
          targetDeadline={targetDeadline} onDeadlineChange={setTargetDeadline}
          description={description} onDescriptionChange={setDescription}
        />
        <hr className="border-neutral-200 dark:border-[#334155]" />
        <ProjectTechStackFields
          techStack={techStack} techInput={techInput} onTechInputChange={setTechInput}
          onAddTech={() => { if (techInput.trim() && !techStack.includes(techInput.trim())) { setTechStack([...techStack, techInput.trim()]); setTechInput(''); } }}
          onRemoveTech={(t) => setTechStack(techStack.filter((x) => x !== t))}
          githubRepo={githubRepo} onGithubChange={setGithubRepo}
          liveUrl={liveUrl} onLiveUrlChange={setLiveUrl}
        />
        <hr className="border-neutral-200 dark:border-[#334155]" />
        <ProjectMilestoneInputs
          milestones={milestones}
          onAddMilestone={() => setMilestones([...milestones, { title: '', amount: 0 }])}
          onRemoveMilestone={(i) => setMilestones(milestones.filter((_, idx) => idx !== i))}
          onUpdateMilestone={(i, f, v) => setMilestones(milestones.map((m, idx) => idx === i ? { ...m, [f]: v } : m))}
        />
        <hr className="border-neutral-200 dark:border-[#334155]" />
        <ProjectCredentialInputs
          credentials={credentials}
          onAddCredential={() => setCredentials([...credentials, { title: '', environment: 'development' }])}
          onRemoveCredential={(i) => setCredentials(credentials.filter((_, idx) => idx !== i))}
          onUpdateCredential={(i, f, v) => setCredentials(credentials.map((c, idx) => idx === i ? { ...c, [f]: v } : c))}
        />
      </div>
    </form>
  );
}
