import { SiteShell } from '@/components/site-shell';
import { ThemeProvider } from '@/components/theme-provider';

import type { Metadata } from 'next';

// 라이브러리 styles.css를 먼저 → preflight·토큰·컴포넌트 utility를 @layer baneung에
// 등록. 그 다음 docs-chart globals.css → docs용 unlayered utility를 추가.
// chart styles.css도 같은 @layer baneung을 사용하므로 ui 다음에 import해 layer 머지.
import '@baneung-pack/ui/styles.css';
import '@baneung-pack/chart/styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: '@baneung-pack/chart — 바능 3D 차트 라이브러리',
  description: '데이터를 3D 비주얼 콘텐츠로 변환하는 React Three Fiber 기반 차트.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
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
