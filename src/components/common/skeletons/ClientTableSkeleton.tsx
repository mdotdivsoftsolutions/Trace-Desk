import React from 'react';

/**
 * Animated exact-geometry skeleton for the Clients Table.
 */
export function ClientTableSkeleton() {
  const shimmer = "animate-pulse bg-slate-200/70 dark:bg-slate-800/60 rounded";

  return (
    <div className="w-full">
      {/* Table Header Placeholder */}
      <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-neutral-200 dark:border-[#334155] bg-neutral-50/50 dark:bg-[#1E293B]/50">
        <div className={`${shimmer} h-3 w-20`} />
        <div className={`${shimmer} h-3 w-16`} />
        <div className={`${shimmer} h-3 w-24`} />
        <div className={`${shimmer} h-3 w-10`} />
      </div>

      {/* Table Rows Placeholder */}
      <div className="divide-y divide-neutral-200 dark:divide-[#334155]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center">
            {/* Client Info Cell */}
            <div className="flex items-center gap-3">
              <div className={`${shimmer} w-8 h-8 rounded-full flex-shrink-0`} />
              <div className="space-y-1.5 flex-1 max-w-[200px]">
                <div className={`${shimmer} h-4 w-3/4`} />
                <div className={`${shimmer} h-2.5 w-1/2`} />
              </div>
            </div>
            {/* Country/Currency Cell */}
            <div className="flex items-center gap-1.5">
              <div className={`${shimmer} h-3 w-12`} />
              <div className={`${shimmer} h-4 w-4 rounded-full`} />
            </div>
            {/* Status Cell */}
            <div>
              <div className={`${shimmer} h-5 w-16 rounded-md`} />
            </div>
            {/* Actions Cell */}
            <div>
              <div className={`${shimmer} h-8 w-8 rounded-md`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClientTableSkeleton;
