import React from 'react';

/**
 * Animated exact-geometry skeleton for the Project Workspace.
 * Accurately mirrors ProjectHeader, ProjectClientSnapshot, TabBar, and Milestones Tab.
 */
export function ProjectWorkspaceSkeleton() {
  const shimmer = 'animate-pulse bg-slate-200/70 dark:bg-slate-800/60 rounded';

  return (
    <div className="space-y-6 w-full pb-12">
      {/* 1. Back Navigation Link */}
      <div className="flex items-center gap-2">
        <div className={`${shimmer} h-3.5 w-3.5 rounded`} />
        <div className={`${shimmer} h-3.5 w-44`} />
      </div>

      {/* 2. ProjectHeader Card */}
      <div className="p-6 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-4">
        {/* Top bar: Title, status, budget, deadline, actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              {/* Project Title */}
              <div className={`${shimmer} h-7 w-64 sm:w-80`} />
              {/* Status Badge */}
              <div className={`${shimmer} h-5 w-20 rounded`} />
              {/* Budget Badge */}
              <div className={`${shimmer} h-5 w-24 rounded`} />
              {/* Deadline Badge */}
              <div className={`${shimmer} h-5 w-32 rounded`} />
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <div className={`${shimmer} h-4 w-12`} />
              <div className={`${shimmer} h-5 w-16 rounded`} />
              <div className={`${shimmer} h-5 w-20 rounded`} />
              <div className={`${shimmer} h-5 w-14 rounded`} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className={`${shimmer} h-8 w-28 rounded-md`} />
            <div className={`${shimmer} h-8 w-24 rounded-md`} />
            <div className={`${shimmer} h-8 w-32 rounded-md`} />
            <div className={`${shimmer} h-8 w-28 rounded-md`} />
          </div>
        </div>

        {/* Project Description Skeleton */}
        <div className="pt-3 border-t border-neutral-100 dark:border-[#334155]/60 max-w-4xl space-y-2">
          <div className={`${shimmer} h-3.5 w-full`} />
          <div className={`${shimmer} h-3.5 w-4/5`} />
        </div>

        {/* Milestone Progression Bar */}
        <div className="space-y-1.5 pt-2 border-t border-neutral-200 dark:border-[#334155]">
          <div className="flex items-center justify-between">
            <div className={`${shimmer} h-3.5 w-48`} />
            <div className={`${shimmer} h-3.5 w-24`} />
          </div>
          <div className="w-full bg-neutral-100 dark:bg-[#0F172A] h-2.5 rounded-full overflow-hidden p-0.5 border border-neutral-200 dark:border-[#334155]">
            <div className={`${shimmer} h-full w-2/5 rounded-full`} />
          </div>
        </div>
      </div>

      {/* 3. ProjectClientSnapshot Card (Full Width Banner) */}
      <div className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`${shimmer} w-10 h-10 rounded-md flex-shrink-0`} />
          <div className="space-y-1.5">
            <div className={`${shimmer} h-2.5 w-20`} />
            <div className={`${shimmer} h-4 w-44`} />
            <div className="flex items-center gap-3">
              <div className={`${shimmer} h-3 w-32`} />
              <div className={`${shimmer} h-3 w-24`} />
            </div>
          </div>
        </div>
        <div className={`${shimmer} h-8 w-36 rounded-md flex-shrink-0`} />
      </div>

      {/* 4. Tab Bar Navigation */}
      <div className="h-11 flex items-end gap-1 border-b border-neutral-200 dark:border-[#334155] select-none">
        {/* Active Tab (Milestones) */}
        <div className="relative h-full px-4 flex items-center gap-1.5 pb-[1px]">
          <div className={`${shimmer} h-4 w-18`} />
          <div className={`${shimmer} h-4 w-5 rounded`} />
          <span className="absolute bottom-0 inset-x-0 h-0.5 rounded-t bg-neutral-300 dark:bg-neutral-600" />
        </div>
        {/* Inactive Tabs */}
        <div className="h-full px-4 flex items-center gap-1.5 pb-[1px]">
          <div className={`${shimmer} h-4 w-12`} />
          <div className={`${shimmer} h-4 w-5 rounded`} />
        </div>
        <div className="h-full px-4 flex items-center gap-1.5 pb-[1px]">
          <div className={`${shimmer} h-4 w-16`} />
        </div>
        <div className="h-full px-4 flex items-center gap-1.5 pb-[1px]">
          <div className={`${shimmer} h-4 w-18`} />
        </div>
        <div className="h-full px-4 flex items-center gap-1.5 pb-[1px]">
          <div className={`${shimmer} h-4 w-24`} />
        </div>
      </div>

      {/* 5. Milestones Tab Deliverables Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className={`${shimmer} h-3.5 w-48`} />
          <div className={`${shimmer} h-7 w-32 rounded-md`} />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5">
                  <div className={`${shimmer} h-3.5 w-6`} />
                  <div className={`${shimmer} h-4.5 w-48`} />
                  <div className={`${shimmer} h-4.5 w-20 rounded`} />
                </div>
                <div className={`${shimmer} h-3 w-4/5`} />
                <div className={`${shimmer} h-3 w-32`} />
              </div>
              <div className="flex items-center gap-4 self-start md:self-auto flex-shrink-0">
                <div className="space-y-1 text-right">
                  <div className={`${shimmer} h-2.5 w-24 ml-auto`} />
                  <div className={`${shimmer} h-5 w-20 ml-auto`} />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`${shimmer} h-7 w-24 rounded-md`} />
                  <div className={`${shimmer} h-7 w-7 rounded`} />
                  <div className={`${shimmer} h-7 w-7 rounded`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectWorkspaceSkeleton;
