'use client';

import * as React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@baneung-pack/ui';

import type { ComponentSpec } from './_types';

export const overlayComponents: ComponentSpec[] = [
  {
    slug: 'dialog',
    title: 'Dialog',
    category: 'Overlay',
    description:
      'Radix Dialog 모달. 백드롭 클릭/Esc 닫기, 포커스 트랩 + 트리거로 복귀, body 스크롤 lock.',
    importPath:
      "import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@baneung-pack/ui';",
    subpath: "import { Dialog } from '@baneung-pack/ui/dialog';",
    Example: () => (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">열기</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>변경사항을 저장할까요?</DialogTitle>
            <DialogDescription>
              저장하지 않은 변경사항이 있습니다. 계속 진행하면 잃게 됩니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">취소</Button>
            </DialogClose>
            <Button>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
    code: `import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Button,
} from '@baneung-pack/ui';

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">열기</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>변경사항을 저장할까요?</DialogTitle>
      <DialogDescription>
        저장하지 않은 변경사항이 있습니다.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="ghost">취소</Button>
      </DialogClose>
      <Button onClick={save}>저장</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
    api: [
      { property: 'open (Root)', description: 'controlled 열림 상태', type: 'boolean' },
      {
        property: 'defaultOpen (Root)',
        description: 'uncontrolled 초기 상태',
        type: 'boolean',
        default: 'false',
      },
      {
        property: 'onOpenChange (Root)',
        description: '상태 변경 콜백',
        type: '(open: boolean) => void',
      },
      {
        property: 'modal (Root)',
        description: '모달 모드 (기본 true)',
        type: 'boolean',
        default: 'true',
      },
    ],
  },
  {
    slug: 'alert-dialog',
    title: 'AlertDialog',
    category: 'Overlay',
    description: '파괴적 액션 확인용. role="alertdialog", 백드롭 클릭으로 닫히지 않음.',
    importPath:
      "import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@baneung-pack/ui';",
    subpath: "import { AlertDialog } from '@baneung-pack/ui/alert-dialog';",
    Example: () => (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">삭제</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription>이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="ghost">취소</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive">삭제</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
    code: `import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  Button,
} from '@baneung-pack/ui';

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">삭제</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>정말 삭제할까요?</AlertDialogTitle>
      <AlertDialogDescription>
        이 작업은 되돌릴 수 없습니다.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel asChild>
        <Button variant="ghost">취소</Button>
      </AlertDialogCancel>
      <AlertDialogAction asChild>
        <Button variant="destructive" onClick={handleDelete}>
          삭제
        </Button>
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
    api: [
      { property: 'open (Root)', description: 'controlled', type: 'boolean' },
      {
        property: 'onOpenChange (Root)',
        description: '변경 콜백',
        type: '(open: boolean) => void',
      },
    ],
  },
  {
    slug: 'drawer',
    title: 'Drawer',
    category: 'Overlay',
    description: 'vaul 기반 모바일 친화 시트. 드래그로 닫기, snap point 지원.',
    importPath:
      "import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@baneung-pack/ui';",
    subpath: "import { Drawer } from '@baneung-pack/ui/drawer';",
    Example: () => (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">아래에서 열기</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>설정</DrawerTitle>
            <DrawerDescription>알림과 테마를 조정하세요.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 text-sm text-foreground-muted">본문 영역</div>
          <DrawerFooter>
            <Button>저장</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    ),
    code: `import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  Button,
} from '@baneung-pack/ui';

<Drawer>
  <DrawerTrigger asChild>
    <Button variant="outline">열기</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>설정</DrawerTitle>
      <DrawerDescription>알림과 테마를 조정하세요.</DrawerDescription>
    </DrawerHeader>
    <div>본문</div>
    <DrawerFooter>
      <Button>저장</Button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`,
    api: [
      { property: 'open (Root)', description: 'controlled', type: 'boolean' },
      {
        property: 'onOpenChange (Root)',
        description: '변경 콜백',
        type: '(open: boolean) => void',
      },
      {
        property: 'shouldScaleBackground (Root)',
        description: '배경 살짝 축소 효과 (default true)',
        type: 'boolean',
      },
    ],
  },
  {
    slug: 'sheet',
    title: 'Sheet',
    category: 'Overlay',
    description: '화면 가장자리(상/하/좌/우)에서 슬라이드. Radix Dialog + side variant.',
    importPath:
      "import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@baneung-pack/ui';",
    subpath: "import { Sheet } from '@baneung-pack/ui/sheet';",
    Example: () => (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">우측 시트 열기</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>필터</SheetTitle>
            <SheetDescription>조건을 선택하세요.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    ),
    code: `import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Button,
} from '@baneung-pack/ui';

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">필터</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>필터</SheetTitle>
      <SheetDescription>조건을 선택하세요.</SheetDescription>
    </SheetHeader>
    {/* 폼 콘텐츠 */}
  </SheetContent>
</Sheet>`,
    api: [
      {
        property: 'side (Content)',
        description: '슬라이드 위치',
        type: "'top' | 'right' | 'bottom' | 'left'",
        default: "'right'",
      },
    ],
  },
  {
    slug: 'popover',
    title: 'Popover',
    category: 'Overlay',
    description: 'Radix Popover 부유 패널. 트리거 클릭/포커스로 열기, Esc/외부 클릭으로 닫기.',
    importPath: "import { Popover, PopoverTrigger, PopoverContent } from '@baneung-pack/ui';",
    subpath: "import { Popover } from '@baneung-pack/ui/popover';",
    Example: () => (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">설정</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="text-sm">팝오버 본문 — 짧은 설정/안내 콘텐츠.</p>
        </PopoverContent>
      </Popover>
    ),
    code: `import { Popover, PopoverTrigger, PopoverContent, Button } from '@baneung-pack/ui';

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">설정</Button>
  </PopoverTrigger>
  <PopoverContent>
    {/* 짧은 설정/안내 */}
  </PopoverContent>
</Popover>`,
    api: [
      {
        property: 'open / defaultOpen / onOpenChange (Root)',
        description: '제어 props',
        type: 'see Radix Popover',
      },
      {
        property: 'align (Content)',
        description: '정렬',
        type: "'start' | 'center' | 'end'",
        default: "'center'",
      },
      {
        property: 'sideOffset (Content)',
        description: '트리거에서의 거리(px)',
        type: 'number',
        default: '4',
      },
    ],
  },
  {
    slug: 'hover-card',
    title: 'HoverCard',
    category: 'Overlay',
    description: '호버로 열리는 정보 카드 (프로필 미리보기 등). 모바일에선 동작 안 함.',
    importPath: "import { HoverCard, HoverCardTrigger, HoverCardContent } from '@baneung-pack/ui';",
    subpath: "import { HoverCard } from '@baneung-pack/ui/hover-card';",
    Example: () => (
      <HoverCard>
        <HoverCardTrigger asChild>
          <button type="button" className="text-link underline underline-offset-2">
            @baneung
          </button>
        </HoverCardTrigger>
        <HoverCardContent>
          <p className="text-sm font-medium">바능</p>
          <p className="text-xs text-foreground-muted">디자인 시스템 메인테이너</p>
        </HoverCardContent>
      </HoverCard>
    ),
    code: `import { HoverCard, HoverCardTrigger, HoverCardContent } from '@baneung-pack/ui';

<HoverCard>
  <HoverCardTrigger asChild>
    <a href="/u/baneung">@baneung</a>
  </HoverCardTrigger>
  <HoverCardContent>
    <p>바능</p>
    <p>디자인 시스템 메인테이너</p>
  </HoverCardContent>
</HoverCard>`,
    api: [
      {
        property: 'openDelay / closeDelay (Root)',
        description: '호버 진입/이탈 지연(ms)',
        type: 'number',
      },
      {
        property: 'open / onOpenChange (Root)',
        description: '제어 props',
        type: 'boolean / (open) => void',
      },
    ],
  },
  {
    slug: 'tooltip',
    title: 'Tooltip',
    category: 'Overlay',
    description:
      '짧은 안내 툴팁. 호버/포커스 시 표시. **모바일 미동작** — 정보 전달엔 Popover 권장.',
    importPath:
      "import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@baneung-pack/ui';",
    subpath: "import { Tooltip } from '@baneung-pack/ui/tooltip';",
    Example: () => (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">호버</Button>
          </TooltipTrigger>
          <TooltipContent>도움말 텍스트</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    code: `import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Button,
} from '@baneung-pack/ui';

// 앱 루트에 한 번
<TooltipProvider delayDuration={200}>
  {/* ... */}
</TooltipProvider>

// 어디서나
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline">호버</Button>
  </TooltipTrigger>
  <TooltipContent>도움말 텍스트</TooltipContent>
</Tooltip>`,
    api: [
      {
        property: 'delayDuration (Provider)',
        description: '호버 후 표시까지 지연(ms)',
        type: 'number',
        default: '700',
      },
      {
        property: 'sideOffset (Content)',
        description: '트리거 거리',
        type: 'number',
        default: '4',
      },
    ],
  },
  {
    slug: 'dropdown-menu',
    title: 'DropdownMenu',
    category: 'Overlay',
    description: 'Radix DropdownMenu. 서브메뉴, 체크박스/라디오 항목, 단축키 라벨 지원.',
    importPath:
      "import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from '@baneung-pack/ui';",
    subpath: "import { DropdownMenu } from '@baneung-pack/ui/dropdown-menu';",
    Example: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">메뉴</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>계정</DropdownMenuLabel>
          <DropdownMenuItem>프로필</DropdownMenuItem>
          <DropdownMenuItem>설정</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>로그아웃</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    code: `import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Button,
} from '@baneung-pack/ui';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">메뉴</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>계정</DropdownMenuLabel>
    <DropdownMenuItem onSelect={goToProfile}>프로필</DropdownMenuItem>
    <DropdownMenuItem onSelect={goToSettings}>설정</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onSelect={signOut}>로그아웃</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
    api: [
      {
        property: 'open / onOpenChange (Root)',
        description: '제어 props',
        type: 'boolean / (open) => void',
      },
      { property: 'side / align (Content)', description: '위치', type: 'see Radix' },
      { property: 'checked (CheckboxItem)', description: '체크 상태', type: 'boolean' },
      { property: 'value (RadioItem)', description: '라디오 값', type: 'string' },
    ],
  },
  {
    slug: 'context-menu',
    title: 'ContextMenu',
    category: 'Overlay',
    description: '우클릭(또는 long-press) 컨텍스트 메뉴.',
    importPath:
      "import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@baneung-pack/ui';",
    subpath: "import { ContextMenu } from '@baneung-pack/ui/context-menu';",
    Example: () => (
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="flex h-32 items-center justify-center border border-dashed border-border-default text-sm text-foreground-muted">
            우클릭하세요
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>복사</ContextMenuItem>
          <ContextMenuItem>붙여넣기</ContextMenuItem>
          <ContextMenuItem>삭제</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    ),
    code: `import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from '@baneung-pack/ui';

<ContextMenu>
  <ContextMenuTrigger>
    <div>우클릭 가능 영역</div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem onSelect={copy}>복사</ContextMenuItem>
    <ContextMenuItem onSelect={paste}>붙여넣기</ContextMenuItem>
    <ContextMenuItem onSelect={remove}>삭제</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
    api: [
      { property: 'children (Trigger)', description: '우클릭 영역 (래퍼 요소)', type: 'ReactNode' },
      {
        property: 'open / onOpenChange (Root)',
        description: '제어 props',
        type: 'boolean / (open) => void',
      },
    ],
  },
];
