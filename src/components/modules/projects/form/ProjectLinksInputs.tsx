import React from 'react';
import { X, Plus, Link as LinkIcon, ExternalLink } from 'lucide-react';

export interface LinkDraft {
  title: string;
  url: string;
  category: 'production' | 'staging' | 'development' | 'repository' | 'design' | 'api' | 'other';
}

interface ProjectLinksInputsProps {
  links: LinkDraft[];
  onAddLink: () => void;
  onRemoveLink: (index: number) => void;
  onUpdateLink: (index: number, field: keyof LinkDraft, value: string) => void;
}

export function ProjectLinksInputs({
  links,
  onAddLink,
  onRemoveLink,
  onUpdateLink,
}: ProjectLinksInputsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
          <LinkIcon className="w-4 h-4 text-neutral-500" />
          <span>Project Repositories & URLs</span>
        </label>
        <button
          type="button"
          onClick={onAddLink}
          className="flex items-center gap-1 text-[11px] font-bold text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Link</span>
        </button>
      </div>

      {links.length === 0 ? (
        <div className="text-center p-4 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-md">
          <p className="text-xs text-neutral-500">No external links added. Add repositories, live URLs, or design files.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link, idx) => (
            <div key={idx} className="flex gap-2 items-start bg-neutral-50 dark:bg-[#0F172A] p-2.5 rounded-md border border-neutral-200 dark:border-[#334155]">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Link Title (e.g., Frontend Repo)"
                  value={link.title}
                  onChange={(e) => onUpdateLink(idx, 'title', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md bg-white dark:bg-[#1E293B] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white"
                  required
                />
                <input
                  type="url"
                  placeholder="https://..."
                  value={link.url}
                  onChange={(e) => onUpdateLink(idx, 'url', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md bg-white dark:bg-[#1E293B] border border-neutral-300 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white"
                  required
                />
                <select
                  value={link.category}
                  onChange={(e) => onUpdateLink(idx, 'category', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md bg-white dark:bg-[#1E293B] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white"
                >
                  <option value="repository">Repository</option>
                  <option value="production">Production URL</option>
                  <option value="staging">Staging URL</option>
                  <option value="development">Development URL</option>
                  <option value="design">Design (Figma/Adobe)</option>
                  <option value="api">API Docs</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => onRemoveLink(idx)}
                className="p-1.5 text-neutral-400 hover:text-rose-500 rounded bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-neutral-700 mt-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectLinksInputs;
