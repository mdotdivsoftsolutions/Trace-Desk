import React, { useState } from 'react';
import { Key, Eye, EyeOff, Copy, Check, Lock } from 'lucide-react';
import { ProjectWithClient } from '@/types';

interface ProjectCredentialsTabProps {
  project: ProjectWithClient;
}

export function ProjectCredentialsTab({ project }: ProjectCredentialsTabProps) {
  const [revealedIdx, setRevealedIdx] = useState<Record<number, boolean>>({});
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const toggleReveal = (index: number) => {
    setRevealedIdx((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const credentials = project.credentials || [];

  if (credentials.length === 0) {
    return (
      <div className="p-12 text-center rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] space-y-2">
        <Lock className="w-8 h-8 text-neutral-400 mx-auto" />
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">No credentials stored</h3>
        <p className="text-xs text-neutral-500">Edit project settings to store encrypted staging/production environment credentials.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {credentials.map((cred, idx) => (
        <div key={idx} className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-neutral-500" />
              <span>{cred.title}</span>
            </span>
            <span className="text-[10px] uppercase font-bold text-neutral-400">{cred.environment}</span>
          </div>

          <div className="space-y-1.5 text-xs">
            {cred.url && <div><span className="text-neutral-400">URL:</span> <a href={cred.url} target="_blank" rel="noreferrer" className="text-neutral-900 dark:text-white hover:underline ml-1 font-mono">{cred.url}</a></div>}
            {cred.username && <div><span className="text-neutral-400">User:</span> <span className="font-mono text-neutral-900 dark:text-white ml-1">{cred.username}</span></div>}
            {cred.password && (
              <div className="flex items-center justify-between bg-neutral-50 dark:bg-[#0F172A] p-2 rounded border border-neutral-200 dark:border-[#334155]">
                <span className="font-mono text-neutral-900 dark:text-white">{revealedIdx[idx] ? cred.password : '••••••••••••'}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleReveal(idx)} className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white">{revealedIdx[idx] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
                  <button onClick={() => copyToClipboard(cred.password!, idx)} className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white">{copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectCredentialsTab;
