'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ArrowLeft, KeyRound, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import apiClient from '@/lib/api-client';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialToken = searchParams.get('token') || '';

  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post('/api/auth/reset-password', { token, newPassword });
      setIsSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-xl space-y-6">
      <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
        <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Sign In</span>
      </Link>

      <div className="space-y-1.5">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Set New Password</h1>
        <p className="text-xs text-neutral-500">Enter your recovery token and new super admin password.</p>
      </div>

      {isSuccess ? (
        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-800 space-y-1">
          <div className="flex items-center gap-2 font-bold"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span>Password Updated</span></div>
          <p>Redirecting you to the sign-in screen...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 flex items-center gap-2"><AlertCircle className="w-4 h-4" /><span>{error}</span></div>}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold">Reset Token</label>
            <input type="text" required placeholder="Paste reset token here" value={token} onChange={(e) => setToken(e.target.value)} className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-mono" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold">New Password</label>
            <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold">Confirm Password</label>
            <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold shadow-md disabled:opacity-50">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            <span>Update Password</span>
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-500">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
