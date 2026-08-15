'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { useProject, useUpdateProject } from '@/hooks/useProjects';
import { ProjectBasicInfoFields } from '@/components/modules/projects/form/ProjectBasicInfoFields';
import { ProjectTechStackFields } from '@/components/modules/projects/form/ProjectTechStackFields';
import { ProjectLinksInputs, LinkDraft } from '@/components/modules/projects/form/ProjectLinksInputs';
import { ProjectCredentialInputs, CredentialDraft } from '@/components/modules/projects/form/ProjectCredentialInputs';
import { ProjectCredential, Project } from '@/types';
import { RichTextEditor } from '@/components/common/RichTextEditor';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: project, isLoading: isProjectLoading } = useProject(id);
  const { data: clientsData } = useClients({ limit: 100 });
  const updateProjectMutation = useUpdateProject();

  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('in_progress');
  const [targetDeadline, setTargetDeadline] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [links, setLinks] = useState<LinkDraft[]>([]);
  const [credentials, setCredentials] = useState<CredentialDraft[]>([]);

  const [prevProject, setPrevProject] = useState<Project | null>(null);

  if (project && project !== prevProject) {
    setPrevProject(project);
    setTitle(project.title);
    setClientId(
      typeof project.clientId === 'object' && project.clientId !== null && '_id' in project.clientId
        ? (project.clientId as { _id: string })._id
        : typeof project.clientId === 'string'
        ? project.clientId
        : ''
    );
    setDescription(project.description || '');
    setStatus(project.status);
    setTargetDeadline(project.targetDeadline ? new Date(project.targetDeadline).toISOString().split('T')[0] : '');
    setTechStack(project.techStack || []);

    const initialLinks: LinkDraft[] = (project.links || []).map((l) => ({
      title: l.title || '',
      url: l.url || '',
      category: (l.category as LinkDraft['category']) || 'other',
    }));

    // Ensure repo and liveUrl are included in links if not already present
    const repo = project.repoUrl || project.githubRepo;
    if (repo && !initialLinks.some((l) => l.url === repo)) {
      initialLinks.unshift({ title: 'Repository', url: repo, category: 'repository' });
    }
    if (project.liveUrl && !initialLinks.some((l) => l.url === project.liveUrl)) {
      initialLinks.unshift({ title: 'Live Production', url: project.liveUrl, category: 'production' });
    }
    setLinks(initialLinks);

    setCredentials(
      (project.credentials || []).map((c: ProjectCredential): CredentialDraft => {
        const isSecretAUrl = (c.accessKeyOrUrl || '').startsWith('http://') || (c.accessKeyOrUrl || '').startsWith('https://');
        return {
          title: c.title || c.serviceName || 'Credential',
          username: c.username || c.accountId || '',
          password: c.password || (!isSecretAUrl ? c.accessKeyOrUrl : '') || '',
          url: c.url || (isSecretAUrl ? c.accessKeyOrUrl : '') || (c.notes?.startsWith('http') ? c.notes : '') || '',
          notes: c.notes && c.notes !== c.url && !c.notes.startsWith('http') ? c.notes : '',
          environment: (c.environment as 'production' | 'staging' | 'development') || 'development',
        };
      })
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    await updateProjectMutation.mutateAsync({
      id,
      data: {
        title,
        clientId,
        description: description || undefined,
        status: status as Project['status'],
        targetDeadline: targetDeadline ? new Date(targetDeadline) : undefined,
        techStack,
        links,
        repoUrl: repoUrl || undefined,
        liveUrl: liveUrl || undefined,
        credentials: formattedCredentials,
      },
    });
    router.push(`/projects/${id}`);
  };

  if (isProjectLoading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block w-8 h-8 border-2 border-neutral-900 dark:border-white border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-neutral-500 mt-2">Loading project settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <Link
          href={`/projects/${id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Workspace</span>
        </Link>
        <button
          type="submit"
          disabled={updateProjectMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold shadow-sm disabled:opacity-50 transition-all"
        >
          {updateProjectMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      <div className="p-6 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-6">
        <h2 className="font-heading text-lg font-bold text-neutral-900 dark:text-white">Edit Project Workspace</h2>

        <ProjectBasicInfoFields
          title={title}
          onTitleChange={setTitle}
          clientId={clientId}
          onClientChange={setClientId}
          clients={clientsData?.items || []}
          status={status}
          onStatusChange={setStatus}
          targetDeadline={targetDeadline}
          onDeadlineChange={setTargetDeadline}
          description={description}
          onDescriptionChange={setDescription}
        />

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
