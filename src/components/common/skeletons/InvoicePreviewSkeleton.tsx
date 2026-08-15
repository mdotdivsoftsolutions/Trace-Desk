import React from 'react';

/**
 * Animated exact-geometry skeleton for the Invoice Document Preview.
 */
export function InvoicePreviewSkeleton() {
  const shimmer = "animate-pulse bg-slate-200/70 dark:bg-slate-800/60 rounded";

  return (
    <div className="bg-white dark:bg-[#1E293B] shadow-sm border border-neutral-200 dark:border-[#334155] rounded-xl overflow-hidden w-full max-w-4xl mx-auto p-8 sm:p-12 space-y-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div className="space-y-4">
          {/* Logo placeholder */}
          <div className={`${shimmer} h-12 w-32`} />
          <div className="space-y-1">
            <div className={`${shimmer} h-3 w-40`} />
            <div className={`${shimmer} h-3 w-32`} />
          </div>
        </div>
        <div className="text-left sm:text-right space-y-2">
          {/* Invoice Number & Date Placeholders */}
          <div className={`${shimmer} h-8 w-48 sm:ml-auto`} />
          <div className={`${shimmer} h-4 w-32 sm:ml-auto`} />
          <div className={`${shimmer} h-4 w-36 sm:ml-auto`} />
        </div>
      </div>

      {/* Client Meta Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-2">
          <div className={`${shimmer} h-4 w-16 mb-3`} /> {/* "Billed To" label */}
          <div className={`${shimmer} h-5 w-48`} />
          <div className={`${shimmer} h-4 w-32`} />
          <div className={`${shimmer} h-4 w-40`} />
        </div>
        <div className="space-y-2 sm:text-right">
          <div className={`${shimmer} h-4 w-24 mb-3 sm:ml-auto`} /> {/* Payment Info label */}
          <div className={`${shimmer} h-4 w-32 sm:ml-auto`} />
          <div className={`${shimmer} h-4 w-28 sm:ml-auto`} />
        </div>
      </div>

      {/* Line Items Table */}
      <div className="mt-8 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[3fr_1fr_1fr_1fr] gap-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
          <div className={`${shimmer} h-3 w-32`} />
          <div className={`${shimmer} h-3 w-16 ml-auto`} />
          <div className={`${shimmer} h-3 w-16 ml-auto`} />
          <div className={`${shimmer} h-3 w-20 ml-auto`} />
        </div>
        {/* 4 Rows */}
        <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="grid grid-cols-[3fr_1fr_1fr_1fr] gap-4 p-4">
              <div className="space-y-2">
                <div className={`${shimmer} h-4 w-3/4`} />
                <div className={`${shimmer} h-3 w-1/2`} />
              </div>
              <div className={`${shimmer} h-4 w-12 ml-auto`} />
              <div className={`${shimmer} h-4 w-16 ml-auto`} />
              <div className={`${shimmer} h-4 w-20 ml-auto`} />
            </div>
          ))}
        </div>
      </div>

      {/* Totals Summary */}
      <div className="flex justify-end pt-6">
        <div className="w-full max-w-sm space-y-4">
          <div className="flex justify-between items-center">
            <div className={`${shimmer} h-4 w-20`} />
            <div className={`${shimmer} h-4 w-24`} />
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-neutral-200 dark:border-neutral-700">
            <div className={`${shimmer} h-4 w-16`} />
            <div className={`${shimmer} h-4 w-20`} />
          </div>
          <div className="flex justify-between items-center">
            <div className={`${shimmer} h-6 w-24`} />
            <div className={`${shimmer} h-6 w-32`} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoicePreviewSkeleton;
