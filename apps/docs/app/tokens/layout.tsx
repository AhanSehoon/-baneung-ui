import { buildPageMetadata } from '@/lib/page-metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata({
  title: '디자인 토큰',
  description:
    '@baneung-pack/tokens — 컬러·타이포·스페이싱·라디우스·모션 토큰을 CSS 변수·TypeScript·JSON 세 가지로 제공하는 단일 진실 공급원(SSOT).',
  path: '/tokens',
  type: 'article',
});

export default function TokensLayout({ children }: { children: React.ReactNode }) {
  return children;
}
