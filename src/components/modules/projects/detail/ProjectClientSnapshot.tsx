import React from 'react';
import Link from 'next/link';
import { Mail, Phone, ArrowRight, GitBranch, ExternalLink } from 'lucide-react';
import { ProjectWithClient, ClientType } from '@/types';

interface ProjectClientSnapshotProps {
  project: ProjectWithClient;
}

export function ProjectClientSnapshot({ project }: ProjectClientSnapshotProps) {
  const client = typeof project.clientId === 'object' && project.clientId !== null ? (project.clientId as ClientType) : null;

  return (
    <div className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-neutral-100 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155] text-neutral-800 dark:text-neutral-200 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
          {client?.name ? client.name.substring(0, 2) : (client?.companyName ? client.companyName.substring(0, 2) : 'CL')}
        </div>
        <div>
          <div className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Client Account</div>
          <div className="font-heading font-bold text-sm text-neutral-900 dark:text-white">
            {client?.name || client?.companyName || 'Unknown Client'}
          </div>
          {client && (
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-500 mt-0.5">
              {client.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{client.email}</span>}
              {client.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{client.phone}</span>}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {project.githubRepo && (
          <a href={project.githubRepo} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-[#0F172A] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-[#334155]">
            <GitBranch className="w-3.5 h-3.5" /><span>Repository</span>
          </a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-[#0F172A] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-[#334155]">
            <ExternalLink className="w-3.5 h-3.5" /><span>Live Preview</span>
          </a>
        )}
        {client && (
          <Link href={`/clients/${client._id}`} className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold shadow-sm hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors">
            <span>View Client Profile</span><ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
}

export default ProjectClientSnapshot;
