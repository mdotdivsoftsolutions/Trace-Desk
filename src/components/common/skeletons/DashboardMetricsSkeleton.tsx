import React from 'react';

/**
 * Animated exact-geometry skeleton for the Dashboard KPI Grid.
 * Matches `KpiGrid.tsx` structural layout and dimensions.
 */
export function DashboardMetricsSkeleton() {
  const shimmerClass = "animate-pulse bg-slate-200/70 dark:bg-slate-800/60 rounded";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div 
          key={i} 
          className="min-h-[116px] p-5 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            {/* Title Placeholder */}
            <div className={`${shimmerClass} h-3 w-24`} />
            {/* Icon Placeholder */}
            <div className={`${shimmerClass} w-8 h-8 rounded-md`} />
          </div>
          <div className="mt-1">
            {/* Metric Value Placeholder */}
            <div className="h-8 flex items-center">
              <div className={`${shimmerClass} h-7 w-28`} />
            </div>
            {/* Trend/Info Row Placeholder */}
            <div className="mt-1 flex items-center h-4">
              <div className={`${shimmerClass} h-3 w-36`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardMetricsSkeleton;
