'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { Badge, Button, Heading, Item, Kbd, Muted, Separator, cn } from '@baneung-pack/ui';

import { CommandPalette } from '@/components/command-palette';
import { useTheme } from '@/components/theme-provider';

interface NavItem {
  /** 페이지 link. 없으면 toggle-only(자식 메뉴 펼침/접힘 버튼)로 동작. */
  href?: string;
  label: string;
  /** 옵션 — 이 항목 아래 들여쓰기로 표시할 하위 메뉴. */
  children?: { href: string; label: string }[];
}

const navSections: { label: string; items: NavItem[] }[] = [
  {
    label: '시작하기',
    items: [
      { href: '/', label: '소개' },
      { href: '/install', label: 'Install' },
      { href: '/tokens', label: '디자인 토큰' },
      { href: '/components', label: '컴포넌트' },
    ],
  },
  {
    label: '패키지',
    items: [
      {
        // href 없음 → toggle-only. 클릭 시 자식 메뉴 펼침/접힘.
        label: 'Grid (@baneung-pack/grid)',
        children: [
          { href: '/grid/install', label: 'Install' },
          { href: '/grid/props', label: 'Props' },
          { href: '/grid/basic', label: '기본 사용' },
          { href: '/grid/custom-renderer', label: '커스텀 렌더러' },
          { href: '/grid/virtualized', label: '가상화 모드' },
          { href: '/grid/pagination', label: '내장 페이지네이션' },
          { href: '/grid/external-pagination', label: '외부 페이지네이션' },
          { href: '/grid/editing', label: '인라인 편집 · 선택 · ref API' },
          { href: '/grid/tree', label: 'Tree (계층) 모드' },
          { href: '/grid/editors-sort-filter', label: '빌트인 에디터 · 정렬 · 필터' },
          { href: '/grid/row-operations', label: '행 추가 · 삭제 · 다중 셀 선택' },
        ],
      },
    ],
  },
  {
    label: '가이드',
    items: [{ href: '/accessibility', label: '접근성' }],
  },
];

/** 현재 path 기준 — 자식 중 하나가 활성인 parent label 집합. */
function autoExpandedLabels(pathname: string): Set<string> {
  const set = new Set<string>();
  for (const section of navSections) {
    for (const item of section.items) {
      if (item.children?.some((c) => pathname === c.href)) set.add(item.label);
    }
  }
  return set;
}

/**
 * SiteShell — 데모 사이트의 공통 레이아웃 (좌 sidebar + 우 메인 + 상단 헤더).
 *
 * # Nested menu 동작
 * - 자식 메뉴 있는 항목은 두 가지 모드:
 *   - href 있음: 클릭 시 페이지 이동 + 자동 펼침
 *   - href 없음(toggle-only): 클릭 시 펼침/접힘 토글만
 * - 자식 경로로 직접 진입하면 그 부모는 자동으로 펼침 상태가 됨.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  // 사용자 수동 토글 + 자동 펼침을 통합한 expanded label 집합.
  const [expandedLabels, setExpandedLabels] = React.useState<Set<string>>(() =>
    autoExpandedLabels(pathname),
  );

  // 라우트 변경 시 — 자식 경로로 이동했으면 그 부모를 자동 펼침에 추가.
  // 단, 사용자가 명시적으로 접은 다른 메뉴는 건드리지 않음.
  React.useEffect(() => {
    const auto = autoExpandedLabels(pathname);
    if (auto.size === 0) return;
    setExpandedLabels((prev) => {
      let changed = false;
      const next = new Set(prev);
      auto.forEach((l) => {
        if (!next.has(l)) {
          next.add(l);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [pathname]);

  const toggleLabel = React.useCallback((label: string) => {
    setExpandedLabels((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  // ⌘K (or Ctrl+K) 단축키
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="flex min-h-screen w-full">
      {/* 좌측 Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border-default md:flex md:flex-col">
        <div className="flex h-14 items-center gap-2 border-b border-border-default px-4">
          <Heading level={6} className="text-base">
            @baneung-pack/ui
          </Heading>
          <Badge variant="secondary" className="text-[10px]">
            v0.0.0
          </Badge>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {navSections.map((section) => (
            <div key={section.label} className="mb-4">
              <Muted className="px-3 text-xs uppercase tracking-wide">{section.label}</Muted>
              <ul className="mt-1 flex flex-col">
                {section.items.map((item) => {
                  const isLink = !!item.href;
                  const isActive = isLink && pathname === item.href;
                  const isExpanded = item.children ? expandedLabels.has(item.label) : false;
                  const showChildren = item.children && isExpanded;

                  return (
                    <li key={item.label}>
                      {isLink ? (
                        <Item asChild selected={isActive} className="px-3">
                          <Link href={item.href!}>{item.label}</Link>
                        </Item>
                      ) : (
                        // toggle-only: 자식 메뉴 펼침/접힘 버튼
                        <Item asChild className="px-3">
                          <button
                            type="button"
                            aria-expanded={isExpanded}
                            onClick={() => toggleLabel(item.label)}
                            className="flex w-full items-center justify-between"
                          >
                            <span>{item.label}</span>
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 16 16"
                              className={cn(
                                'h-4 w-4 shrink-0 text-foreground-muted transition-transform duration-fast ease-standard',
                                isExpanded && 'rotate-90',
                              )}
                              fill="currentColor"
                            >
                              <path d="M6 4l4 4-4 4V4z" />
                            </svg>
                          </button>
                        </Item>
                      )}
                      {showChildren && (
                        <ul className="ml-4 mt-1 flex flex-col border-l border-border-subtle">
                          {item.children!.map((child) => {
                            const childIsActive = pathname === child.href;
                            return (
                              <li key={child.href}>
                                <Item asChild selected={childIsActive} className="px-3 text-xs">
                                  <Link href={child.href}>{child.label}</Link>
                                </Item>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* 메인 영역 */}
      <div className="flex flex-1 flex-col">
        <header
          className={cn(
            'sticky top-0 z-30 flex h-14 items-center justify-between gap-4 px-4 md:px-6',
            'border-b border-border-default bg-canvas/80 backdrop-blur',
          )}
        >
          <div className="flex items-center gap-3">
            <span className="md:hidden">
              <Heading level={6} className="text-base">
                @baneung-pack/ui
              </Heading>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className={cn(
                'inline-flex h-9 items-center gap-2 px-3 text-sm',
                'border border-border-default bg-canvas text-foreground-muted hover:text-foreground',
                'rounded-none transition-colors duration-fast ease-standard',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              )}
              aria-label="명령 팔레트 열기"
            >
              <span>검색</span>
              <Kbd>⌘ K</Kbd>
            </button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="sm" onClick={toggle} aria-label="테마 토글">
              {theme === 'dark' ? '☀' : '☾'}
            </Button>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
