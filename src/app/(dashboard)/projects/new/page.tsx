'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FolderPlus, ArrowLeft, Loader2 } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { useCreateProject } from '@/hooks/useProjects';
import { useCreateMilestone } from '@/hooks/useMilestones';
import { ProjectType } from '@/types';
import { ProjectBasicInfoFields } from '@/components/modules/projects/form/ProjectBasicInfoFields';
import { ProjectTechStackFields } from '@/components/modules/projects/form/ProjectTechStackFields';
import { ProjectLinksInputs, LinkDraft } from '@/components/modules/projects/form/ProjectLinksInputs';
import { ProjectMilestoneInputs, MilestoneDraft } from '@/components/modules/projects/form/ProjectMilestoneInputs';
import { ProjectCredentialInputs, CredentialDraft } from '@/components/modules/projects/form/ProjectCredentialInputs';
import { RichTextEditor } from '@/components/common/RichTextEditor';

export default function NewProjectPage() {
  const router = useRouter();
  const { data: clientsData, isLoading: isClientsLoading } = useClients({ limit: 100 });
  const createProjectMutation = useCreateProject();
  const createMilestoneMutation = useCreateMilestone();

  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectType['status']>('in_progress');
  const [targetDeadline, setTargetDeadline] = useState('');
  const [techStack, setTechStack] = useState<string[]>(['Next.js', 'TypeScript', 'Tailwind']);
  const [techInput, setTechInput] = useState('');
  const [links, setLinks] = useState<LinkDraft[]>([]);
  const [milestones, setMilestones] = useState<MilestoneDraft[]>([]);
  const [credentials, setCredentials] = useState<CredentialDraft[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalBudget = milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);

    const formattedCredentials = credentials.map((c) => ({
      serviceName: c.title || 'Credential',
      title: c.title || 'Credential',
      accountId: c.username || '',
      username: c.username || '',
      accessKeyOrUrl: c.password || c.url || '',
      password: c.password || '',
      url: c.url || '',
      environment: c.environment || 'development',
      notes: c.notes || '',
    }));

    const repoUrl = links.find((l) => l.category === 'repository')?.url;
    const liveUrl = links.find((l) => l.category === 'production' || l.category === 'staging')?.url;

    const newProj = await createProjectMutation.mutateAsync({
      title,
      clientId,
      description: description || undefined,
      status,
      budgetType: 'fixed' as const,
      currency: 'INR',
      links,
      progressPercentage: 0,
      targetDeadline: targetDeadline ? new Date(targetDeadline) : undefined,
      techStack,
      repoUrl,
      liveUrl,
      totalBudget,
      credentials: formattedCredentials,
    });

    if (milestones.length > 0) {
      await Promise.all(
        milestones.map((m) =>
          createMilestoneMutation.mutateAsync({
            projectId: newProj._id,
            title: m.title,
            allocatedAmount: Number(m.amount) || 0,
            status: 'pending',
            order: 0,
          })
        )
      );
    }

    router.push(`/projects/${newProj._id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>
        <button
          type="submit"
          disabled={createProjectMutation.isPending || isClientsLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold shadow-sm disabled:opacity-50 transition-all"
        >
          {createProjectMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderPlus className="w-4 h-4" />}
          <span>Create Project Workspace</span>
        </button>
      </div>

      <div className="p-6 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-6">
        <h2 className="font-heading text-lg font-bold text-neutral-900 dark:text-white">New Project Configuration</h2>

        {/* Basic fields: title, client, status, deadline */}
        <ProjectBasicInfoFields
          title={title}
          onTitleChange={setTitle}
          clientId={clientId}
          onClientChange={setClientId}
          clients={clientsData?.items || []}
          status={status}
          onStatusChange={(val) => setStatus(val as ProjectType['status'])}
          targetDeadline={targetDeadline}
          onDeadlineChange={setTargetDeadline}
          description={description}
          onDescriptionChange={setDescription}
        />

        {/* Rich-text description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Project Overview &amp; Objectives
          </label>
          <RichTextEditor
            value={description}
            onChange={setDescription}
            placeholder="Describe the deliverables, scope, and success criteria for this project..."
          />
        </div>

        <hr className="border-neutral-200 dark:border-[#334155]" />

        <ProjectTechStackFields
          techStack={techStack}
          techInput={techInput}
          onTechInputChange={setTechInput}
          onAddTech={() => {
            if (techInput.trim() && !techStack.includes(techInput.trim())) {
              setTechStack([...techStack, techInput.trim()]);
              setTechInput('');
            }
          }}
          onRemoveTech={(t) => setTechStack(techStack.filter((x) => x !== t))}
        />

        <hr className="border-neutral-200 dark:border-[#334155]" />

        <ProjectLinksInputs
          links={links}
          onAddLink={() => setLinks([...links, { title: '', url: '', category: 'repository' }])}
          onRemoveLink={(i) => setLinks(links.filter((_, idx) => idx !== i))}
          onUpdateLink={(i, f, v) =>
            setLinks(links.map((l, idx) => (idx === i ? { ...l, [f]: v } : l)))
          }
        />

        <hr className="border-neutral-200 dark:border-[#334155]" />

        <ProjectMilestoneInputs
          milestones={milestones}
          onAddMilestone={() => setMilestones([...milestones, { title: '', amount: 0 }])}
          onRemoveMilestone={(i) => setMilestones(milestones.filter((_, idx) => idx !== i))}
          onUpdateMilestone={(i, f, v) =>
            setMilestones(milestones.map((m, idx) => (idx === i ? { ...m, [f]: v } : m)))
          }
        />

        <hr className="border-neutral-200 dark:border-[#334155]" />

        <ProjectCredentialInputs
          credentials={credentials}
          onAddCredential={() => setCredentials([...credentials, { title: '', environment: 'development' }])}
          onRemoveCredential={(i) => setCredentials(credentials.filter((_, idx) => idx !== i))}
          onUpdateCredential={(i, f, v) =>
            setCredentials(credentials.map((c, idx) => (idx === i ? { ...c, [f]: v } : c)))
          }
        />
      </div>
    </form>
  );
}
