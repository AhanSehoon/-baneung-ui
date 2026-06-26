'use client';

import * as React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Direction,
  Item,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from '@baneung-pack/ui';

import type { ComponentSpec } from './_types';

export const layoutComponents: ComponentSpec[] = [
  {
    slug: 'card',
    title: 'Card',
    category: 'Layout',
    description: '콘텐츠 그루핑 컨테이너. variant: default/outlined/elevated.',
    importPath:
      "import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@baneung-pack/ui';",
    subpath: "import { Card } from '@baneung-pack/ui/card';",
    Example: () => (
      <Card variant="outlined" className="max-w-sm">
        <CardHeader>
          <CardTitle>월간 매출</CardTitle>
          <CardDescription>2026년 4월</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">₩12,450,000</p>
        </CardContent>
        <CardFooter>
          <button type="button" className="text-xs text-link">
            상세 보기 →
          </button>
        </CardFooter>
      </Card>
    ),
    code: `import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@baneung-pack/ui';

<Card variant="outlined">
  <CardHeader>
    <CardTitle>월간 매출</CardTitle>
    <CardDescription>2026년 4월</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-2xl font-semibold">₩12,450,000</p>
  </CardContent>
  <CardFooter>
    <a href="/sales">상세 보기 →</a>
  </CardFooter>
</Card>`,
    api: [
      {
        property: 'variant',
        description: '시각 변형',
        type: "'default' | 'outlined' | 'elevated'",
        default: "'default'",
      },
    ],
  },
  {
    slug: 'item',
    title: 'Item',
    category: 'Layout',
    description:
      '리스트 단일 항목. startSlot/endSlot, selected/disabled, asChild로 <a>/<button> 합성.',
    importPath: "import { Item } from '@baneung-pack/ui';",
    subpath: "import { Item } from '@baneung-pack/ui/item';",
    Example: () => (
      <ul className="border border-border-default" role="listbox" aria-label="목록">
        <Item startSlot="📄" endSlot="⌘ N">
          새 문서
        </Item>
        <Item startSlot="⚙" selected>
          설정
        </Item>
        <Item startSlot="🚪" disabled>
          로그아웃
        </Item>
      </ul>
    ),
    code: `import { Item } from '@baneung-pack/ui';

<ul role="listbox" aria-label="목록">
  <Item startSlot={<FileIcon />} endSlot="⌘ N">
    새 문서
  </Item>
  <Item startSlot={<SettingsIcon />} selected>
    설정
  </Item>
  <Item startSlot={<LogoutIcon />} disabled>
    로그아웃
  </Item>
</ul>

// 링크로 합성
<Item asChild>
  <a href="/profile">프로필</a>
</Item>`,
    api: [
      { property: 'startSlot', description: '좌측 슬롯 (asChild=true 시 무시)', type: 'ReactNode' },
      { property: 'endSlot', description: '우측 슬롯 (asChild=true 시 무시)', type: 'ReactNode' },
      {
        property: 'selected',
        description: '선택 상태 — data-state="selected"',
        type: 'boolean',
        default: 'false',
      },
      {
        property: 'disabled',
        description: '비활성 — data-disabled',
        type: 'boolean',
        default: 'false',
      },
      {
        property: 'asChild',
        description: 'Slot으로 합성 (예: <a>)',
        type: 'boolean',
        default: 'false',
      },
    ],
  },
  {
    slug: 'sidebar',
    title: 'Sidebar',
    category: 'Layout',
    description: '좌/우 collapsible 사이드 패널. controlled/uncontrolled, Trigger 자동 토글.',
    importPath:
      "import { Sidebar, SidebarHeader, SidebarContent, SidebarTrigger } from '@baneung-pack/ui';",
    subpath: "import { Sidebar } from '@baneung-pack/ui/sidebar';",
    Example: () => (
      <div className="flex h-48 border border-border-default">
        <Sidebar aria-label="네비" defaultCollapsed={false} width={180}>
          <SidebarHeader>
            <span className="text-sm font-medium">Menu</span>
            <SidebarTrigger />
          </SidebarHeader>
          <SidebarContent>
            <p className="text-xs text-foreground-muted">콘텐츠</p>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 p-4 text-sm text-foreground-muted">메인 영역</div>
      </div>
    ),
    code: `import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
} from '@baneung-pack/ui';

<div className="flex h-screen">
  <Sidebar aria-label="네비" defaultCollapsed={false} width={240}>
    <SidebarHeader>
      <span>Menu</span>
      <SidebarTrigger />
    </SidebarHeader>
    <SidebarContent>
      {/* nav 항목 */}
    </SidebarContent>
  </Sidebar>
  <main className="flex-1">{/* 메인 */}</main>
</div>`,
    api: [
      { property: 'side', description: '위치', type: "'left' | 'right'", default: "'left'" },
      { property: 'collapsed', description: 'controlled 접힘 상태', type: 'boolean' },
      {
        property: 'defaultCollapsed',
        description: 'uncontrolled 초기 상태',
        type: 'boolean',
        default: 'false',
      },
      {
        property: 'onCollapsedChange',
        description: '상태 변경 콜백',
        type: '(collapsed: boolean) => void',
      },
      { property: 'width', description: '펼친 너비(px)', type: 'number', default: '240' },
      { property: 'collapsedWidth', description: '접힌 너비(px)', type: 'number', default: '64' },
    ],
  },
  {
    slug: 'resizable',
    title: 'Resizable',
    category: 'Layout',
    description: 'react-resizable-panels 기반 분할 패널. 화살표 키로 리사이즈, splitter ARIA 패턴.',
    importPath:
      "import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@baneung-pack/ui';",
    subpath: "import { ResizablePanelGroup } from '@baneung-pack/ui/resizable';",
    Example: () => (
      <div className="h-56 w-full min-w-[480px] border border-border-default">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={40} minSize={20}>
            <div className="flex h-full items-center justify-center bg-surface text-sm text-foreground">
              왼쪽 패널
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60} minSize={20}>
            <div className="flex h-full items-center justify-center bg-canvas text-sm text-foreground">
              오른쪽 패널 — 핸들을 드래그해 크기를 조절하세요
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    ),
    code: `import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@baneung-pack/ui';

<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={40} minSize={20}>
    <div>왼쪽 패널</div>
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={60}>
    <div>오른쪽 패널</div>
  </ResizablePanel>
</ResizablePanelGroup>`,
    api: [
      {
        property: 'direction (PanelGroup)',
        description: '분할 방향',
        type: "'horizontal' | 'vertical'",
      },
      { property: 'defaultSize (Panel)', description: '초기 크기 (%)', type: 'number' },
      { property: 'minSize / maxSize (Panel)', description: '최소·최대 크기 (%)', type: 'number' },
      {
        property: 'withHandle (Handle)',
        description: '핸들 그립 표시',
        type: 'boolean',
        default: 'false',
      },
    ],
  },
  {
    slug: 'scroll-area',
    title: 'ScrollArea',
    category: 'Layout',
    description: 'Radix ScrollArea — navy 톤 커스텀 thumb. 네이티브 스크롤바 숨김.',
    importPath: "import { ScrollArea } from '@baneung-pack/ui';",
    subpath: "import { ScrollArea } from '@baneung-pack/ui/scroll-area';",
    Example: () => (
      <ScrollArea className="h-32 w-72 border border-border-default p-3">
        <ol className="flex flex-col gap-1 text-sm">
          {Array.from({ length: 30 }, (_, i) => (
            <li key={i}>{i + 1}. 항목 — 스크롤 콘텐츠 라인</li>
          ))}
        </ol>
      </ScrollArea>
    ),
    code: `import { ScrollArea } from '@baneung-pack/ui';

<ScrollArea className="h-72 w-full border border-border-default p-3">
  <ol>
    {items.map((item) => (
      <li key={item.id}>{item.text}</li>
    ))}
  </ol>
</ScrollArea>`,
    api: [{ property: 'children', description: 'Viewport 내부에 렌더', type: 'ReactNode' }],
  },
  {
    slug: 'direction',
    title: 'Direction',
    category: 'Layout',
    description: 'RTL/LTR 컨텍스트 프로바이더. Radix DirectionProvider 함수형 래퍼.',
    importPath: "import { Direction } from '@baneung-pack/ui';",
    subpath: "import { Direction } from '@baneung-pack/ui/direction';",
    Example: () => (
      <Direction dir="rtl">
        <div className="border border-border-default p-3 text-sm" dir="rtl">
          (RTL 컨텍스트 안의 자식 — Radix 컴포넌트는 자동 방향 전환)
        </div>
      </Direction>
    ),
    code: `import { Direction } from '@baneung-pack/ui';

// 앱 루트에 한 번 — 모든 Radix 컴포넌트의 방향이 자동 전환
<Direction dir="rtl">
  <App />
</Direction>`,
    api: [{ property: 'dir', description: '텍스트 방향', type: "'ltr' | 'rtl'" }],
  },
];
