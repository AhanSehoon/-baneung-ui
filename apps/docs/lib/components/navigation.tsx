'use client';

import * as React from 'react';

import {
  Breadcrumb,
  BreadcrumbCurrent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Pagination,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@baneung-pack/ui';

import type { ComponentSpec } from './_types';

function PaginationExample() {
  // uncontrolled — defaultPage 미지정 시 1로 시작.
  return <Pagination total={1000} />;
}

export const navigationComponents: ComponentSpec[] = [
  {
    slug: 'tabs',
    title: 'Tabs',
    category: 'Navigation',
    description: 'Radix Tabs. orientation horizontal/vertical, ←→/↑↓ 키로 탭 이동.',
    importPath: "import { Tabs, TabsList, TabsTrigger, TabsContent } from '@baneung-pack/ui';",
    subpath: "import { Tabs } from '@baneung-pack/ui/tabs';",
    Example: () => (
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="details">상세</TabsTrigger>
          <TabsTrigger value="history">이력</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-4 text-sm text-foreground-muted">
          개요 탭의 본문 — 활성 탭 콘텐츠.
        </TabsContent>
        <TabsContent value="details" className="pt-4 text-sm text-foreground-muted">
          상세 탭 본문.
        </TabsContent>
        <TabsContent value="history" className="pt-4 text-sm text-foreground-muted">
          이력 탭 본문.
        </TabsContent>
      </Tabs>
    ),
    code: `import { Tabs, TabsList, TabsTrigger, TabsContent } from '@baneung-pack/ui';

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">개요</TabsTrigger>
    <TabsTrigger value="details">상세</TabsTrigger>
    <TabsTrigger value="history">이력</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">개요 본문</TabsContent>
  <TabsContent value="details">상세 본문</TabsContent>
  <TabsContent value="history">이력 본문</TabsContent>
</Tabs>`,
    api: [
      { property: 'value (Root)', description: 'controlled 활성 탭 value', type: 'string' },
      { property: 'defaultValue (Root)', description: 'uncontrolled 초기 value', type: 'string' },
      {
        property: 'onValueChange (Root)',
        description: '값 변경 콜백',
        type: '(value: string) => void',
      },
      {
        property: 'orientation (Root)',
        description: '방향',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
      },
      { property: 'value (Trigger/Content)', description: '탭 식별 값 (필수)', type: 'string' },
      { property: 'disabled (Trigger)', description: '비활성', type: 'boolean', default: 'false' },
    ],
  },
  {
    slug: 'breadcrumb',
    title: 'Breadcrumb',
    category: 'Navigation',
    description: '페이지 위계 네비. 마지막 항목은 BreadcrumbCurrent로 aria-current="page" 부여.',
    importPath:
      "import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbCurrent, BreadcrumbSeparator } from '@baneung-pack/ui';",
    subpath: "import { Breadcrumb } from '@baneung-pack/ui/breadcrumb';",
    Example: () => (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">홈</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">제품</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>›</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbCurrent>상세</BreadcrumbCurrent>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
    code: `import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbCurrent,
  BreadcrumbSeparator,
} from '@baneung-pack/ui';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">홈</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/products">제품</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator>›</BreadcrumbSeparator>
    <BreadcrumbItem>
      <BreadcrumbCurrent>상세</BreadcrumbCurrent>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`,
    api: [
      { property: 'href (Link)', description: '링크 URL', type: 'string' },
      {
        property: 'asChild (Link)',
        description: 'Slot으로 합성 (예: next/link)',
        type: 'boolean',
        default: 'false',
      },
      {
        property: 'children (Separator)',
        description: '커스텀 separator (기본 "/")',
        type: 'ReactNode',
      },
    ],
  },
  {
    slug: 'pagination',
    title: 'Pagination',
    category: 'Navigation',
    description:
      '1, 2, 3 … N 패턴 (current 좌우 siblings + 처음/끝). 모바일은 자동으로 "current/total" 단순 모드.',
    importPath: "import { Pagination } from '@baneung-pack/ui';",
    subpath: "import { Pagination } from '@baneung-pack/ui/pagination';",
    Example: PaginationExample,
    code: `import { Pagination } from '@baneung-pack/ui';

// uncontrolled — defaultPage 기본 1
<Pagination total={1000} />

// controlled
const [page, setPage] = useState(1);
<Pagination
  page={page}
  total={1000}
  onPageChange={setPage}
  siblings={1}
/>`,
    api: [
      { property: 'page', description: '현재 페이지 (1-based, controlled)', type: 'number' },
      {
        property: 'defaultPage',
        description: 'uncontrolled 초기 페이지',
        type: 'number',
        default: '1',
      },
      { property: 'total', description: '전체 페이지 수', type: 'number' },
      { property: 'onPageChange', description: '페이지 변경 콜백', type: '(page: number) => void' },
      {
        property: 'siblings',
        description: '현재 페이지 좌우 표시 수',
        type: 'number',
        default: '1',
      },
      {
        property: 'responsive',
        description: 'sm 미만에서 단순 모드 자동 전환',
        type: 'boolean',
        default: 'true',
      },
    ],
  },
  {
    slug: 'navigation-menu',
    title: 'NavigationMenu',
    category: 'Navigation',
    description: 'Radix NavigationMenu — 드롭다운 메뉴 + 단일 viewport 공유. ←→로 항목 이동.',
    importPath:
      "import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from '@baneung-pack/ui';",
    subpath: "import { NavigationMenu } from '@baneung-pack/ui/navigation-menu';",
    Example: () => (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>제품</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-64 gap-2 p-3 text-sm">
                <li>
                  <NavigationMenuLink href="/p1" className="block hover:underline">
                    제품 A
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink href="/p2" className="block hover:underline">
                    제품 B
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/about"
              className="inline-flex h-10 items-center px-3 text-sm hover:bg-surface"
            >
              소개
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    ),
    code: `import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@baneung-pack/ui';

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>제품</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul>
          <li><NavigationMenuLink href="/p1">제품 A</NavigationMenuLink></li>
          <li><NavigationMenuLink href="/p2">제품 B</NavigationMenuLink></li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="/about">소개</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`,
    api: [
      { property: 'value / defaultValue (Root)', description: '열린 메뉴', type: 'string' },
      {
        property: 'onValueChange (Root)',
        description: '변경 콜백',
        type: '(value: string) => void',
      },
      {
        property: 'orientation (Root)',
        description: '방향',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
      },
      { property: 'value (Item)', description: '항목 식별', type: 'string' },
    ],
  },
  {
    slug: 'menubar',
    title: 'Menubar',
    category: 'Navigation',
    description: '데스크톱 앱 가로 메뉴 (파일/편집/...). ←→로 메뉴 이동, ↓로 열기.',
    importPath:
      "import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarShortcut } from '@baneung-pack/ui';",
    subpath: "import { Menubar } from '@baneung-pack/ui/menubar';",
    Example: () => (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>파일</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              새 문서 <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              열기 <MenubarShortcut>⌘O</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              저장 <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>편집</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>실행 취소</MenubarItem>
            <MenubarItem>다시 실행</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    ),
    code: `import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
} from '@baneung-pack/ui';

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>파일</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        새 문서 <MenubarShortcut>⌘N</MenubarShortcut>
      </MenubarItem>
      <MenubarSeparator />
      <MenubarItem>
        저장 <MenubarShortcut>⌘S</MenubarShortcut>
      </MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>편집</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>실행 취소</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`,
    api: [
      {
        property: 'children',
        description: 'MenubarMenu / MenubarTrigger / MenubarContent / MenubarItem ...',
        type: 'ReactNode',
      },
      { property: 'value / defaultValue (Root)', description: '열린 메뉴', type: 'string' },
      {
        property: 'onValueChange (Root)',
        description: '변경 콜백',
        type: '(value: string) => void',
      },
    ],
  },
];
