'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  Copy,
  Check,
  GitBranch,
  Globe,
  Server,
  Code2,
  Palette,
  FileCode,
  Link2,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import { ProjectWithClient, ProjectLink } from '@/types';
import { cn } from '@/lib/utils';

interface ProjectLinksTabProps {
  project: ProjectWithClient;
}

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; color: string; badge: string }
> = {
  production: {
    label: 'Production URL',
    icon: Globe,
    color: 'text-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  staging: {
    label: 'Staging Environment',
    icon: Server,
    color: 'text-blue-500',
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  development: {
    label: 'Development Server',
    icon: Code2,
    color: 'text-violet-500',
    badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  },
  repository: {
    label: 'Code Repository',
    icon: GitBranch,
    color: 'text-neutral-700 dark:text-neutral-300',
    badge: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700',
  },
  design: {
    label: 'Design & Figma',
    icon: Palette,
    color: 'text-pink-500',
    badge: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
  },
  api: {
    label: 'API & Documentation',
    icon: FileCode,
    color: 'text-amber-500',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  other: {
    label: 'Resource Link',
    icon: Link2,
    color: 'text-neutral-500',
    badge: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700',
  },
};

export function ProjectLinksTab({ project }: ProjectLinksTabProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Consolidate links from project.links array, plus repoUrl/githubRepo and liveUrl if present
  const allLinks: ProjectLink[] = [...(project.links || [])];

  const repo = project.repoUrl || project.githubRepo;
  if (repo && !allLinks.some((l) => l.url === repo)) {
    allLinks.unshift({
      title: 'Source Code Repository',
      url: repo,
      category: 'repository',
    });
  }

  if (project.liveUrl && !allLinks.some((l) => l.url === project.liveUrl)) {
    allLinks.unshift({
      title: 'Live Production App',
      url: project.liveUrl,
      category: 'production',
    });
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const formatDisplayUrl = (url: string) => {
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      return parsed.hostname + (parsed.pathname !== '/' ? parsed.pathname : '');
    } catch {
      return url;
    }
  };

  const getFullUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  if (allLinks.length === 0) {
    return (
      <div className="p-12 text-center rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] space-y-3">
        <Link2 className="w-8 h-8 text-neutral-400 mx-auto" />
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">No external links configured</h3>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto">
          Add repository URLs, live demo links, Figma design specs, or API documentation for this project workspace.
        </p>
        <div className="pt-2">
          <Link
            href={`/projects/${project._id}/edit`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project Links</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Project Repositories &amp; Resources ({allLinks.length})
          </h3>
        </div>
        <Link
          href={`/projects/${project._id}/edit`}
          className="inline-flex items-center gap-1 text-xs font-bold text-neutral-900 dark:text-white hover:underline"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Manage Links</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allLinks.map((link, idx) => {
          const cat = CATEGORY_CONFIG[link.category || 'other'] || CATEGORY_CONFIG.other;
          const Icon = cat.icon;
          const fullHref = getFullUrl(link.url);

          return (
            <div
              key={idx}
              className="group p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm hover:border-neutral-400 dark:hover:border-neutral-500 transition-all flex flex-col justify-between gap-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-2 truncate">
                    <span className={cn('p-1 rounded bg-neutral-100 dark:bg-neutral-800', cat.color)}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="truncate">{link.title || cat.label}</span>
                  </span>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider flex-shrink-0',
                      cat.badge
                    )}
                  >
                    {link.category || 'link'}
                  </span>
                </div>

                <div className="text-xs font-mono text-neutral-500 dark:text-neutral-400 truncate pl-0.5">
                  {formatDisplayUrl(link.url)}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                <button
                  type="button"
                  onClick={() => copyToClipboard(fullHref, idx)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  {copiedIdx === idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-500 font-semibold">Copied URL</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <a
                  href={fullHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors"
                >
                  <span>Open</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProjectLinksTab;
