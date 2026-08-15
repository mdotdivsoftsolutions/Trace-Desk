import React from 'react';

/**
 * Animated exact-geometry skeleton for the Invoice Ledger Table.
 */
export function InvoiceTableSkeleton() {
  const shimmer = 'animate-pulse bg-slate-200/70 dark:bg-slate-800/60 rounded';

  return (
    <div className="rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 dark:bg-[#0F172A] text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-[#334155]">
            <tr>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Invoice #</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Client & Project</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Dates</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Total</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Balance Due</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-[#334155]">
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="transition-colors">
                {/* Invoice # */}
                <td className="px-5 py-4">
                  <div className={`${shimmer} h-4 w-20`} />
                </td>
                {/* Client & Project */}
                <td className="px-5 py-4">
                  <div className="space-y-1.5 max-w-[200px]">
                    <div className={`${shimmer} h-4 w-32`} />
                    <div className={`${shimmer} h-3 w-24`} />
                  </div>
                </td>
                {/* Dates */}
                <td className="px-5 py-4">
                  <div className="space-y-1">
                    <div className={`${shimmer} h-3 w-24`} />
                    <div className={`${shimmer} h-3 w-20`} />
                  </div>
                </td>
                {/* Total */}
                <td className="px-5 py-4">
                  <div className={`${shimmer} h-4 w-20`} />
                </td>
                {/* Balance Due */}
                <td className="px-5 py-4">
                  <div className={`${shimmer} h-4 w-18`} />
                </td>
                {/* Status */}
                <td className="px-5 py-4">
                  <div className={`${shimmer} h-5 w-16 rounded`} />
                </td>
                {/* Actions */}
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <div className={`${shimmer} h-7 w-7 rounded-md`} />
                    <div className={`${shimmer} h-7 w-7 rounded-md`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InvoiceTableSkeleton;
