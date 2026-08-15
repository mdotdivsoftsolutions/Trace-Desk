'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, ArrowRight } from 'lucide-react';
import { ProjectWithClient, ClientType } from '@/types';

interface ProjectClientSnapshotProps {
  project: ProjectWithClient;
}

export function ProjectClientSnapshot({ project }: ProjectClientSnapshotProps) {
  const client =
    typeof project.clientId === 'object' && project.clientId !== null
      ? (project.clientId as ClientType)
      : null;

  return (
    <div className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Client Profile Details */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-neutral-100 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155] text-neutral-800 dark:text-neutral-200 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
          {(client?.companyName || client?.company || client?.name || 'CL').substring(0, 2)}
        </div>
        <div>
          <div className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Client Account</div>
          <div className="font-heading font-bold text-sm text-neutral-900 dark:text-white">
            {client?.companyName || client?.company || client?.name || 'Unknown Client'}
          </div>
          {(client?.companyName || client?.company) && client?.name && (client?.companyName || client?.company) !== client?.name && (
            <div className="text-[11px] text-neutral-500 font-medium">Contact: {client.name}</div>
          )}
          {client && (
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-500 mt-0.5">
              {client.email && (
                <a href={`mailto:${client.email}`} className="flex items-center gap-1 hover:underline">
                  <Mail className="w-3 h-3" />
                  <span>{client.email}</span>
                </a>
              )}
              {client.phone && (
                <a href={`tel:${client.phone}`} className="flex items-center gap-1 hover:underline">
                  <Phone className="w-3 h-3" />
                  <span>{client.phone}</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Client Profile Action */}
      {client && (
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href={`/clients/${client._id}`}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold shadow-sm hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
          >
            <span>View Client Profile</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default ProjectClientSnapshot;
