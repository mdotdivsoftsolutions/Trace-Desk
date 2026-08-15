import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 antialiased font-sans">
      <main className="flex-1 flex w-full">
        {children}
      </main>
    </div>
  );
}
