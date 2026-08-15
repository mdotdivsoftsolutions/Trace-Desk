'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  Plus,
  Layers,
  FolderKanban,
  UserPlus,
  Receipt,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { useSettings } from '@/hooks';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const { data: settings } = useSettings();

  const agencyName = settings?.agencyName || 'M.Div Softsolutions';

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-[#0B0F19] text-neutral-900 dark:text-neutral-100 antialiased font-sans">
      {/* Sidebar Component */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-neutral-200 dark:border-[#232B3D] bg-white/95 dark:bg-[#131A2A]/95 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-sm text-neutral-900 dark:text-white hidden sm:inline">
                {agencyName}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                PRO
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Action Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold shadow-sm transition-all"
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
                  <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-[#131A2A] border border-neutral-200 dark:border-[#232B3D] shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <Link
                      href="/projects"
                      onClick={() => setIsQuickAddOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <FolderKanban className="w-4 h-4 text-indigo-500" />
                      <span>New Project</span>
                    </Link>
                    <Link
                      href="/clients"
                      onClick={() => setIsQuickAddOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <UserPlus className="w-4 h-4 text-indigo-500" />
                      <span>New Client</span>
                    </Link>
                    <Link
                      href="/invoices/new"
                      onClick={() => setIsQuickAddOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <Receipt className="w-4 h-4 text-indigo-500" />
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

        {/* Dynamic Route View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
