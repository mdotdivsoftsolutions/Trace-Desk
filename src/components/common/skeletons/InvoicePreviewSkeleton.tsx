import React from 'react';

/**
 * Animated exact-geometry skeleton for the Invoice Detailed View.
 * Accurately mirrors InvoiceHeaderActions, InvoiceDocumentPreview, and InvoicePaymentHistory.
 */
export function InvoicePreviewSkeleton() {
  const shimmer = 'animate-pulse bg-slate-200/70 dark:bg-slate-800/60 rounded';

  return (
    <div className="space-y-6 w-full pb-12">
      {/* 1. Top Header Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          {/* Back link */}
          <div className="flex items-center gap-1.5">
            <div className={`${shimmer} h-3.5 w-3.5 rounded`} />
            <div className={`${shimmer} h-3.5 w-36`} />
          </div>
          {/* Invoice # and Status Badge */}
          <div className="flex items-center gap-3">
            <div className={`${shimmer} h-7 w-32`} />
            <div className={`${shimmer} h-5 w-16 rounded`} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className={`${shimmer} h-8 w-24 rounded-md`} />
          <div className={`${shimmer} h-8 w-32 rounded-md`} />
        </div>
      </div>

      {/* 2. Main Invoice Document Preview Card */}
      <div className="p-8 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-8">
        {/* Agency Info & Invoice Number Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-neutral-200 dark:border-[#334155] pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className={`${shimmer} w-8 h-8 rounded`} />
              <div className={`${shimmer} h-5 w-44`} />
            </div>
            <div className="space-y-1">
              <div className={`${shimmer} h-3 w-32`} />
              <div className={`${shimmer} h-3 w-40`} />
              <div className={`${shimmer} h-3 w-28`} />
            </div>
          </div>

          <div className="text-left sm:text-right space-y-1.5 sm:ml-auto">
            <div className={`${shimmer} h-7 w-36 sm:ml-auto`} />
            <div className={`${shimmer} h-3 w-32 sm:ml-auto`} />
            <div className={`${shimmer} h-3 w-32 sm:ml-auto`} />
          </div>
        </div>

        {/* Billed To & Project Workspace Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <div className={`${shimmer} h-3 w-16 mb-2`} />
            <div className={`${shimmer} h-4.5 w-40`} />
            <div className={`${shimmer} h-3 w-28`} />
            <div className={`${shimmer} h-3 w-48`} />
          </div>
          <div className="space-y-1.5">
            <div className={`${shimmer} h-3 w-28 mb-2`} />
            <div className={`${shimmer} h-4.5 w-48`} />
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-neutral-200 dark:border-[#334155] rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[3fr_1fr_1fr_1fr] gap-4 p-4 bg-neutral-50 dark:bg-[#0F172A] border-b border-neutral-200 dark:border-[#334155]">
            <div className={`${shimmer} h-3 w-28`} />
            <div className={`${shimmer} h-3 w-12 ml-auto`} />
            <div className={`${shimmer} h-3 w-16 ml-auto`} />
            <div className={`${shimmer} h-3 w-16 ml-auto`} />
          </div>
          {/* Table Rows */}
          <div className="divide-y divide-neutral-200 dark:divide-[#334155]">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="grid grid-cols-[3fr_1fr_1fr_1fr] gap-4 p-4 items-center">
                <div className="space-y-1.5">
                  <div className={`${shimmer} h-4 w-3/4`} />
                  <div className={`${shimmer} h-3 w-1/2`} />
                </div>
                <div className={`${shimmer} h-3.5 w-8 ml-auto`} />
                <div className={`${shimmer} h-3.5 w-16 ml-auto`} />
                <div className={`${shimmer} h-3.5 w-20 ml-auto`} />
              </div>
            ))}
          </div>
        </div>

        {/* Totals Summary */}
        <div className="flex justify-end pt-2">
          <div className="w-full max-w-xs space-y-3">
            <div className="flex justify-between items-center">
              <div className={`${shimmer} h-3.5 w-16`} />
              <div className={`${shimmer} h-3.5 w-20`} />
            </div>
            <div className="flex justify-between items-center">
              <div className={`${shimmer} h-3.5 w-20`} />
              <div className={`${shimmer} h-3.5 w-16`} />
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-neutral-200 dark:border-[#334155]">
              <div className={`${shimmer} h-5 w-20`} />
              <div className={`${shimmer} h-5 w-28`} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Payment Settlement Ledger Skeleton Card */}
      <div className="p-6 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className={`${shimmer} w-4 h-4 rounded-full`} />
          <div className={`${shimmer} h-4 w-52`} />
        </div>
        <div className="overflow-x-auto border border-neutral-200 dark:border-[#334155] rounded-md">
          <div className="grid grid-cols-4 gap-4 px-4 py-2.5 bg-neutral-50 dark:bg-[#0F172A] border-b border-neutral-200 dark:border-[#334155]">
            <div className={`${shimmer} h-3 w-16`} />
            <div className={`${shimmer} h-3 w-16`} />
            <div className={`${shimmer} h-3 w-20`} />
            <div className={`${shimmer} h-3 w-20 ml-auto`} />
          </div>
          <div className="divide-y divide-neutral-200 dark:divide-[#334155]">
            <div className="grid grid-cols-4 gap-4 px-4 py-3 items-center">
              <div className={`${shimmer} h-3 w-20`} />
              <div className={`${shimmer} h-3 w-14`} />
              <div className={`${shimmer} h-3 w-24`} />
              <div className={`${shimmer} h-3.5 w-16 ml-auto`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoicePreviewSkeleton;
