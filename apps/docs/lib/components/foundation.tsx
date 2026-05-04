import * as React from 'react';

import {
  AspectRatio,
  Avatar,
  AvatarFallback,
  Badge,
  Code,
  Empty,
  EmptyActions,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
  Heading,
  Kbd,
  Label,
  Lead,
  Muted,
  Separator,
  Skeleton,
  Spinner,
  Text,
} from '@baneung-pack/ui';

import type { ComponentSpec } from './_types';

export const foundationComponents: ComponentSpec[] = [
  {
    slug: 'typography',
    title: 'Typography',
    category: 'Foundation',
    description:
      'Heading(h1~h6), Text, Lead, Muted, Code — 한·영 단일 폰트(Pretendard)의 시각 위계.',
    importPath: "import { Heading, Text, Lead, Muted, Code } from '@baneung-pack/ui';",
    subpath: "import { Heading } from '@baneung-pack/ui/typography';",
    Example: () => (
      <div className="flex flex-col gap-2">
        <Heading level={1}>제목 H1</Heading>
        <Heading level={3}>제목 H3</Heading>
        <Lead>도입부 큰 본문 텍스트.</Lead>
        <Text>
          본문 단락 텍스트입니다. <Code>cn()</Code> 같은 인라인 코드도 포함.
        </Text>
        <Muted>약한 보조 텍스트.</Muted>
      </div>
    ),
    code: `import { Heading, Text, Lead, Muted, Code } from '@baneung-pack/ui';

<div className="flex flex-col gap-2">
  <Heading level={1}>제목 H1</Heading>
  <Heading level={3}>제목 H3</Heading>
  <Lead>도입부 큰 본문 텍스트.</Lead>
  <Text>본문 단락 텍스트입니다. <Code>cn()</Code> 같은 인라인 코드도 포함.</Text>
  <Muted>약한 보조 텍스트.</Muted>
</div>`,
    api: [
      {
        property: 'level',
        description: 'Heading의 시맨틱·시각 레벨',
        type: '1 | 2 | 3 | 4 | 5 | 6',
        default: '1',
      },
      {
        property: 'asChild',
        description: 'Slot으로 합성 (Heading/Text)',
        type: 'boolean',
        default: 'false',
      },
      {
        property: 'size',
        description: 'Text 크기',
        type: "'xs' | 'sm' | 'base' | 'md' | 'lg'",
        default: "'base'",
      },
      {
        property: 'weight',
        description: 'Text 굵기',
        type: "'regular' | 'medium' | 'semibold' | 'bold'",
        default: "'regular'",
      },
      {
        property: 'tone',
        description: 'Text 색조',
        type: "'default' | 'muted' | 'subtle'",
        default: "'default'",
      },
    ],
  },
  {
    slug: 'separator',
    title: 'Separator',
    category: 'Foundation',
    description: 'Radix Separator 기반 가로/세로 구분선.',
    importPath: "import { Separator } from '@baneung-pack/ui';",
    subpath: "import { Separator } from '@baneung-pack/ui/separator';",
    Example: () => (
      <div className="flex w-full flex-col gap-3">
        <span>위</span>
        <Separator />
        <span>아래</span>
        <div className="flex h-10 items-center gap-3">
          <span>좌</span>
          <Separator orientation="vertical" />
          <span>우</span>
        </div>
      </div>
    ),
    code: `import { Separator } from '@baneung-pack/ui';

<>
  <span>위</span>
  <Separator />
  <span>아래</span>

  <div className="flex h-10 items-center gap-3">
    <span>좌</span>
    <Separator orientation="vertical" />
    <span>우</span>
  </div>
</>`,
    api: [
      {
        property: 'orientation',
        description: '방향',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
      },
      {
        property: 'decorative',
        description: '장식적 — true면 role="none" (스크린리더 무시)',
        type: 'boolean',
        default: 'false',
      },
    ],
  },
  {
    slug: 'aspect-ratio',
    title: 'AspectRatio',
    category: 'Foundation',
    description: '자식 요소를 지정한 비율로 고정. Radix Primitive 그대로 re-export.',
    importPath: "import { AspectRatio } from '@baneung-pack/ui';",
    subpath: "import { AspectRatio } from '@baneung-pack/ui/aspect-ratio';",
    Example: () => (
      <div className="w-full max-w-sm">
        <AspectRatio ratio={16 / 9}>
          <div className="flex size-full items-center justify-center bg-surface-strong text-sm text-foreground-muted">
            16:9
          </div>
        </AspectRatio>
      </div>
    ),
    code: `import { AspectRatio } from '@baneung-pack/ui';

<AspectRatio ratio={16 / 9}>
  <img src="/cover.jpg" alt="..." className="size-full object-cover" />
</AspectRatio>`,
    api: [
      {
        property: 'ratio',
        description: '너비/높이 비율 (예: 16/9 = 1.777...)',
        type: 'number',
        default: '1',
      },
    ],
  },
  {
    slug: 'skeleton',
    title: 'Skeleton',
    category: 'Foundation',
    description: '로딩 플레이스홀더. prefers-reduced-motion에서 펄스 애니메이션 즉시화.',
    importPath: "import { Skeleton } from '@baneung-pack/ui';",
    subpath: "import { Skeleton } from '@baneung-pack/ui/skeleton';",
    Example: () => (
      <div className="flex w-full flex-col gap-2" aria-busy="true" aria-live="polite">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    ),
    code: `import { Skeleton } from '@baneung-pack/ui';

<div aria-busy="true" aria-live="polite" className="flex flex-col gap-2">
  <Skeleton className="h-6 w-1/2" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-2/3" />
</div>`,
    api: [
      {
        property: 'className',
        description: 'Tailwind 사이즈/모양 지정 (h-*, w-*, rounded-*)',
        type: 'string',
      },
    ],
  },
  {
    slug: 'spinner',
    title: 'Spinner',
    category: 'Foundation',
    description: '회전 SVG 인디케이터. role="status" + sr-only 라벨 자동.',
    importPath: "import { Spinner } from '@baneung-pack/ui';",
    subpath: "import { Spinner } from '@baneung-pack/ui/spinner';",
    Example: () => (
      <div className="flex items-center gap-4">
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" label="저장 중" />
      </div>
    ),
    code: `import { Spinner } from '@baneung-pack/ui';

<>
  <Spinner size="sm" />
  <Spinner size="md" />
  <Spinner size="lg" label="저장 중" />
</>`,
    api: [
      { property: 'size', description: '크기', type: "'sm' | 'md' | 'lg'", default: "'md'" },
      { property: 'label', description: '스크린리더 라벨', type: 'string', default: "'로딩 중'" },
    ],
  },
  {
    slug: 'empty',
    title: 'Empty',
    category: 'Foundation',
    description: '빈 상태 컨테이너 — 아이콘/제목/설명/액션 슬롯 합성.',
    importPath:
      "import { Empty, EmptyIcon, EmptyTitle, EmptyDescription, EmptyActions } from '@baneung-pack/ui';",
    subpath: "import { Empty } from '@baneung-pack/ui/empty';",
    Example: () => (
      <Empty>
        <EmptyIcon>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-full">
            <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" strokeWidth="1.5" />
          </svg>
        </EmptyIcon>
        <EmptyTitle>주문 내역이 없습니다</EmptyTitle>
        <EmptyDescription>주문 후 여기서 내역을 확인하실 수 있습니다.</EmptyDescription>
        <EmptyActions>
          <button type="button" className="border border-border-default px-3 py-1.5 text-xs">
            홈으로
          </button>
        </EmptyActions>
      </Empty>
    ),
    code: `import {
  Empty,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  EmptyActions,
  Button,
} from '@baneung-pack/ui';

<Empty>
  <EmptyIcon><InboxIcon /></EmptyIcon>
  <EmptyTitle>주문 내역이 없습니다</EmptyTitle>
  <EmptyDescription>
    주문 후 여기서 내역을 확인하실 수 있습니다.
  </EmptyDescription>
  <EmptyActions>
    <Button>홈으로</Button>
  </EmptyActions>
</Empty>`,
    api: [
      {
        property: 'children',
        description: 'EmptyIcon / EmptyTitle / EmptyDescription / EmptyActions',
        type: 'ReactNode',
      },
    ],
  },
  {
    slug: 'avatar',
    title: 'Avatar',
    category: 'Foundation',
    description: '사용자 아바타. 이미지 로드 실패 시 자동으로 fallback 표시 (Radix).',
    importPath: "import { Avatar, AvatarImage, AvatarFallback } from '@baneung-pack/ui';",
    subpath: "import { Avatar } from '@baneung-pack/ui/avatar';",
    Example: () => (
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>홍</AvatarFallback>
        </Avatar>
        <Avatar className="size-12">
          <AvatarFallback>JS</AvatarFallback>
        </Avatar>
      </div>
    ),
    code: `import { Avatar, AvatarImage, AvatarFallback } from '@baneung-pack/ui';

<Avatar>
  <AvatarImage src="/me.jpg" alt="홍길동" />
  <AvatarFallback>홍</AvatarFallback>
</Avatar>`,
    api: [
      { property: 'src (AvatarImage)', description: '이미지 URL', type: 'string' },
      { property: 'alt (AvatarImage)', description: '대체 텍스트', type: 'string' },
      { property: 'children (AvatarFallback)', description: '이니셜/아이콘', type: 'ReactNode' },
    ],
  },
  {
    slug: 'badge',
    title: 'Badge',
    category: 'Foundation',
    description: '상태/카테고리/카운트를 표현하는 작은 라벨. 색만으로 의미 전달 금지.',
    importPath: "import { Badge } from '@baneung-pack/ui';",
    subpath: "import { Badge } from '@baneung-pack/ui/badge';",
    Example: () => (
      <div className="flex flex-wrap gap-2">
        <Badge>기본</Badge>
        <Badge variant="secondary">보조</Badge>
        <Badge variant="outline">아웃</Badge>
        <Badge variant="success">완료</Badge>
        <Badge variant="warning">경고</Badge>
        <Badge variant="danger">위험</Badge>
      </div>
    ),
    code: `import { Badge } from '@baneung-pack/ui';

<>
  <Badge>기본</Badge>
  <Badge variant="secondary">보조</Badge>
  <Badge variant="outline">아웃</Badge>
  <Badge variant="success">완료</Badge>
  <Badge variant="warning">경고</Badge>
  <Badge variant="danger">위험</Badge>
</>`,
    api: [
      {
        property: 'variant',
        description: '시각 변형',
        type: "'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger'",
        default: "'default'",
      },
    ],
  },
  {
    slug: 'kbd',
    title: 'Kbd',
    category: 'Foundation',
    description: '키보드 단축키 표시 — 시맨틱 <kbd> 사용으로 스크린리더가 인지.',
    importPath: "import { Kbd } from '@baneung-pack/ui';",
    subpath: "import { Kbd } from '@baneung-pack/ui/kbd';",
    Example: () => (
      <div className="flex items-center gap-2">
        <span className="text-sm">검색을 열려면</span>
        <Kbd>⌘</Kbd>
        <span className="text-sm">+</span>
        <Kbd>K</Kbd>
        <span className="text-sm">를 누르세요</span>
      </div>
    ),
    code: `import { Kbd } from '@baneung-pack/ui';

<span>
  검색을 열려면 <Kbd>⌘</Kbd> + <Kbd>K</Kbd>를 누르세요
</span>`,
    api: [{ property: 'children', description: '키 라벨', type: 'ReactNode' }],
  },
  {
    slug: 'label',
    title: 'Label',
    category: 'Foundation',
    description: '폼 컨트롤 라벨. htmlFor로 클릭 시 컨트롤 포커스 이전 (Radix).',
    importPath: "import { Label } from '@baneung-pack/ui';",
    subpath: "import { Label } from '@baneung-pack/ui/label';",
    Example: () => (
      <div className="flex flex-col gap-2">
        <Label htmlFor="demo-email">이메일</Label>
        <input
          id="demo-email"
          type="email"
          placeholder="user@example.com"
          className="h-10 border border-border-default px-3 text-sm"
        />
      </div>
    ),
    code: `import { Label, Input } from '@baneung-pack/ui';

<>
  <Label htmlFor="email">이메일</Label>
  <Input id="email" type="email" placeholder="user@example.com" />
</>`,
    api: [{ property: 'htmlFor', description: '연결할 컨트롤 id', type: 'string' }],
  },
];
