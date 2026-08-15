import React from 'react';
import Link from 'next/link';
import { Layers, ShieldCheck, Server } from 'lucide-react';
import { ThemeToggle } from '@/components/common/theme-toggle';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] dark:bg-[#0F172A] text-neutral-900 dark:text-neutral-100 antialiased font-sans selection:bg-neutral-900 dark:selection:bg-white selection:text-white dark:selection:text-neutral-900">
      {/* Top Header */}
      <header className="h-16 px-6 sm:px-12 flex items-center justify-between border-b border-neutral-200 dark:border-[#334155] bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-md sticky top-0 z-30">
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
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-[#334155] border border-neutral-200 dark:border-[#334155] text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Operational</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 w-full max-w-6xl mx-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 text-center text-xs text-neutral-400 dark:text-neutral-500 border-t border-neutral-200 dark:border-[#334155] bg-white/40 dark:bg-[#1E293B]/40 flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto w-full gap-2">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-neutral-500" />
          <span>AES-256 JWT Authentication & Dual Token Security</span>
        </div>
        <div className="flex items-center gap-2">
          <span>M.Div Softsolutions &copy; {new Date().getFullYear()}</span>
          <span>•</span>
          <span className="font-mono">v1.2.0</span>
        </div>
      </footer>
    </div>
  );
}
