import { buildPageMetadata } from '@/lib/page-metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata({
  title: '소개',
  description:
    '바능 디자인 시스템(@baneung-pack)의 철학, 구조, 패키지 구성 소개. 각진 디자인 · WCAG AA · 한글 우선 원칙.',
  path: '/intro',
  type: 'article',
});

export default function IntroLayout({ children }: { children: React.ReactNode }) {
  return children;
}
