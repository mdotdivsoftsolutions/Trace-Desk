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
  Layers,
  X,
  LogOut,
  Shield,
  MoreVertical,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettings, useAuth } from '@/hooks';

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
  const { user, logout, isLoggingOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const agencyName = settings?.agencyName || 'M.Div Softsolutions';
  const userName = user?.name || 'Manu .M (M.Div SoftSolutions )';
  const userEmail = user?.email || 'manum66466@gmail.com';
  const userRole = user?.role || 'super_admin';

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

        {/* Sidebar Footer: Interactive User Profile & Sign Out */}
        <div className="p-3 border-t border-neutral-200 dark:border-[#334155] relative">
          {/* User Popover Menu (Opens upwards) */}
          {isUserMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div
                className={cn(
                  'absolute bottom-full mb-2 rounded-xl bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150',
                  isCollapsed ? 'left-2 w-64' : 'left-3 right-3'
                )}
              >
                {/* User Info Header */}
                <div className="px-3.5 py-2.5 border-b border-neutral-200 dark:border-[#334155]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                      {userName}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-neutral-100 dark:bg-[#334155] text-neutral-700 dark:text-neutral-300 uppercase tracking-wider flex-shrink-0">
                      {userRole === 'super_admin' ? 'SUPER ADMIN' : userRole}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400 dark:text-neutral-400 block truncate mt-0.5">
                    {userEmail}
                  </span>
                </div>

                {/* Quick Menu Options */}
                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#334155] transition-colors"
                  >
                    <Settings className="w-4 h-4 text-neutral-500" />
                    <span>Platform Settings</span>
                  </Link>
                </div>

                {/* Sign Out Action */}
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
                    <span>{isLoggingOut ? 'Signing out...' : 'Sign Out of Hub'}</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Footer Trigger Card */}
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={cn(
              'w-full rounded-lg bg-neutral-50 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155] hover:border-neutral-400 dark:hover:border-neutral-500 transition-all flex items-center group text-left relative',
              isCollapsed ? 'w-11 h-11 mx-auto justify-center p-0' : 'p-2.5 justify-between gap-2.5'
            )}
            title={isCollapsed ? `${userName} (${userRole})` : undefined}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Avatar Initial with Pulse Dot */}
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs flex items-center justify-center shadow-sm">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0F172A] absolute -bottom-0.5 -right-0.5" />
              </div>

              {/* Name & Role Text (Expanded Mode) */}
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white truncate group-hover:text-neutral-900 dark:group-hover:text-white">
                    {userName}
                  </span>
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-400 font-medium truncate uppercase tracking-wider">
                    {userRole === 'super_admin' ? 'Super Admin' : userRole}
                  </span>
                </div>
              )}
            </div>

            {/* Upward Chevron (Expanded Mode) */}
            {!isCollapsed && (
              <ChevronUp className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200 transition-colors flex-shrink-0" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
