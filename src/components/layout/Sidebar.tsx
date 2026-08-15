'use client';

import React from 'react';
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
  Layers,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettings } from '@/hooks';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const navItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Clients',
    href: '/clients',
    icon: Users,
  },
  {
    label: 'Projects',
    href: '/projects',
    icon: FolderKanban,
  },
  {
    label: 'Invoices & Billing',
    href: '/invoices',
    icon: Receipt,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const { data: settings } = useSettings();
  const agencyName = settings?.agencyName || 'M.Div Softsolutions';

  return (
    <>
      {/* Mobile Backdrop */}
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
        {/* Sidebar Header with Branding */}
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

              {/* Desktop Collapse Toggle */}
              <button
                onClick={() => setIsCollapsed(true)}
                className="hidden lg:flex p-1.5 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#334155] transition-colors"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Mobile Close Button */}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden p-1.5 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Navigation Links */}
        <div className={cn('flex-1 py-4 space-y-1.5 overflow-y-auto', isCollapsed ? 'px-2' : 'px-3')}>
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
                  'flex items-center rounded-lg font-medium text-xs transition-all group relative',
                  isCollapsed
                    ? 'w-11 h-11 mx-auto justify-center p-0'
                    : 'gap-3 px-3 py-2.5 w-full',
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#334155]'
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 flex-shrink-0',
                    isActive
                      ? 'text-white dark:text-neutral-900'
                      : 'text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white'
                  )}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-neutral-200 dark:border-[#334155]">
          <div
            className={cn(
              'rounded-lg bg-neutral-50 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155] flex items-center transition-all',
              isCollapsed
                ? 'w-10 h-10 mx-auto justify-center p-0'
                : 'p-2.5 gap-2.5'
            )}
            title={`${settings?.defaultCurrency || 'INR'} Workspace (Online)`}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                  {settings?.defaultCurrency || 'INR'} Workspace
                </span>
                <span className="text-[10px] text-neutral-400">Online</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
