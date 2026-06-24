import { buildPageMetadata } from '@/lib/page-metadata';

import type { Metadata } from 'next';

/**
 * /grid/* 섹션 기본 메타데이터.
 * 개별 페이지(basic/virtualized/excel 등)가 자체 metadata를 export하면 override.
 */
export const metadata: Metadata = buildPageMetadata({
  title: 'Grid — 데이터 그리드',
  description:
    '@baneung-pack/grid — 가상화 · Excel 내보내기 · 컬럼 고정 · Tree 모드 · 인라인 편집을 지원하는 React 데이터 그리드.',
  path: '/grid/basic',
});

export default function GridLayout({ children }: { children: React.ReactNode }) {
  return children;
}
