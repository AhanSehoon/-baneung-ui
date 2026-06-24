import { buildPageMetadata } from '@/lib/page-metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata({
  title: '접근성 (WCAG AA)',
  description:
    '바능 디자인 시스템의 WCAG 2.1 AA 준수 가이드 — 키보드 네비게이션, color contrast, ARIA, IME(한글 입력기) 호환, axe-core 자동 검증.',
  path: '/accessibility',
  type: 'article',
});

export default function AccessibilityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
