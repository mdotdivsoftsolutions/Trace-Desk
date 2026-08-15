import React from 'react';
import Link from 'next/link';
import { FolderKanban, Search, Plus } from 'lucide-react';
import { DateRangeFilter, DatePreset } from '@/components/common/DateRangeFilter';

interface ProjectFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  startDate?: string;
  endDate?: string;
  datePreset?: DatePreset;
  onDateChange: (range: { startDate?: string; endDate?: string; preset: DatePreset }) => void;
}

export function ProjectFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  startDate,
  endDate,
  datePreset,
  onDateChange,
}: ProjectFilterBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs">
              <FolderKanban className="w-4 h-4" />
            </span>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Project Workspaces
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Track active software deliveries, milestones, budgets, tech stacks, and team assignments.
          </p>
        </div>

        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 active:scale-95 text-xs font-bold shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Project</span>
        </Link>
      </div>

      <div className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search projects by title, scope, or client..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500"
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <div className="w-full sm:w-44">
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500"
            >
              <option value="all">All Statuses</option>
              <option value="discovery">Discovery</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            preset={datePreset}
            onChange={onDateChange}
          />
        </div>
      </div>
    </div>
  );
}

export default ProjectFilterBar;
