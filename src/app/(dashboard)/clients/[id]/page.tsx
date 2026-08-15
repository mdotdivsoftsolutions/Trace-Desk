'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, Building2, Mail, Phone, Globe, DollarSign, FolderKanban, Receipt, ChevronRight, ArrowLeft } from 'lucide-react';
import { useClient } from '@/hooks';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: client, isLoading } = useClient(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-36 rounded-3xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        <div className="h-80 rounded-3xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-lg font-bold">Client Not Found</h2>
        <Link href="/clients" className="text-xs font-semibold text-indigo-600 hover:underline">
          ← Back to Clients
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
        <Link href="/clients" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Clients Directory</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-neutral-900 dark:text-white font-semibold">{client.name}</span>
      </div>

      {/* Client Overview Card */}
      <div className="p-6 lg:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl lg:text-3xl font-extrabold text-neutral-900 dark:text-white">
                {client.name}
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">
                {client.status}
              </span>
            </div>
            {client.companyName && (
              <p className="text-sm font-semibold text-neutral-500 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-indigo-500" />
                <span>{client.companyName}</span>
              </p>
            )}
          </div>
        </div>

        {/* Ledger Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50">
            <div className="text-xs text-neutral-500">Total Billed</div>
            <div className="text-xl font-extrabold text-neutral-900 dark:text-white mt-1">
              {formatCurrency(client.financialSummary?.totalBilled || 0, client.currency)}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20">
            <div className="text-xs text-emerald-600 dark:text-emerald-400">Total Settled</div>
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {formatCurrency(client.financialSummary?.totalPaid || 0, client.currency)}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-500/20">
            <div className="text-xs text-amber-600 dark:text-amber-400">Outstanding Balance</div>
            <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
              {formatCurrency(client.financialSummary?.outstanding || 0, client.currency)}
            </div>
          </div>
        </div>
      </div>

      {/* Linked Projects */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-indigo-500" />
          <span>Active Projects ({client.projects?.length || 0})</span>
        </h2>

        {(!client.projects || client.projects.length === 0) ? (
          <div className="p-10 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 text-center text-xs text-neutral-500">
            No projects associated with this client.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {client.projects.map((proj: any) => (
              <Link
                key={proj._id}
                href={`/projects/${proj._id}`}
                className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {proj.title}
                    </h3>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      {proj.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${proj.progressPercentage || 0}%` }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
