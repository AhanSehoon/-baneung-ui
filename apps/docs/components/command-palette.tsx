'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';

import { Command, Dialog, DialogContent, DialogDescription, DialogTitle } from '@baneung-pack/ui';

import { componentMetadata } from '@/lib/components-metadata';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * 주요 페이지 목록 — siteRoutes의 핵심 페이지를 미러링.
 * 이펙트/그리드/차트 등 서브페이지는 너무 많아 componentMetadata와 별도 그룹으로 표시.
 */
const pageItems: { href: string; label: string }[] = [
  { href: '/', label: '홈' },
  { href: '/intro', label: '소개' },
  { href: '/install', label: '설치 가이드' },
  { href: '/components', label: '컴포넌트 카탈로그' },
  { href: '/tokens', label: '디자인 토큰' },
  { href: '/accessibility', label: '접근성' },
  { href: '/versions', label: '버전·체인지로그' },
];

/**
 * CommandPalette — ⌘K로 열리는 전역 검색 + 네비.
 *
 * 페이지: 주요 라우트.
 * 컴포넌트: componentMetadata에서 자동 — 추가/제거 시 즉시 반영.
 */
export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  const handleSelect = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0">
        <DialogTitle className="sr-only">명령 팔레트</DialogTitle>
        <DialogDescription className="sr-only">검색하거나 페이지/컴포넌트로 이동</DialogDescription>
        <Command label="명령 팔레트">
          <Command.Input placeholder="명령 또는 페이지 검색…" />
          <Command.List>
            <Command.Empty>결과 없음</Command.Empty>
            <Command.Group heading="페이지">
              {pageItems.map((item) => (
                <Command.Item
                  key={item.href}
                  value={item.href}
                  keywords={[item.label]}
                  onSelect={() => handleSelect(item.href)}
                >
                  {item.label}
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Separator />
            <Command.Group heading="컴포넌트">
              {componentMetadata.map((c) => {
                const href = `/components/${c.slug}`;
                return (
                  <Command.Item
                    key={c.slug}
                    value={href}
                    // 검색 매칭: 제목 / 슬러그 / 카테고리 모두 키워드로
                    keywords={[c.title, c.slug, c.category, c.description]}
                    onSelect={() => handleSelect(href)}
                  >
                    <span className="flex w-full items-center justify-between gap-2">
                      <span>{c.title}</span>
                      <span className="text-xs text-foreground-subtle">{c.category}</span>
                    </span>
                  </Command.Item>
                );
              })}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
