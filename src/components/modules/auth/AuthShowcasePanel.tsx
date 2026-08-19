import React from 'react';
import Image from 'next/image';
import { ShieldCheck, CheckCircle2, TrendingUp, Zap } from 'lucide-react';

export function AuthShowcasePanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between p-10 rounded-2xl bg-neutral-900 dark:bg-[#1E293B] text-white border border-neutral-800 dark:border-[#334155] shadow-2xl relative overflow-hidden">
      <div className="space-y-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center font-bold shadow-md overflow-hidden">
            <Image
              src="/logo.png"
              alt="M.Div Softsolutions"
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="font-heading font-extrabold text-base tracking-tight block">M.Div Softsolutions</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Trace Desk Hub</span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-black tracking-tight leading-tight">
            Single-Pane Agency Velocity & Ledger Control
          </h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Real-time project health telemetry, milestone payouts, and credential management.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {[
            { title: 'Milestone Progress Tracker', desc: 'Auto-calculated completion percentage with status states.' },
            { title: 'Tax & INR Financial Engine', desc: 'Multi-line invoice generation with GST computations.' },
            { title: 'Hardened Dual-Token Security', desc: '15-minute access token + 7-day refresh token rotation.' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-neutral-800/60 dark:bg-[#0F172A]/80 border border-neutral-700/50 dark:border-[#334155]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-neutral-200">{item.title}</div>
                <div className="text-[11px] text-neutral-400">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-neutral-800 dark:border-[#334155] flex items-center justify-between text-[11px] text-neutral-400 relative z-10">
        <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Enterprise RBAC Ready</span>
        <span>v2.4.0 High-Yield</span>
      </div>
    </div>
  );
}

export default AuthShowcasePanel;
