'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FolderKanban, Plus } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useDebounce } from '@/hooks/useDebounce';
import { DatePreset } from '@/components/common/DateRangeFilter';
import { ProjectFilterBar } from '@/components/modules/projects/list/ProjectFilterBar';
import { ProjectGridCard } from '@/components/modules/projects/list/ProjectGridCard';
import { ProjectCardSkeleton } from '@/components/common/skeletons/ProjectCardSkeleton';
import { Pagination } from '@/components/common/pagination';

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, isFetching } = useProjects({
    search: debouncedSearch || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    startDate,
    endDate,
    page,
    limit,
  });

  const projects = data?.items || [];
  const isGridLoading = isLoading || isFetching || search !== debouncedSearch;

  const handleDateChange = ({ startDate: start, endDate: end, preset }: { startDate?: string; endDate?: string; preset: DatePreset }) => {
    setStartDate(start);
    setEndDate(end);
    setDatePreset(preset);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <ProjectFilterBar
        search={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        statusFilter={statusFilter}
        onStatusChange={(val) => { setStatusFilter(val); setPage(1); }}
        startDate={startDate}
        endDate={endDate}
        datePreset={datePreset}
        onDateChange={handleDateChange}
      />

      {isGridLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] space-y-4">
          <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155] text-neutral-700 dark:text-neutral-300 flex items-center justify-center mx-auto">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">No projects found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Create your first project to start tracking milestones, Kanban tasks, and automated invoicing.
            </p>
          </div>
          <Link href="/projects/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
            <Plus className="w-4 h-4" /><span>Create First Project</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectGridCard key={project._id} project={project} />
          ))}
        </div>
      )}

      {data?.pagination && data.pagination.totalPages > 1 && (
        <Pagination
          pagination={data.pagination}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
