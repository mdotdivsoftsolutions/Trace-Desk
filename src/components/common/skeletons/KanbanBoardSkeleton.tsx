import React from 'react';

/**
 * Animated exact-geometry skeleton for the Kanban Board.
 */
export function KanbanBoardSkeleton() {
  const shimmer = "animate-pulse bg-slate-200/70 dark:bg-slate-800/60 rounded";
  const columns = ['To Do', 'In Progress', 'Review', 'Done'];

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 w-full h-full min-h-[600px]">
      {columns.map((col, colIdx) => (
        <div key={col} className="w-80 flex-shrink-0 flex flex-col bg-neutral-100 dark:bg-[#0F172A] rounded-xl p-3">
          {/* Column Header */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-sm text-neutral-900 dark:text-white">{col}</span>
              <div className={`${shimmer} h-5 w-6 rounded-full`} />
            </div>
            <div className={`${shimmer} h-6 w-6 rounded-md`} />
          </div>

          {/* Column Task Cards */}
          <div className="flex flex-col gap-3 flex-1">
            {/* 2 to 3 dummy cards depending on the column to look natural */}
            {Array.from({ length: colIdx === 1 ? 3 : 2 }).map((_, cardIdx) => (
              <div 
                key={cardIdx}
                className="bg-white dark:bg-[#1E293B] p-4 rounded-lg border border-neutral-200 dark:border-[#334155] shadow-sm flex flex-col gap-3"
              >
                {/* Title and Priority Row */}
                <div className="flex justify-between items-start gap-2">
                  <div className={`${shimmer} h-4 w-3/4`} />
                  <div className={`${shimmer} h-5 w-12 rounded-full`} />
                </div>
                {/* Description lines */}
                <div className="space-y-1.5">
                  <div className={`${shimmer} h-3 w-full`} />
                  <div className={`${shimmer} h-3 w-2/3`} />
                </div>
                {/* Footer (Due date and Avatar) */}
                <div className="flex justify-between items-center pt-2 mt-1 border-t border-neutral-100 dark:border-neutral-800">
                  <div className={`${shimmer} h-3 w-16`} />
                  <div className={`${shimmer} h-6 w-6 rounded-full`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default KanbanBoardSkeleton;
