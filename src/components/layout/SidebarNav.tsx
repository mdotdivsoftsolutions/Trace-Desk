'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FolderKanban, Receipt, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarNavProps {
  isCollapsed: boolean;
  onNavigate?: () => void;
}

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Clients', href: '/clients', icon: Users },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Invoices & Billing', href: '/invoices', icon: Receipt },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function SidebarNav({ isCollapsed, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
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
            onClick={onNavigate}
            className={cn(
              'flex items-center rounded-lg font-medium text-xs transition-all group relative',
              isCollapsed ? 'w-11 h-11 mx-auto justify-center p-0' : 'gap-3 px-3 py-2.5 w-full',
              isActive
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#334155]'
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <Icon
              className={cn(
                'w-4 h-4 flex-shrink-0',
                isActive ? 'text-white dark:text-neutral-900' : 'text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white'
              )}
            />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}
    </div>
  );
}

export default SidebarNav;
