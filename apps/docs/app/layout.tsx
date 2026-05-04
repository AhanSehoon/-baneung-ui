import { SiteShell } from '@/components/site-shell';
import { ThemeProvider } from '@/components/theme-provider';

import type { Metadata } from 'next';

import '@baneung-pack/ui/styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: '@baneung-pack/ui — 바능 디자인 시스템',
  description: '바능 브랜드 가이드라인을 따르는 React 디자인 시스템.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="bg-canvas text-foreground antialiased">
        <ThemeProvider>
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
