import React from 'react';

/**
 * Animated exact-geometry skeleton for the Project Workspace.
 * Keeps lines under 80 by combining simple blocks.
 */
export function ProjectWorkspaceSkeleton() {
  const shimmer = "animate-pulse bg-slate-200/70 dark:bg-slate-800/60 rounded";

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 w-full">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <div className={`${shimmer} h-8 w-64`} />
            <div className={`${shimmer} h-6 w-20 rounded-full`} />
          </div>
          <div className="flex items-center gap-2">
            <div className={`${shimmer} h-4 w-40`} />
            <div className={`${shimmer} h-4 w-32`} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`${shimmer} h-9 w-24 rounded-md`} />
          <div className={`${shimmer} h-9 w-28 rounded-md`} />
        </div>
      </div>

      {/* Grid Layout: Main content (Tabs) + Sidebar (Client) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation Row */}
          <div className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 pb-px">
            <div className={`${shimmer} h-10 w-24 rounded-t-md rounded-b-none mr-2`} />
            <div className={`${shimmer} h-10 w-24 rounded-t-md rounded-b-none mr-2`} />
            <div className={`${shimmer} h-10 w-24 rounded-t-md rounded-b-none`} />
          </div>
          
          {/* Tab Panel Content Placeholder */}
          <div className="bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] rounded-xl shadow-sm min-h-[400px] p-6 space-y-6">
            <div className="space-y-3">
              <div className={`${shimmer} h-5 w-1/3`} />
              <div className={`${shimmer} h-4 w-full`} />
              <div className={`${shimmer} h-4 w-5/6`} />
              <div className={`${shimmer} h-4 w-4/6`} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
               <div className={`${shimmer} h-24 w-full rounded-lg`} />
               <div className={`${shimmer} h-24 w-full rounded-lg`} />
            </div>
          </div>
        </div>

        {/* Sidebar Client Card Placeholder */}
        <div className="bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] rounded-xl shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-4">
             <div className={`${shimmer} w-12 h-12 rounded-full`} />
             <div className="space-y-2 flex-1">
               <div className={`${shimmer} h-4 w-3/4`} />
               <div className={`${shimmer} h-3 w-1/2`} />
             </div>
          </div>
          <div className={`${shimmer} h-px w-full`} />
          <div className="space-y-3">
             <div className={`${shimmer} h-3 w-full`} />
             <div className={`${shimmer} h-3 w-5/6`} />
          </div>
          <div className={`${shimmer} h-9 w-full rounded-md mt-4`} />
        </div>
      </div>
    </div>
  );
}

export default ProjectWorkspaceSkeleton;
