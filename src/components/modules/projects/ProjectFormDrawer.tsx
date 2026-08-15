'use client';

import React, { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { useCreateProject, useUpdateProject } from '@/hooks/useProjects';
import { useCreateMilestone } from '@/hooks/useMilestones';
import { ProjectType, ProjectCredential } from '@/types';
import { ProjectBasicInfoFields } from './form/ProjectBasicInfoFields';
import { ProjectTechStackFields } from './form/ProjectTechStackFields';
import { ProjectMilestoneInputs, MilestoneDraft } from './form/ProjectMilestoneInputs';
import { ProjectLinksInputs, LinkDraft } from './form/ProjectLinksInputs';
import { ProjectCredentialInputs, CredentialDraft } from './form/ProjectCredentialInputs';

interface ProjectFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project?: ProjectType | null;
  preselectedClientId?: string;
}

function getInitialFormData(project?: ProjectType | null, preselectedClientId?: string) {
  if (project) {
    const clientId =
      typeof project.clientId === 'object' && project.clientId !== null && '_id' in project.clientId
        ? (project.clientId as { _id: string })._id
        : typeof project.clientId === 'string'
        ? project.clientId
        : '';

    const initialLinks: LinkDraft[] = (project.links || []).map((l) => ({
      title: l.title || '',
      url: l.url || '',
      category: (l.category as LinkDraft['category']) || 'other',
    }));
    const repo = project.repoUrl || project.githubRepo;
    if (repo && !initialLinks.some((l) => l.url === repo)) {
      initialLinks.unshift({ title: 'Repository', url: repo, category: 'repository' });
    }
    if (project.liveUrl && !initialLinks.some((l) => l.url === project.liveUrl)) {
      initialLinks.unshift({ title: 'Live Production', url: project.liveUrl, category: 'production' });
    }

    const credentials: CredentialDraft[] = (project.credentials || []).map((c: ProjectCredential): CredentialDraft => {
      const isSecretAUrl = (c.accessKeyOrUrl || '').startsWith('http://') || (c.accessKeyOrUrl || '').startsWith('https://');
      return {
        title: c.title || c.serviceName || 'Credential',
        username: c.username || c.accountId || '',
        password: c.password || (!isSecretAUrl ? c.accessKeyOrUrl : '') || '',
        url: c.url || (isSecretAUrl ? c.accessKeyOrUrl : '') || (c.notes?.startsWith('http') ? c.notes : '') || '',
        notes: c.notes && c.notes !== c.url && !c.notes.startsWith('http') ? c.notes : '',
        environment: (c.environment as 'production' | 'staging' | 'development') || 'development',
      };
    });

    return {
      title: project.title || '',
      clientId,
      description: project.description || '',
      status: project.status || 'in_progress',
      isPinned: !!project.isPinned,
      targetDeadline: project.targetDeadline ? new Date(project.targetDeadline).toISOString().split('T')[0] : '',
      techStack: project.techStack || [],
      links: initialLinks,
      credentials,
      milestones: [] as MilestoneDraft[],
    };
  }

  return {
    title: '',
    clientId: preselectedClientId || '',
    description: '',
    status: 'in_progress' as ProjectType['status'],
    isPinned: false,
    targetDeadline: '',
    techStack: ['Next.js', 'TypeScript'],
    links: [] as LinkDraft[],
    credentials: [] as CredentialDraft[],
    milestones: [] as MilestoneDraft[],
  };
}

interface ProjectFormDrawerContentProps {
  onClose: () => void;
  project?: ProjectType | null;
  preselectedClientId?: string;
}

