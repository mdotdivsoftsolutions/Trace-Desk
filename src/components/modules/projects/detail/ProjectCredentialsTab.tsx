'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  Lock,
  ExternalLink,
  Shield,
  Plus,
  Globe,
  FileText,
  User,
  ArrowUpRight,
  Edit3,
} from 'lucide-react';
import { ProjectWithClient, ProjectCredential } from '@/types';
import { cn } from '@/lib/utils';

interface ProjectCredentialsTabProps {
  project: ProjectWithClient;
}

const ENV_BADGES: Record<string, { label: string; badge: string }> = {
  production: {
    label: 'Production',
    badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  },
  staging: {
    label: 'Staging',
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  development: {
    label: 'Development',
    badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  },
};

const KNOWN_SERVICE_URLS: Record<string, string> = {
  razorpay: 'https://dashboard.razorpay.com',
  'razor pay': 'https://dashboard.razorpay.com',
  stripe: 'https://dashboard.stripe.com',
  aws: 'https://console.aws.amazon.com',
  'aws console': 'https://console.aws.amazon.com',
  supabase: 'https://app.supabase.com',
  vercel: 'https://vercel.com/login',
  netlify: 'https://app.netlify.com',
  github: 'https://github.com/login',
  gitlab: 'https://gitlab.com/users/sign_in',
  mongodb: 'https://cloud.mongodb.com',
  firebase: 'https://console.firebase.google.com',
  cloudflare: 'https://dash.cloudflare.com/login',
  digitalocean: 'https://cloud.digitalocean.com/login',
  render: 'https://dashboard.render.com',
  heroku: 'https://id.heroku.com/login',
  postman: 'https://web.postman.co',
  figma: 'https://www.figma.com/login',
  cpanel: 'https://cpanel.net',
};

function getSuggestedUrl(serviceName: string): string | null {
  const clean = serviceName.toLowerCase().trim();
  for (const [key, val] of Object.entries(KNOWN_SERVICE_URLS)) {
    if (clean.includes(key)) return val;
  }
  return null;
}

export function ProjectCredentialsTab({ project }: ProjectCredentialsTabProps) {
  const [revealedIdx, setRevealedIdx] = useState<Record<number, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleReveal = (index: number) => {
    setRevealedIdx((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const credentials: ProjectCredential[] = project.credentials || [];

  if (credentials.length === 0) {
    return (
      <div className="p-12 text-center rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] space-y-3">
        <Lock className="w-8 h-8 text-neutral-400 mx-auto" />
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">No credentials stored</h3>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto">
          Securely store environment access keys, server credentials, login URLs, or API tokens with quick launch buttons.
        </p>
        <div className="pt-2">
          <Link
            href={`/projects/${project._id}/edit`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Credentials</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-neutral-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Stored Access &amp; Keys ({credentials.length})
          </h3>
        </div>
        <Link
          href={`/projects/${project._id}/edit`}
          className="inline-flex items-center gap-1 text-xs font-bold text-neutral-900 dark:text-white hover:underline"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Manage Credentials</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {credentials.map((cred, idx) => {
          const serviceTitle = cred.title || cred.serviceName || `Credential #${idx + 1}`;
          const envKey = (cred.environment || 'production').toLowerCase();
          const envConfig = ENV_BADGES[envKey] || {
            label: cred.environment || 'Production',
            badge: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700',
          };

          const username = cred.username || cred.accountId || '';

          // Password / Secret key
          const rawSecret = cred.password || cred.accessKeyOrUrl || '';
          const isSecretAUrl = rawSecret.startsWith('http://') || rawSecret.startsWith('https://');
          const password = isSecretAUrl && cred.url ? '' : rawSecret;

          // Target Site URL / Host (or smart suggestion if not saved)
          const savedUrl =
            cred.url ||
            (isSecretAUrl ? rawSecret : '') ||
            (cred.notes?.startsWith('http') ? cred.notes : '');

          const fallbackUrl = !savedUrl ? getSuggestedUrl(serviceTitle) : null;
          const effectiveUrl = savedUrl || fallbackUrl || '';

          // Extra notes
          const notes =
            cred.notes && cred.notes !== savedUrl && cred.notes !== rawSecret && !cred.notes.startsWith('http')
              ? cred.notes
              : '';

          const isRevealed = !!revealedIdx[idx];
          const fullHref = effectiveUrl
            ? effectiveUrl.startsWith('http')
              ? effectiveUrl
              : `https://${effectiveUrl}`
            : '';

          return (
            <div
              key={idx}
              className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-3.5 flex flex-col justify-between"
            >
              {/* Top Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 truncate">
                  <Key className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                  <span className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                    {serviceTitle}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider',
                      envConfig.badge
                    )}
                  >
                    {envConfig.label}
                  </span>
                  <Link
                    href={`/projects/${project._id}/edit`}
                    className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    title="Edit Credential"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {/* Site / Login Redirect URL */}
                {effectiveUrl ? (
                  <div className="flex items-center justify-between gap-2 p-2 rounded bg-neutral-50 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155]">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <Globe className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                      <span className="text-neutral-400 flex-shrink-0 text-[11px] font-medium">Site URL:</span>
                      <a
                        href={fullHref}
                        target="_blank"
                        rel="noreferrer"
                        className="text-neutral-900 dark:text-white hover:underline font-mono truncate"
                      >
                        {effectiveUrl}
                      </a>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(fullHref, `url-${idx}`)}
                        className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                        title="Copy URL"
                      >
                        {copiedKey === `url-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <a
                        href={fullHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[11px] font-bold shadow-sm hover:opacity-90 transition-opacity"
                      >
                        <span>Launch Site</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2 rounded bg-neutral-50 dark:bg-[#0F172A] border border-dashed border-neutral-200 dark:border-[#334155] text-[11px] text-neutral-500">
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Globe className="w-3.5 h-3.5" />
                      No redirect URL configured
                    </span>
                    <Link
                      href={`/projects/${project._id}/edit`}
                      className="text-xs font-semibold text-neutral-900 dark:text-white hover:underline flex items-center gap-1"
                    >
                      <span>+ Add URL</span>
                    </Link>
                  </div>
                )}

                {/* Username / Account */}
                {username && (
                  <div className="flex items-center justify-between gap-2 p-2 rounded bg-neutral-50 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155]">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <User className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                      <span className="text-neutral-400 flex-shrink-0 text-[11px] font-medium">User / ID:</span>
                      <span className="font-mono text-neutral-900 dark:text-white truncate">{username}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(username, `user-${idx}`)}
                      className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex-shrink-0 transition-colors"
                      title="Copy Username"
                    >
                      {copiedKey === `user-${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}

                {/* Password / Secret / Access Key */}
                {password && (
                  <div className="flex items-center justify-between gap-2 p-2 rounded bg-neutral-50 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155]">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <Lock className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                      <span className="text-neutral-400 flex-shrink-0 text-[11px] font-medium">Secret / Key:</span>
                      <span className="font-mono text-neutral-900 dark:text-white truncate">
                        {isRevealed ? password : '••••••••••••••••'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleReveal(idx)}
                        className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                        title={isRevealed ? 'Hide secret' : 'Reveal secret'}
                      >
                        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(password, `pass-${idx}`)}
                        className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                        title="Copy Secret"
                      >
                        {copiedKey === `pass-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Notes / Instructions */}
                {notes && (
                  <div className="flex items-start gap-1.5 pt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                    <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>{notes}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProjectCredentialsTab;
