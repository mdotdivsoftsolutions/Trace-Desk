import React from 'react';

/**
 * Animated exact-geometry skeleton for the Client Detailed View.
 * Accurately mirrors ClientHeaderBanner, ClientFinancialKpis, TabBar, and ClientProjectsTab.
 */
export function ClientDetailSkeleton() {
  const shimmer = 'animate-pulse bg-slate-200/70 dark:bg-slate-800/60 rounded';

  return (
    <div className="space-y-6 w-full pb-12">
      {/* 1. Back Navigation Link */}
      <div className="flex items-center gap-2">
        <div className={`${shimmer} h-3.5 w-3.5 rounded`} />
        <div className={`${shimmer} h-3.5 w-40`} />
      </div>

      {/* 2. Client Header Banner */}
      <div className="p-6 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          {/* Avatar Box */}
          <div className={`${shimmer} w-14 h-14 rounded-lg flex-shrink-0`} />
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className={`${shimmer} h-7 w-56 sm:w-72`} />
              <div className={`${shimmer} h-5 w-16 rounded-full`} />
            </div>
            <div className={`${shimmer} h-3.5 w-32`} />
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <div className={`${shimmer} h-3.5 w-36`} />
              <div className={`${shimmer} h-3.5 w-28`} />
              <div className={`${shimmer} h-3.5 w-20`} />
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-shrink-0">
          <div className={`${shimmer} h-8 w-24 rounded-md`} />
          <div className={`${shimmer} h-8 w-28 rounded-md`} />
          <div className={`${shimmer} h-8 w-8 rounded-md`} />
        </div>
      </div>

      {/* 3. Financial KPIs 4-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className={`${shimmer} h-3 w-24`} />
              <div className={`${shimmer} w-8 h-8 rounded-md`} />
            </div>
            <div className={`${shimmer} h-7 w-28`} />
            <div className={`${shimmer} h-2.5 w-32`} />
          </div>
        ))}
      </div>

      {/* 4. Tab Bar Navigation */}
      <div className="h-11 flex items-end gap-1 border-b border-neutral-200 dark:border-[#334155] select-none">
        {/* Active Tab (Projects) */}
        <div className="relative h-full px-4 flex items-center gap-1.5 pb-[1px]">
          <div className={`${shimmer} h-4 w-14`} />
          <div className={`${shimmer} h-4 w-5 rounded`} />
          <span className="absolute bottom-0 inset-x-0 h-0.5 rounded-t bg-neutral-300 dark:bg-neutral-600" />
        </div>
        {/* Inactive Tabs */}
        <div className="h-full px-4 flex items-center gap-1.5 pb-[1px]">
          <div className={`${shimmer} h-4 w-14`} />
          <div className={`${shimmer} h-4 w-5 rounded`} />
        </div>
        <div className="h-full px-4 flex items-center gap-1.5 pb-[1px]">
          <div className={`${shimmer} h-4 w-12`} />
        </div>
      </div>

      {/* 5. Projects Tab 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, idx) => (
          <div
            key={idx}
            className="p-5 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1.5 flex-1">
                <div className={`${shimmer} h-4.5 w-44`} />
                <div className={`${shimmer} h-3 w-28`} />
              </div>
              <div className={`${shimmer} h-5 w-20 rounded`} />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className={`${shimmer} h-3 w-16`} />
                <div className={`${shimmer} h-3 w-8`} />
              </div>
              <div className="w-full bg-neutral-100 dark:bg-[#0F172A] h-2 rounded-full overflow-hidden p-0.5 border border-neutral-200 dark:border-[#334155]">
                <div className={`${shimmer} h-full w-1/2 rounded-full`} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-[#334155]">
              <div className={`${shimmer} h-4.5 w-24`} />
              <div className={`${shimmer} h-3.5 w-24`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClientDetailSkeleton;
