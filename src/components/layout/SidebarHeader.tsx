'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarHeaderProps {
  agencyName: string;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  setIsMobileOpen: (open: boolean) => void;
}

export function SidebarHeader({
  agencyName,
  isCollapsed,
  setIsCollapsed,
  setIsMobileOpen,
}: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        'h-16 flex items-center border-b border-neutral-200 dark:border-[#334155] transition-all',
        isCollapsed ? 'px-2 justify-center gap-1.5' : 'px-4 justify-between'
      )}
    >
      {isCollapsed ? (
        <div className="flex items-center justify-center gap-1 w-full">
          <Link href="/" className="group flex-shrink-0" title={`${agencyName} - Control Desk`}>
            <div className="w-8 h-8 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </Link>
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#334155] transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          <Link href="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-heading font-bold text-sm tracking-tight text-neutral-900 dark:text-white truncate">
                {agencyName}
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-400">
                Control Desk
              </span>
            </div>
          </Link>
          <button
            onClick={() => setIsCollapsed(true)}
            className="hidden lg:flex p-1.5 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#334155] transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
}

export default SidebarHeader;
