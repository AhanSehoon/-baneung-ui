import { buildPageMetadata } from '@/lib/page-metadata';

import type { Metadata } from 'next';

/**
 * /editor/* 섹션 기본 메타데이터.
 */
export const metadata: Metadata = buildPageMetadata({
  title: 'Editor — WYSIWYG 에디터',
  description:
    '@baneung-pack/editor — 0-dependency WYSIWYG 리치텍스트 에디터. 이미지 붙여넣기·드롭, 커스텀 툴바, 읽기 전용 모드, controlled/uncontrolled 모두 지원.',
  path: '/editor/basic',
});

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
