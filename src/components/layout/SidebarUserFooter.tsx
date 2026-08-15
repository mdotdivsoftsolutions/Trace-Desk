'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Settings, LogOut, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks';

interface SidebarUserFooterProps {
  isCollapsed: boolean;
}

export function SidebarUserFooter({ isCollapsed }: SidebarUserFooterProps) {
  const { user, logout, isLoggingOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userName = user?.name || 'Manu .M (M.Div SoftSolutions )';
  const userEmail = user?.email || 'manum66466@gmail.com';
  const userRole = user?.role || 'super_admin';

  return (
    <div className="p-3 border-t border-neutral-200 dark:border-[#334155] relative">
      {isUserMenuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
          <div
            className={cn(
              'absolute bottom-full mb-2 rounded-xl bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150',
              isCollapsed ? 'left-2 w-64' : 'left-3 right-3'
            )}
          >
            <div className="px-3.5 py-2.5 border-b border-neutral-200 dark:border-[#334155]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">{userName}</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-neutral-100 dark:bg-[#334155] text-neutral-700 dark:text-neutral-300 uppercase tracking-wider flex-shrink-0">
                  {userRole === 'super_admin' ? 'SUPER ADMIN' : userRole}
                </span>
              </div>
              <span className="text-[11px] text-neutral-400 dark:text-neutral-400 block truncate mt-0.5">{userEmail}</span>
            </div>

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

      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className={cn(
          'w-full rounded-lg bg-neutral-50 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155] hover:border-neutral-400 dark:hover:border-neutral-500 transition-all flex items-center group text-left relative',
          isCollapsed ? 'w-11 h-11 mx-auto justify-center p-0' : 'p-2.5 justify-between gap-2.5'
        )}
        title={isCollapsed ? `${userName} (${userRole})` : undefined}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs flex items-center justify-center shadow-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0F172A] absolute -bottom-0.5 -right-0.5" />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">{userName}</span>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-400 font-medium truncate uppercase tracking-wider">
                {userRole === 'super_admin' ? 'Super Admin' : userRole}
              </span>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <ChevronUp className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200 transition-colors flex-shrink-0" />
        )}
      </button>
    </div>
  );
}

export default SidebarUserFooter;
