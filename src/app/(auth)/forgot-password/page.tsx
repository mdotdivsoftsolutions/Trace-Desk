'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle2, KeyRound } from 'lucide-react';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('manum66466@gmail.com');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your account email address.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post('/api/auth/forgot-password', {
        email: email.trim(),
      });

      if (response.data.success) {
        setIsSuccess(true);
        if (response.data.data?.resetUrl) {
          setResetUrl(response.data.data.resetUrl);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to process password reset request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="p-6 sm:p-8 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155] flex items-center justify-center mx-auto shadow-sm">
            <KeyRound className="w-5 h-5" />
          </div>
          <h1 className="font-heading text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Reset Your Password
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
            Enter your email and we will generate a secure one-time password recovery link.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {isSuccess ? (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-lg bg-neutral-100 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155] text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-neutral-700 dark:text-neutral-300 mx-auto" />
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                Reset Link Ready
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                A password reset token has been generated for{' '}
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{email}</span>.
              </p>
            </div>

            {resetUrl && (
              <div className="space-y-2">
                <Link
                  href={resetUrl}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 font-bold text-xs shadow-sm transition-all"
                >
                  <span>Proceed to Reset Password →</span>
                </Link>
              </div>
            )}

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@agency.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 active:scale-[0.98] font-bold text-xs shadow-sm transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Link...</span>
                </>
              ) : (
                <span>Generate Reset Link</span>
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
