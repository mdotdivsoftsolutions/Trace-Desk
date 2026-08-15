import React from 'react';
import { Client } from '@/types';

interface ProjectBasicInfoFieldsProps {
  title: string;
  onTitleChange: (val: string) => void;
  clientId: string;
  onClientChange: (val: string) => void;
  clients: Client[];
  status: string;
  onStatusChange: (val: string) => void;
  targetDeadline: string;
  onDeadlineChange: (val: string) => void;
  description: string;
  onDescriptionChange: (val: string) => void;
}

export function ProjectBasicInfoFields({
  title,
  onTitleChange,
  clientId,
  onClientChange,
  clients,
  status,
  onStatusChange,
  targetDeadline,
  onDeadlineChange,
  description,
  onDescriptionChange,
}: ProjectBasicInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Project Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Next.js SaaS Web App"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Assigned Client *</label>
          <select
            required
            value={clientId}
            onChange={(e) => onClientChange(e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            <option value="">Select a client...</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} {c.company ? `(${c.company})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Project Status</label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            <option value="discovery">Discovery & Scoping</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review & QA</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Target Deadline</label>
          <input
            type="date"
            value={targetDeadline}
            onChange={(e) => onDeadlineChange(e.target.value)}
            className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>
      </div>

    </div>
  );
}

export default ProjectBasicInfoFields;
