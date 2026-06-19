import { GoogleAnalytics } from '@next/third-parties/google';

import { SiteShell } from '@/components/site-shell';
import { ThemeProvider } from '@/components/theme-provider';

import type { Metadata } from 'next';

// 라이브러리 styles.css를 먼저 → preflight·토큰·컴포넌트 utility를 @layer baneung에
// 등록. 그 다음 docs globals.css → docs용 utility(unlayered)를 추가.
// CSS spec상 unlayered > layered이므로 docs의 .md\:flex 같은 반응형 utility가
// 라이브러리의 .hidden(layered)을 자연스럽게 override한다.
//
// grid styles.css도 같은 @layer baneung을 사용하므로 ui 다음에 import해 layer 머지.
import '@baneung-pack/ui/styles.css';
import '@baneung-pack/grid/styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: '@baneung-pack/ui — 바능 디자인 시스템',
  description: '바능 브랜드 가이드라인을 따르는 React 디자인 시스템.',
};

/**
 * Google Analytics (GA4) — `NEXT_PUBLIC_GA_ID` 환경변수가 있으면 GA 스크립트 주입.
 * 미지정(로컬 dev / 미설정 환경) 시 스킵 → 분석 트래픽이 없는 환경을 자연스럽게 차단.
 *
 * 설정 방법:
 *   - Vercel: Project Settings → Environment Variables → NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX
 *   - 로컬: apps/docs/.env.local 에 NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="bg-canvas text-foreground antialiased">
        <ThemeProvider>
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  );
}
