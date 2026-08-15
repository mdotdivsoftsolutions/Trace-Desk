'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '@/types';
import { cn } from '@/lib/utils';

interface PaginationProps {
  pagination?: PaginationMeta;
  onPageChange: (newPage: number) => void;
  className?: string;
}

export function Pagination({ pagination, onPageChange, className }: PaginationProps) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total, limit } = pagination;

  const startRecord = (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, total);

  // Generate page number array
  const pages: number[] = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-neutral-200 dark:border-[#2A2A2A] text-xs',
        className
      )}
    >
      <div className="text-neutral-500 dark:text-neutral-400">
        Showing <span className="font-semibold text-neutral-900 dark:text-white">{startRecord}</span> to{' '}
        <span className="font-semibold text-neutral-900 dark:text-white">{endRecord}</span> of{' '}
        <span className="font-semibold text-neutral-900 dark:text-white">{total}</span> entries
      </div>

      <div className="flex items-center gap-1.5">
        {/* Previous Page */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!pagination.hasPrevPage}
          className="flex items-center justify-center p-1.5 rounded-md border border-neutral-200 dark:border-[#2A2A2A] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#1A1A1A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* First Page button if skipped */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-2.5 py-1 rounded-md text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#1A1A1A]"
            >
              1
            </button>
            {startPage > 2 && <span className="px-1 text-neutral-400">...</span>}
          </>
        )}

        {/* Numbered Page Buttons */}
        {pages.map((p) => {
          const isCurrent = p === page;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                'min-w-[28px] h-7 px-2 rounded-md text-xs font-semibold transition-all',
                isCurrent
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#1A1A1A]'
              )}
            >
              {p}
            </button>
          );
        })}

        {/* Last Page button if skipped */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-1 text-neutral-400">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-2.5 py-1 rounded-md text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#1A1A1A]"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Page */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!pagination.hasNextPage}
          className="flex items-center justify-center p-1.5 rounded-md border border-neutral-200 dark:border-[#2A2A2A] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#1A1A1A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
