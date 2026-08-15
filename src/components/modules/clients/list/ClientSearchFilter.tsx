import React from 'react';
import { Search } from 'lucide-react';
import { DateRangeFilter, DatePreset } from '@/components/common/DateRangeFilter';

interface ClientSearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  startDate?: string;
  endDate?: string;
  datePreset?: DatePreset;
  onDateChange: (range: { startDate?: string; endDate?: string; preset: DatePreset }) => void;
}

export function ClientSearchFilter({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  startDate,
  endDate,
  datePreset,
  onDateChange,
}: ClientSearchFilterProps) {
  return (
    <div className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
      <div className="relative flex-1 w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by client name, email, or company..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
  );
}

export default ClientSearchFilter;
