'use client';

import React from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';

export type DatePreset =
  | 'all'
  | 'today'
  | 'last_7_days'
  | 'this_month'
  | 'last_30_days'
  | 'this_quarter'
  | 'this_year'
  | 'custom';

export interface DateRangeFilterProps {
  startDate?: string;
  endDate?: string;
  preset?: DatePreset;
  onChange: (range: { startDate?: string; endDate?: string; preset: DatePreset }) => void;
  className?: string;
}

function formatDateToISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateRangeFromPreset(preset: DatePreset): { startDate?: string; endDate?: string } {
  const now = new Date();

  switch (preset) {
    case 'today': {
      const todayStr = formatDateToISO(now);
      return { startDate: todayStr, endDate: todayStr };
    }
    case 'last_7_days': {
      const start = new Date(now);
      start.setDate(now.getDate() - 6);
      return { startDate: formatDateToISO(start), endDate: formatDateToISO(now) };
    }
    case 'this_month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: formatDateToISO(start), endDate: formatDateToISO(now) };
    }
    case 'last_30_days': {
      const start = new Date(now);
      start.setDate(now.getDate() - 29);
      return { startDate: formatDateToISO(start), endDate: formatDateToISO(now) };
    }
    case 'this_quarter': {
      const currentQuarterMonth = Math.floor(now.getMonth() / 3) * 3;
      const start = new Date(now.getFullYear(), currentQuarterMonth, 1);
      return { startDate: formatDateToISO(start), endDate: formatDateToISO(now) };
    }
    case 'this_year': {
      const start = new Date(now.getFullYear(), 0, 1);
      return { startDate: formatDateToISO(start), endDate: formatDateToISO(now) };
    }
    case 'all':
    default:
      return { startDate: undefined, endDate: undefined };
  }
}

export function DateRangeFilter({
  startDate = '',
  endDate = '',
  preset = 'all',
  onChange,
  className = '',
}: DateRangeFilterProps) {
  const handlePresetChange = (newPreset: DatePreset) => {
    if (newPreset === 'custom') {
      onChange({ startDate: startDate || undefined, endDate: endDate || undefined, preset: 'custom' });
    } else {
      const range = getDateRangeFromPreset(newPreset);
      onChange({ ...range, preset: newPreset });
    }
  };

  const handleCustomDateChange = (start: string, end: string) => {
    onChange({
      startDate: start || undefined,
      endDate: end || undefined,
      preset: 'custom',
    });
  };

  const handleClear = () => {
    onChange({ startDate: undefined, endDate: undefined, preset: 'all' });
  };

  const isFiltered = preset !== 'all' || !!startDate || !!endDate;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <div className="relative flex items-center">
        <CalendarIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        <select
          value={preset}
          onChange={(e) => handlePresetChange(e.target.value as DatePreset)}
          className="pl-8 pr-7 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 cursor-pointer appearance-none"
        >
          <option value="all">Date: All Time</option>
          <option value="today">Today</option>
          <option value="last_7_days">Last 7 Days</option>
          <option value="this_month">This Month</option>
          <option value="last_30_days">Last 30 Days</option>
          <option value="this_quarter">This Quarter</option>
          <option value="this_year">This Year</option>
          <option value="custom">Custom Range...</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
          <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>

      {preset === 'custom' && (
        <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleCustomDateChange(e.target.value, endDate)}
            placeholder="From"
            className="px-2.5 py-1.5 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500"
            title="Start Date"
          />
          <span className="text-xs text-neutral-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleCustomDateChange(startDate, e.target.value)}
            placeholder="To"
            className="px-2.5 py-1.5 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500"
            title="End Date"
          />
        </div>
      )}

      {isFiltered && (
        <button
          type="button"
          onClick={handleClear}
          className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="Reset date filter"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export default DateRangeFilter;
