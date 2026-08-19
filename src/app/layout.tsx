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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: {
    default: 'M.Div Softsolutions - Agency & Freelancer Operating System',
    template: '%s | M.Div Softsolutions',
  },
  description: 'Single-tenant Client CRM, Project Milestones, Kanban Task Pipeline & Financial Ledger by M.Div Softsolutions',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/favicon/site.webmanifest',
  openGraph: {
    title: 'M.Div Softsolutions',
    description: 'Agency & Freelancer Operating System',
    images: [{ url: '/logo.png' }],
    siteName: 'M.Div Softsolutions',
  },
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
        className="min-h-full flex flex-col bg-[#F9FAFB] text-slate-900 dark:bg-[#111318] dark:text-slate-100 font-sans antialiased selection:bg-neutral-900 dark:selection:bg-white dark:selection:text-neutral-900 selection:text-white"
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
