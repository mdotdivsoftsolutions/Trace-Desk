import React from 'react';

/**
 * Animated exact-geometry skeleton for the Project Cards.
 */
export function ProjectCardSkeleton() {
  const shimmer = "animate-pulse bg-slate-200/70 dark:bg-slate-800/60 rounded";

  return (
    <div className="p-5 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm flex flex-col min-h-[200px]">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2 flex-1 pr-4">
          {/* Title Placeholder */}
          <div className={`${shimmer} h-5 w-3/4`} />
          {/* Client Placeholder */}
          <div className={`${shimmer} h-3 w-1/2`} />
        </div>
        {/* Status Pill Placeholder */}
        <div className={`${shimmer} h-6 w-20 rounded-full`} />
      </div>

      {/* Description Placeholder */}
      <div className="space-y-1.5 flex-1">
        <div className={`${shimmer} h-3 w-full`} />
        <div className={`${shimmer} h-3 w-5/6`} />
      </div>

      <div className="mt-6 space-y-4">
        {/* Progress Bar Placeholder */}
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <div className={`${shimmer} h-2.5 w-16`} />
            <div className={`${shimmer} h-2.5 w-8`} />
          </div>
          <div className={`${shimmer} h-2 w-full rounded-full`} />
        </div>

        {/* Footer info row */}
        <div className="flex justify-between items-center pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <div className={`${shimmer} h-3 w-24`} />
          <div className="flex gap-2">
            <div className={`${shimmer} h-6 w-16 rounded-md`} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCardSkeleton;
