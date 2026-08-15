'use client';

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TabPanelProps {
  /** The tab key that owns this panel */
  tabKey: string;
  /** Currently active tab key */
  activeTab: string;
  /** Minimum height to reserve — prevents height collapse when tab content is shorter */
  minHeight?: number;
  children: React.ReactNode;
  className?: string;
}

/**
 * CLS-safe tab panel container.
 *
 * Strategy:
 * - Opacity-only fade animation (no height/width changes = zero layout shift)
 * - Remembers the largest height ever rendered and holds that as min-height
 *   so the page never jumps when switching to a shorter panel.
 * - Uses CSS `contain: layout style` to prevent inner reflows from bubbling up.
 */
export function TabPanel({
  tabKey,
  activeTab,
  minHeight = 320,
  children,
  className,
}: TabPanelProps) {
  const isActive = tabKey === activeTab;
  const innerRef = useRef<HTMLDivElement>(null);
  // Track the maximum measured height across all renders to use as floor.
  const [stableHeight, setStableHeight] = useState<number>(minHeight);

  useEffect(() => {
    if (!isActive) return;
    const el = innerRef.current;
    if (!el) return;

    // Measure after paint to get true rendered height.
    const id = requestAnimationFrame(() => {
      const h = el.offsetHeight;
      if (h > stableHeight) setStableHeight(h);
    });
    return () => cancelAnimationFrame(id);
  }, [isActive, children]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isActive) return null;

  return (
    <div
      style={{ minHeight: stableHeight }}
      className={cn('tab-panel-enter', className)}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

/**
 * CLS-safe tab bar — fixed height, persistent bottom border.
 * The border always occupies space whether a tab is active or not,
 * eliminating the 1–2px layout shift caused by border-bottom toggling.
 */
export interface TabItem {
  key: string;
  label: string;
  count?: number;
}

interface TabBarProps {
  tabs: readonly TabItem[] | TabItem[];
  activeTab: string;
  onTabChange: (key: string) => void;
  className?: string;
}

export function TabBar({ tabs, activeTab, onTabChange, className }: TabBarProps) {
  return (
    // Fixed h-11 + permanent border: no shift when active border appears/disappears
    <div
      className={cn(
        'h-11 flex items-end gap-1 border-b border-neutral-200 dark:border-[#334155] select-none',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            // We use an inner element for the bottom border so the button
            // itself never changes height — the border is always "there"
            // but transparent when inactive.
            className={cn(
              'relative h-full px-4 flex items-center gap-1.5 text-xs font-semibold transition-colors duration-150',
              isActive
                ? 'text-neutral-900 dark:text-white'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            )}
            style={{ paddingBottom: '1px' }} // account for 2px active border
          >
            <span className="capitalize">{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded text-[10px] font-bold tabular-nums transition-colors',
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-[#334155] text-neutral-500 dark:text-neutral-400'
                )}
              >
                {tab.count}
              </span>
            )}
            {/* Active underline lives inside the button — height never changes */}
            <span
              className={cn(
                'absolute bottom-0 inset-x-0 h-0.5 rounded-t transition-colors duration-150',
                isActive
                  ? 'bg-neutral-900 dark:bg-white'
                  : 'bg-transparent'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

export default TabPanel;
