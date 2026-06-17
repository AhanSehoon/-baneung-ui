'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { Badge, Button, Heading, Item, Muted, Separator, cn } from '@baneung-pack/ui';

import { useTheme } from '@/components/theme-provider';

interface NavItem {
  href: string;
  label: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

/**
 * 좌측 사이드바 메뉴 구조.
 * docs-chart는 chart 한 패키지만 다루므로 docs(ui)보다 단순.
 */
const navSections: NavSection[] = [
  {
    label: '시작하기',
    items: [
      { href: '/', label: '소개' },
      { href: '/install', label: 'Install' },
    ],
  },
  {
    label: '차트',
    items: [{ href: '/charts/bar-chart-3d', label: 'BarChart3D' }],
  },
  {
    label: 'API',
    items: [
      { href: '/api/types', label: 'Types' },
      { href: '/api/scale', label: 'Scale 함수' },
    ],
  },
  {
    label: '가이드',
    items: [{ href: '/versions', label: 'Versions' }],
  },
];

/**
 * SiteShell — docs-chart 사이트의 공통 레이아웃.
 *
 * apps/docs의 SiteShell과 동일한 디자인 언어:
 * - 좌측 sidebar (md+ 표시) + 우측 메인
 * - 상단 sticky header (테마 토글)
 * - 활성 라우트는 Item.selected로 강조
 *
 * docs와 분리 운영하지만 디자인은 동일하게 유지해 두 사이트가
 * 같은 디자인 시스템의 결과물임을 즉시 인지 가능하게 함.
 */
export function SiteShell({ children }: { children: React.ReactNode }): React.ReactElement {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  return (
    <div className="flex min-h-screen w-full">
      {/* 좌측 Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border-default md:flex md:flex-col">
        <div className="flex h-14 items-center gap-2 border-b border-border-default px-4">
          <Heading level={6} className="text-base">
            @baneung-pack/chart
          </Heading>
          <Badge variant="secondary" className="text-[10px]">
            v0.1.0
          </Badge>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {navSections.map((section) => (
            <div key={section.label} className="mb-4">
              <Muted className="px-3 text-xs uppercase tracking-wide">{section.label}</Muted>
              <ul className="mt-1 flex flex-col">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Item asChild selected={isActive} className="px-3">
                        <Link href={item.href}>{item.label}</Link>
                      </Item>
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
                @baneung-pack/chart
              </Heading>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="sm" onClick={toggle} aria-label="테마 토글">
              {theme === 'dark' ? '☀' : '☾'}
            </Button>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
