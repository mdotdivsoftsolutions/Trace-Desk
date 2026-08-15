import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ConfirmDialogProvider } from '@/hooks/useConfirmDialog';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'M.Div Softsolutions Hub - Agency & Freelancer Operating System',
  description: 'Single-tenant Client CRM, Project Milestones, Kanban Task Pipeline & Financial Ledger',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-[#F8FAFC] text-slate-900 dark:bg-[#0B0F19] dark:text-slate-100 font-sans antialiased selection:bg-indigo-600 selection:text-white"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <ConfirmDialogProvider>
              {children}
            </ConfirmDialogProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
