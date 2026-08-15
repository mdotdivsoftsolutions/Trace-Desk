'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  Plus,
  FolderKanban,
  UserPlus,
  Receipt,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { useSettings, useAuth } from '@/hooks';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const { data: settings } = useSettings();
  const { user } = useAuth();

  const agencyName = settings?.agencyName || 'M.Div Softsolutions';
  const userRole = user?.role || 'super_admin';

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-[#0F172A] text-neutral-900 dark:text-neutral-100 antialiased font-sans overflow-x-clip">
      {/* Sidebar Component with User Profile Footer */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area — flex-1 with stable min-width to prevent scroll-caused shifts */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header Bar — sticky + explicit h-16 so it never shifts */}
        <header className="sticky top-0 z-30 h-16 shrink-0 border-b border-neutral-200 dark:border-[#334155] bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#334155]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-sm text-neutral-900 dark:text-white hidden sm:inline">
                {agencyName}
              </span>
              {/* Fixed min-w so role badge never causes header width jitter */}
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-[#334155] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-[#334155] uppercase tracking-wider min-w-[68px] justify-center">
                {userRole.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Action Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 active:scale-95 text-xs font-bold shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Quick Create</span>
              </button>

              {isQuickAddOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsQuickAddOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <Link
                      href="/projects/new"
                      onClick={() => setIsQuickAddOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#334155] transition-colors"
                    >
                      <FolderKanban className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
                      <span>New Project</span>
                    </Link>
                    <Link
                      href="/clients"
                      onClick={() => setIsQuickAddOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#334155] transition-colors"
                    >
                      <UserPlus className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
                      <span>New Client</span>
                    </Link>
                    <Link
                      href="/invoices/new"
                      onClick={() => setIsQuickAddOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#334155] transition-colors"
                    >
                      <Receipt className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
                      <span>New Invoice</span>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Theme Switcher */}
            <ThemeToggle />
          </div>
        </header>

        {/* Dynamic Route View — min-h prevents collapse when content is short */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
