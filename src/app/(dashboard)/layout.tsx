'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  Plus,
  FolderKanban,
  UserPlus,
  Receipt,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Shield,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { useSettings, useAuth } from '@/hooks';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { data: settings } = useSettings();
  const { user, logout, isLoggingOut } = useAuth();

  const agencyName = settings?.agencyName || 'M.Div Softsolutions';
  const userName = user?.name || 'Manu .M (M.Div SoftSolutions )';
  const userEmail = user?.email || 'manum66466@gmail.com';
  const userRole = user?.role || 'super_admin';

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-[#0F172A] text-neutral-900 dark:text-neutral-100 antialiased font-sans">
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
        <header className="sticky top-0 z-30 h-16 border-b border-neutral-200 dark:border-[#334155] bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
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
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-[#334155] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-[#334155] uppercase tracking-wider">
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

            {/* User Profile & Logout Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-[#334155] hover:bg-neutral-100 dark:hover:bg-[#334155] transition-colors"
              >
                <div className="w-7 h-7 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs flex items-center justify-center shadow-sm">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white leading-tight max-w-[130px] truncate">
                    {userName}
                  </span>
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-400 font-medium">
                    {userRole === 'super_admin' ? 'Super Admin' : userRole}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-60 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3.5 py-2.5 border-b border-neutral-200 dark:border-[#334155]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                          {userName}
                        </span>
                        <Shield className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400 flex-shrink-0" />
                      </div>
                      <span className="text-[11px] text-neutral-400 dark:text-neutral-400 block truncate mt-0.5">
                        {userEmail}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#334155] transition-colors"
                      >
                        <Settings className="w-4 h-4 text-neutral-500" />
                        <span>Agency Settings</span>
                      </Link>
                    </div>

                    <div className="border-t border-neutral-200 dark:border-[#334155] pt-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors text-left disabled:opacity-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
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
