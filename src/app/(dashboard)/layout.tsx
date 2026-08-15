'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Receipt,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Menu,
  X,
  Layers,
  Sparkles,
  CheckCircle2,
  FileText,
  UserPlus,
} from 'lucide-react';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Clients', href: '/clients', icon: Users },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Invoices & Billing', href: '/invoices', icon: Receipt },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-neutral-50/50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 antialiased">
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 h-screen z-50 flex flex-col justify-between border-r border-neutral-200/80 dark:border-neutral-800/80 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-20' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-neutral-200/60 dark:border-neutral-800/60">
          <Link href="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-500 dark:from-white dark:via-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent">
                  Trace<span className="text-indigo-600 dark:text-indigo-400">Desk</span>
                </span>
                <span className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
                  Agency Hub
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all group relative',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80'
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110',
                    isActive ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200'
                  )}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                {!isCollapsed && item.badge && (
                  <span className="ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer User Card */}
        <div className="p-3 border-t border-neutral-200/60 dark:border-neutral-800/60">
          <div
            className={cn(
              'flex items-center gap-3 p-2 rounded-xl bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200/40 dark:border-neutral-700/40',
              isCollapsed && 'justify-center p-1'
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
              TD
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                  Admin Workspace
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Single-Tenant Ready
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl px-4 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>SoloOps Executive Hub</span>
              </h1>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Add Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-medium text-xs shadow-md shadow-indigo-600/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline font-semibold">Quick Create</span>
              </button>

              {/* Quick Add Menu */}
              {isQuickAddOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsQuickAddOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <Link
                      href="/projects"
                      onClick={() => setIsQuickAddOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <FolderKanban className="w-4 h-4 text-indigo-500" />
                      <span>New Project</span>
                    </Link>
                    <Link
                      href="/clients"
                      onClick={() => setIsQuickAddOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <UserPlus className="w-4 h-4 text-emerald-500" />
                      <span>New Client</span>
                    </Link>
                    <Link
                      href="/invoices"
                      onClick={() => setIsQuickAddOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-amber-500" />
                      <span>New Invoice</span>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </header>

        {/* Body Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
