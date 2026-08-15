'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useSettings } from '@/hooks';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNav } from './SidebarNav';
import { SidebarUserFooter } from './SidebarUserFooter';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const { data: settings } = useSettings();
  const agencyName = settings?.agencyName || 'M.Div Softsolutions';

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 h-screen z-50 flex flex-col justify-between border-r border-neutral-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] backdrop-blur-xl transition-all duration-300 ease-in-out select-none',
          isCollapsed ? 'w-20' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <SidebarHeader
          agencyName={agencyName}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          setIsMobileOpen={setIsMobileOpen}
        />
        <SidebarNav
          isCollapsed={isCollapsed}
          onNavigate={() => setIsMobileOpen(false)}
        />
        <SidebarUserFooter isCollapsed={isCollapsed} />
      </aside>
    </>
  );
}

export default Sidebar;
