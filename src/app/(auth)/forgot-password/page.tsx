'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import apiClient from '@/lib/api-client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post('/api/auth/forgot-password', { email });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to request reset token.');
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
        <h1 className="font-heading text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Password Recovery</h1>
        <p className="text-xs text-neutral-500">Enter your registered agency email to receive a recovery token.</p>
      </div>

      {isSuccess ? (
        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 space-y-2">
          <div className="flex items-center gap-2 font-bold"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span>Token Generated</span></div>
          <p>Password recovery token has been processed. Check server logs or continue to reset.</p>
          <Link href="/reset-password" className="inline-block pt-1 font-bold underline">Go to Reset Password Screen →</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 flex items-center gap-2"><AlertCircle className="w-4 h-4" /><span>{error}</span></div>}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white" />
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold shadow-md disabled:opacity-50">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Request Recovery Link</span>
          </button>
        </form>
      )}
    </div>
  );
}
