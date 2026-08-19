'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string; error?: string } } };
      setError(apiError.response?.data?.message || apiError.response?.data?.error || 'Failed to request reset token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-white">
      {/* Left Panel - Dark Theme */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between items-center py-12 px-8 relative bg-gradient-to-b from-neutral-900 to-black text-white overflow-hidden">
        
        {/* Wavy Cloud SVG overlay on the right edge */}
        <div className="absolute top-0 bottom-0 right-0 w-32 flex flex-col justify-center z-20 pointer-events-none">
          <svg viewBox="0 0 100 1000" preserveAspectRatio="none" className="h-full w-full fill-white">
            <path d="M100,0 L100,1000 L90,1000 C60,950 40,900 60,850 C20,800 20,700 60,650 C10,550 10,450 60,350 C30,250 40,150 70,100 C50,50 70,0 100,0 Z" />
            <path d="M100,0 L100,1000 L95,1000 C65,950 45,900 65,850 C25,800 25,700 65,650 C15,550 15,450 65,350 C35,250 45,150 75,100 C55,50 75,0 100,0 Z" className="fill-white/40" />
            <path d="M100,0 L100,1000 L100,1000 C70,950 50,900 70,850 C30,800 30,700 70,650 C20,550 20,450 70,350 C40,250 50,150 80,100 C60,50 80,0 100,0 Z" className="fill-white/10" />
          </svg>
        </div>

        {/* Top spacing */}
        <div></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-sm mr-8">
          <h1 className="text-xl lg:text-2xl font-light text-white/90 mb-8">
            Welcome to
          </h1>
          
          <div className="w-24 h-24 bg-white rounded-2xl p-2.5 flex items-center justify-center mb-6 shadow-xl overflow-hidden border border-neutral-200/20">
            <Image
              src="/logo.png"
              alt="M.Div Softsolutions Logo"
              width={80}
              height={80}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8 tracking-tight">
            M.Div Softsolutions
          </h2>
          
          <p className="text-white/60 leading-relaxed text-sm">
            Internal Administrator Portal for Access Management. Please enter your credentials to access the specialized management tools.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-[10px] text-white/40 font-medium uppercase tracking-widest flex gap-4 mr-8">
          <span>Creator M.Div</span>
          <span className="opacity-50">|</span>
          <span>Designer AI</span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center bg-white p-8 sm:p-12 lg:p-24 relative z-10">
        <div className="w-full max-w-md">
          
          <h2 className="text-3xl font-bold text-neutral-800 mb-2 tracking-tight text-center">Password Recovery</h2>
          <p className="text-sm text-neutral-500 mb-10 text-center">Enter your registered agency email to receive a recovery token.</p>

          {isSuccess ? (
            <div className="p-5 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 space-y-3">
              <div className="flex items-center gap-2 font-bold text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
                <span>Token Generated</span>
              </div>
              <p className="leading-relaxed">Password recovery token has been processed. Please check your email or server logs to continue.</p>
              <div className="pt-4 flex items-center gap-4">
                <Link href="/reset-password" className="w-48 py-3 rounded-full bg-black hover:bg-neutral-800 text-white active:scale-[0.99] text-sm font-semibold transition-all flex justify-center items-center">
                  Reset Password Screen
                </Link>
                <Link href="/login" className="w-40 py-3 rounded-full border-2 border-neutral-200 text-neutral-600 hover:border-black hover:text-black active:scale-[0.99] text-sm font-semibold transition-all flex justify-center items-center">
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-3 text-sm text-rose-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-6">
                <div className="relative flex flex-col">
                  <label className="text-sm font-bold text-neutral-800 mb-1">E-mail Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full py-2 bg-transparent border-b-2 border-neutral-200 focus:border-black transition-colors text-base text-neutral-800 outline-none placeholder:text-neutral-300 rounded-none"
                  />
                </div>
              </div>

              <div className="pt-6 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-48 py-3 rounded-full bg-black hover:bg-neutral-800 text-white active:scale-[0.99] text-sm font-semibold transition-all shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Request Recovery Link</span>
                </button>
                
                <Link 
                  href="/login" 
                  tabIndex={-1} 
                  className="w-40 py-3 rounded-full border-2 border-neutral-200 text-neutral-600 hover:border-black hover:text-black active:scale-[0.99] text-sm font-semibold transition-all flex justify-center items-center"
                >
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-5 text-xs text-neutral-400">
          <span>© 2026 M.Div Softsolutions. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
}
