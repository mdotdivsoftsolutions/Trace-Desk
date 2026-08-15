import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#F8FAFC] dark:bg-[#0F172A] text-neutral-900 dark:text-neutral-100 antialiased font-sans selection:bg-neutral-900 dark:selection:bg-white selection:text-white dark:selection:text-neutral-900">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 w-full max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
}