function ProjectFormDrawerContent({ onClose, project, preselectedClientId }: ProjectFormDrawerContentProps) {
  const initial = getInitialFormData(project, preselectedClientId);

  const { data: clientsData } = useClients({ limit: 100 });
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const createMilestoneMutation = useCreateMilestone();

  const [title, setTitle] = useState(initial.title);
  const [clientId, setClientId] = useState(initial.clientId);
  const [description, setDescription] = useState(initial.description);
  const [status, setStatus] = useState<ProjectType['status']>(initial.status);
  const [isPinned, setIsPinned] = useState(initial.isPinned);
  const [targetDeadline, setTargetDeadline] = useState(initial.targetDeadline);
  const [techStack, setTechStack] = useState<string[]>(initial.techStack);
  const [techInput, setTechInput] = useState('');
  const [links, setLinks] = useState<LinkDraft[]>(initial.links);
  const [credentials, setCredentials] = useState<CredentialDraft[]>(initial.credentials);
  const [milestones, setMilestones] = useState<MilestoneDraft[]>(initial.milestones);

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

    const repoUrl = links.find((l) => l.category === 'repository')?.url || project?.repoUrl;
    const liveUrl = links.find((l) => l.category === 'production' || l.category === 'staging')?.url || project?.liveUrl;

    if (project) {
      await updateProjectMutation.mutateAsync({
        id: project._id,
        data: {
          title,
          clientId,
          description: description || undefined,
          status,
          isPinned,
          targetDeadline: targetDeadline ? new Date(targetDeadline) : undefined,
          techStack,
          links,
          repoUrl: repoUrl || undefined,
          liveUrl: liveUrl || undefined,
          credentials: formattedCredentials,
        },
      });
    } else {
      const newProj = await createProjectMutation.mutateAsync({
        title,
        clientId,
        description: description || undefined,
        status,
        isPinned,
        budgetType: 'fixed' as const,
        currency: 'INR',
        links,
        credentials: formattedCredentials,
        progressPercentage: 0,
        targetDeadline: targetDeadline ? new Date(targetDeadline) : undefined,
        techStack,
        repoUrl,
        liveUrl,
        totalBudget,
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
    }
    onClose();
  };

  const isPending =
    createProjectMutation.isPending || updateProjectMutation.isPending || createMilestoneMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white dark:bg-[#1E293B] border-l border-neutral-200 dark:border-[#334155] shadow-2xl flex flex-col">
          <div className="h-16 px-6 border-b border-neutral-200 dark:border-[#334155] flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-neutral-900 dark:text-white">
              {project ? 'Edit Project Workspace' : 'Create Project'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
                isPinned={isPinned}
                onIsPinnedChange={setIsPinned}
              />

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

              <ProjectCredentialInputs
                credentials={credentials}
                onAddCredential={() => setCredentials([...credentials, { title: '', environment: 'development' }])}
                onRemoveCredential={(i) => setCredentials(credentials.filter((_, idx) => idx !== i))}
                onUpdateCredential={(i, f, v) =>
                  setCredentials(credentials.map((c, idx) => (idx === i ? { ...c, [f]: v } : c)))
                }
              />

              {!project && (
                <>
                  <hr className="border-neutral-200 dark:border-[#334155]" />
                  <ProjectMilestoneInputs
                    milestones={milestones}
                    onAddMilestone={() => setMilestones([...milestones, { title: '', amount: 0 }])}
                    onRemoveMilestone={(i) => setMilestones(milestones.filter((_, idx) => idx !== i))}
                    onUpdateMilestone={(i, f, v) =>
                      setMilestones(milestones.map((m, idx) => (idx === i ? { ...m, [f]: v } : m)))
                    }
                  />
                </>
              )}
            </div>

            <div className="p-4 px-6 border-t border-neutral-200 dark:border-[#334155] bg-neutral-50/60 dark:bg-[#0F172A]/60 flex items-center justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{project ? 'Save Changes' : 'Create Project'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function ProjectFormDrawer({ isOpen, onClose, project, preselectedClientId }: ProjectFormDrawerProps) {
  if (!isOpen) return null;

  return (
    <ProjectFormDrawerContent
      key={project?._id || (preselectedClientId ? `client-${preselectedClientId}` : 'new-project')}
      onClose={onClose}
      project={project}
      preselectedClientId={preselectedClientId}
    />
  );
}

export default ProjectFormDrawer;

