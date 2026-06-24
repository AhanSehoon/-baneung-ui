import { buildPageMetadata } from '@/lib/page-metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata({
  title: '버전 · 체인지로그',
  description:
    '@baneung-pack 패키지들의 릴리스 히스토리. Changesets로 관리되는 semver 기반 버저닝.',
  path: '/versions',
  type: 'article',
});

export default function VersionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
