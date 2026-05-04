'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { Badge, Button, Heading, Item, Kbd, Muted, Separator, cn } from '@baneung-pack/ui';

import { CommandPalette } from '@/components/command-palette';
import { useTheme } from '@/components/theme-provider';

const navSections = [
  {
    label: '시작하기',
    items: [
      { href: '/', label: '소개' },
      { href: '/tokens', label: '디자인 토큰' },
      { href: '/components', label: '컴포넌트' },
    ],
  },
  {
    label: '가이드',
    items: [{ href: '/accessibility', label: '접근성' }],
  },
];

/**
 * SiteShell — 데모 사이트의 공통 레이아웃 (좌 sidebar + 우 메인 + 상단 헤더).
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [paletteOpen, setPaletteOpen] = React.useState(false);

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
