'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggingIn, loginError } = useAuth();
  const [email, setEmail] = useState('manum66466@gmail.com');
  const [password, setPassword] = useState('Password@1');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await login({ email, password, rememberMe });
      router.push('/');
    } catch (err) {
      const error = err as { response?: { data?: { error?: string; message?: string } }; message?: string };
      setFormError(error.response?.data?.error || error.response?.data?.message || error.message || 'Login failed. Please verify your credentials.');
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
          
          <h2 className="text-3xl font-bold text-neutral-800 mb-12 tracking-tight text-center">Sign in to your account</h2>

          {(formError || loginError) && (
            <div className="mb-8 p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-3 text-sm text-rose-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{formError || loginError?.message || 'Authentication failed.'}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
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

              <div className="relative flex flex-col">
                <label className="text-sm font-bold text-neutral-800 mb-1">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full py-2 bg-transparent border-b-2 border-neutral-200 focus:border-black transition-colors text-base text-neutral-800 outline-none placeholder:text-neutral-300 rounded-none pr-10"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-0 bottom-2 text-neutral-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer w-5 h-5 rounded border-2 border-neutral-300 appearance-none checked:bg-black checked:border-black transition-all cursor-pointer"
                  />
                  <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 10" fill="none">
                    <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-sm text-neutral-600 font-bold">By signing in, I agree with <Link href="#" className="text-black hover:underline">Terms & Conditions</Link></span>
              </label>
            </div>

            <div className="pt-6 flex items-center gap-4">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-40 py-3 rounded-full bg-black hover:bg-neutral-800 text-white active:scale-[0.99] text-sm font-semibold transition-all shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isLoggingIn && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isLoggingIn ? 'Signing in...' : 'Sign In'}</span>
              </button>
              
              <Link 
                href="/forgot-password" 
                tabIndex={-1} 
                className="w-40 py-3 rounded-full border-2 border-neutral-200 text-neutral-600 hover:border-black hover:text-black active:scale-[0.99] text-sm font-semibold transition-all flex justify-center items-center"
              >
                Forgot Password
              </Link>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="absolute bottom-5 text-xs text-neutral-400">
          <span>© 2026 M.Div Softsolutions. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
}
