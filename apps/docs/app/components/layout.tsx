import { buildPageMetadata } from '@/lib/page-metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata({
  title: '컴포넌트 카탈로그',
  description:
    '@baneung-pack/ui의 60+ React 컴포넌트 — Accordion · Button · Calendar · Carousel · Dialog · Select · Sheet · Tabs · Toast · Typography 등 전체 카탈로그와 라이브 프리뷰.',
  path: '/components',
});

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
