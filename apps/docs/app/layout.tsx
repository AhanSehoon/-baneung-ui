import { GoogleTagManager } from '@next/third-parties/google';

import { I18nProvider } from '@/components/i18n-provider';
import { SiteShell } from '@/components/site-shell';
import { ThemeProvider } from '@/components/theme-provider';
import { siteConfig, siteJsonLd } from '@/lib/site';

import type { Metadata, Viewport } from 'next';

// 라이브러리 styles.css를 먼저 → preflight·토큰·컴포넌트 utility를 @layer baneung에
// 등록. 그 다음 docs globals.css → docs용 utility(unlayered)를 추가.
// CSS spec상 unlayered > layered이므로 docs의 .md\:flex 같은 반응형 utility가
// 라이브러리의 .hidden(layered)을 자연스럽게 override한다.
//
// grid styles.css도 같은 @layer baneung을 사용하므로 ui 다음에 import해 layer 머지.
import '@baneung-pack/ui/styles.css';
import '@baneung-pack/grid/styles.css';
import '@baneung-pack/editor/styles.css';
import '@baneung-pack/chart/styles.css';
import './globals.css';

/**
 * 사이트 전역 메타데이터.
 *
 * - `metadataBase`: 모든 상대 URL의 기준점. canonical/og/twitter URL이 절대화됨.
 * - `openGraph`/`twitter`: 카카오톡·슬랙·디스코드·트위터 등 링크 미리보기.
 * - `keywords`: 한/영 모두 — 한국어 검색 + 글로벌 npm 검색 양쪽 대응.
 * - `authors`/`creator`/`publisher`: GEO(AI 검색엔진) 가시성 향상.
 * - 페이지별 `metadata`가 있으면 root는 fallback으로 작동.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author, url: siteConfig.url }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  keywords: [
    '바능',
    '바능 디자인 시스템',
    'baneung',
    'baneung design system',
    'baneung-pack',
    'React 디자인 시스템',
    'React UI 라이브러리',
    'React component library',
    'design system',
    'design tokens',
    'WCAG 접근성',
    '웹접근성',
    'a11y',
    'Korean design system',
    '한글 UI',
    '판교',
    'Headless UI',
    'Radix UI',
    'Tailwind CSS',
    'TypeScript',
    'data grid',
    'rich text editor',
    'WYSIWYG',
    'chart library',
    'data visualization',
    '@baneung-pack/ui',
    '@baneung-pack/grid',
    '@baneung-pack/chart',
    '@baneung-pack/editor',
    '@baneung-pack/tokens',
  ],
  category: 'technology',
  alternates: {
    canonical: '/',
    languages: {
      ko: '/',
      en: '/',
      'x-default': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    alternateLocale: ['en_US'],
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.webmanifest',
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
  colorScheme: 'light dark',
};

/**
 * Google Tag Manager — `NEXT_PUBLIC_GTM_ID` 환경변수가 있으면 GTM 스크립트 주입.
 * GTM 컨테이너 안에서 GA·픽셀 등 모든 태그를 통합 관리.
 * 미지정(로컬 dev / 미설정 환경) 시 스킵 → 분석 트래픽이 없는 환경을 자연스럽게 차단.
 *
 * 설정 방법:
 *   - Vercel: Project Settings → Environment Variables → NEXT_PUBLIC_GTM_ID = GTM-XXXXXXX
 *   - 로컬: apps/docs/.env.local 에 NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
 */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}
      <head>
        {/* JSON-LD 구조화 데이터 — 일반 검색엔진(Google/Naver/Bing) +
            GEO(AI 검색엔진/ChatGPT Search/Perplexity)가 모두 활용.
            Organization + WebSite + SoftwareApplication 그래프를 단일 스크립트로 임베드. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body className="bg-canvas text-foreground antialiased">
        <ThemeProvider>
          <I18nProvider>
            <SiteShell>{children}</SiteShell>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
