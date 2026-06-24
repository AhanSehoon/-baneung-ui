import { buildPageMetadata } from '@/lib/page-metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata({
  title: '설치 가이드',
  description:
    '@baneung-pack/ui · grid · chart · editor · tokens를 npm/pnpm으로 설치하고 첫 컴포넌트를 렌더링하는 단계별 가이드.',
  path: '/install',
  type: 'article',
});

export default function InstallLayout({ children }: { children: React.ReactNode }) {
  return children;
}
