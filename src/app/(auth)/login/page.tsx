'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  KeyRound,
  ShieldCheck,
  TrendingUp,
  FolderKanban,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import axios from 'axios';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('manum66466@gmail.com');
  const [password, setPassword] = useState('Manumanoj$14');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post('/api/auth/login', {
        email: email.trim(),
        password: password.trim(),
      });

      if (response.data.success) {
        // Force full refresh to activate cookies & session
        window.location.href = callbackUrl;
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
      {/* Left Column: Executive Branding & Feature Showcase */}
      <div className="lg:col-span-7 space-y-6 hidden lg:block pr-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200/60 dark:bg-[#1E293B] border border-neutral-300 dark:border-[#334155] text-xs font-bold text-neutral-800 dark:text-neutral-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Agency Operations & Financial Control Hub</span>
        </div>

        <div className="space-y-3">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
            Seamless Project Velocity & Cash Flow Ledger
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
            Centralized operations engine built for M.Div Softsolutions. Track client lifecycles, project milestones, automated invoicing, and role-based workspace permissions.
          </p>
        </div>

        {/* 3 Executive Feature Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          <div className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-md bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
              INR Financials
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
              Settled revenues, pending payouts & partial collections.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-md bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white flex items-center justify-center font-bold">
              <FolderKanban className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
              Milestones & Tasks
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
              Phase-based deliverables with Kanban task execution.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-md bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
              Dual-Token RBAC
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
              Secure HTTP-only Access & Refresh token rotation.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Sign In Card */}
      <div className="lg:col-span-5 w-full">
        <div className="p-6 sm:p-8 rounded-xl bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-md space-y-6">
          {/* Form Header */}
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white text-xs font-bold mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Super Admin Portal</span>
            </div>
            <h2 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Sign in to Workspace
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Enter your credentials to access your control desk.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@agency.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 active:scale-[0.98] font-bold text-xs shadow-md transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Control Desk</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Notice */}
          <div className="pt-3 border-t border-neutral-200 dark:border-[#334155] flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500">
            <span>Pre-configured Super Admin</span>
            <span className="font-mono font-bold text-neutral-700 dark:text-neutral-300">Manu .M</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-neutral-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-neutral-500" />
          <span>Loading Control Desk Portal...</span>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
