import React from 'react';
import { Plus, Trash2, Key } from 'lucide-react';

export interface CredentialDraft {
  title: string;
  url?: string;
  username?: string;
  password?: string;
  environment: 'development' | 'staging' | 'production';
}

interface ProjectCredentialInputsProps {
  credentials: CredentialDraft[];
  onAddCredential: () => void;
  onRemoveCredential: (idx: number) => void;
  onUpdateCredential: (idx: number, field: keyof CredentialDraft, value: any) => void;
}

export function ProjectCredentialInputs({
  credentials,
  onAddCredential,
  onRemoveCredential,
  onUpdateCredential,
}: ProjectCredentialInputsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Environment Credentials</span>
          <p className="text-[11px] text-neutral-400">Store development, staging, or production credentials.</p>
        </div>
        <button
          type="button"
          onClick={onAddCredential}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" /><span>+ Add Key</span>
        </button>
      </div>

      {credentials.length === 0 ? (
        <div className="p-6 text-center rounded-lg border border-dashed border-neutral-300 dark:border-[#334155] text-xs text-neutral-400 space-y-2">
          <Key className="w-6 h-6 mx-auto opacity-50" />
          <p>No credentials stored. Click &quot;+ Add Key&quot; to save environment access details.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {credentials.map((cred, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-neutral-50 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-500">Credential #{idx + 1}</span>
                <button type="button" onClick={() => onRemoveCredential(idx)} className="text-neutral-400 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Title (e.g. Staging Server / DB)"
                  value={cred.title}
                  onChange={(e) => onUpdateCredential(idx, 'title', e.target.value)}
                  className="px-3 py-1.5 rounded bg-white dark:bg-[#1E293B] border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                />
                <select
                  value={cred.environment}
                  onChange={(e) => onUpdateCredential(idx, 'environment', e.target.value)}
                  className="px-3 py-1.5 rounded bg-white dark:bg-[#1E293B] border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                >
                  <option value="development">Development</option>
                  <option value="staging">Staging</option>
                  <option value="production">Production</option>
                </select>
                <input
                  type="text"
                  placeholder="Username / Email"
                  value={cred.username || ''}
                  onChange={(e) => onUpdateCredential(idx, 'username', e.target.value)}
                  className="px-3 py-1.5 rounded bg-white dark:bg-[#1E293B] border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Password / Token"
                  value={cred.password || ''}
                  onChange={(e) => onUpdateCredential(idx, 'password', e.target.value)}
                  className="px-3 py-1.5 rounded bg-white dark:bg-[#1E293B] border border-neutral-300 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectCredentialInputs;
