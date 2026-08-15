import React from 'react';
import Link from 'next/link';
import { Layers, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/common/theme-toggle';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] dark:bg-[#0F172A] text-neutral-900 dark:text-neutral-100 antialiased font-sans selection:bg-neutral-900 dark:selection:bg-white selection:text-white dark:selection:text-neutral-900">
      {/* Top Simple Header */}
      <header className="h-16 px-6 sm:px-10 flex items-center justify-between border-b border-neutral-200 dark:border-[#334155] bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-sm tracking-tight text-neutral-900 dark:text-white">
              M.Div Softsolutions
            </span>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-400">
              Control Desk
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Centered Auth Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 text-center text-xs text-neutral-400 dark:text-neutral-500 border-t border-neutral-200 dark:border-[#334155] flex flex-col sm:flex-row items-center justify-center gap-2">
        <div className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-neutral-500" />
          <span>256-Bit Encrypted Session</span>
        </div>
        <span className="hidden sm:inline">•</span>
        <span>M.Div Softsolutions Agency OS &copy; {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
