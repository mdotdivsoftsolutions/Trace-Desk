'use client';

import React from 'react';
import { Plus, Trash2, Key, Globe, Lock, User, FileText, ExternalLink } from 'lucide-react';

export interface CredentialDraft {
  title: string;
  url?: string;
  username?: string;
  password?: string;
  notes?: string;
  environment: 'development' | 'staging' | 'production';
}

interface ProjectCredentialInputsProps {
  credentials: CredentialDraft[];
  onAddCredential: () => void;
  onRemoveCredential: (idx: number) => void;
  onUpdateCredential: (idx: number, field: keyof CredentialDraft, value: string) => void;
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
          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Environment Credentials &amp; Access</span>
          <p className="text-[11px] text-neutral-400">Store login URLs, usernames, secrets, and environment access details.</p>
        </div>
        <button
          type="button"
          onClick={onAddCredential}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Key</span>
        </button>
      </div>

      {credentials.length === 0 ? (
        <div className="p-6 text-center rounded-lg border border-dashed border-neutral-300 dark:border-[#334155] text-xs text-neutral-400 space-y-2">
          <Key className="w-6 h-6 mx-auto opacity-50" />
          <p>No credentials stored. Click &quot;+ Add Key&quot; to save environment access details.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {credentials.map((cred, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-neutral-50 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155] space-y-3.5"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Credential #{idx + 1}</span>
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveCredential(idx)}
                  className="text-neutral-400 hover:text-rose-500 transition-colors p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  title="Remove Credential"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Row 1: Service Title & Environment */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                    Service Name / Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AWS Management Console, Supabase, Stripe Dashboard"
                    value={cred.title}
                    onChange={(e) => onUpdateCredential(idx, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-md bg-white dark:bg-[#1E293B] border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                    Environment
                  </label>
                  <select
                    value={cred.environment}
                    onChange={(e) =>
                      onUpdateCredential(
                        idx,
                        'environment',
                        e.target.value as 'development' | 'staging' | 'production'
                      )
                    }
                    className="w-full px-3 py-1.5 rounded-md bg-white dark:bg-[#1E293B] border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                  >
                    <option value="production">Production</option>
                    <option value="staging">Staging</option>
                    <option value="development">Development</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Site / Login URL */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-neutral-400" />
                  <span>Site / Login Redirect URL</span>
                  <span className="text-neutral-400 font-normal text-[10px] ml-1">(URL to redirect and log in)</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="https://console.aws.amazon.com or https://app.example.com/login"
                    value={cred.url || ''}
                    onChange={(e) => onUpdateCredential(idx, 'url', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-md bg-white dark:bg-[#1E293B] border border-neutral-300 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white"
                  />
                  {cred.url && (
                    <a
                      href={cred.url.startsWith('http') ? cred.url : `https://${cred.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 rounded-md bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-xs font-semibold text-neutral-800 dark:text-neutral-200 inline-flex items-center gap-1 transition-colors flex-shrink-0"
                      title="Test URL"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Test</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Row 3: Username / Email & Password / Key */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                    <User className="w-3 h-3 text-neutral-400" />
                    <span>Username / Email / Account ID</span>
                  </label>
                  <input
                    type="text"
                    placeholder="admin@example.com / AKIA..."
                    value={cred.username || ''}
                    onChange={(e) => onUpdateCredential(idx, 'username', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-md bg-white dark:bg-[#1E293B] border border-neutral-300 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-neutral-400" />
                    <span>Password / Secret Key / Token</span>
                  </label>
                  <input
                    type="text"
                    placeholder="••••••••••••••••"
                    value={cred.password || ''}
                    onChange={(e) => onUpdateCredential(idx, 'password', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-md bg-white dark:bg-[#1E293B] border border-neutral-300 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Row 4: Notes / Instructions */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-neutral-400" />
                  <span>Notes / Instructions (Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2FA required via Authenticator App, port 5432"
                  value={cred.notes || ''}
                  onChange={(e) => onUpdateCredential(idx, 'notes', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md bg-white dark:bg-[#1E293B] border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
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
