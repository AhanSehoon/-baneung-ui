'use client';

import * as React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  AspectRatio,
  Avatar,
  AvatarFallback,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  Button,
  Calendar,
  Card,
  CardContent,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Empty,
  EmptyDescription,
  EmptyTitle,
  Heading,
  Input,
  InputOTP,
  Item,
  Kbd,
  Label,
  Muted,
  Pagination,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Separator,
  Skeleton,
  Slider,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsList,
  TabsTrigger,
  Text,
  Textarea,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
} from '@baneung-pack/ui';

/**
 * 컴포넌트 카드의 1-instance 프리뷰.
 *
 * 각 slug별로 가장 대표적인 형태 1개만 렌더 — 카드 상단에서 컴포넌트의 시각적 정체성을
 * 즉시 인지할 수 있게.
 *
 * 인터랙티브한 trigger(Dialog/Drawer/Sheet/Popover 등)는 닫힌 trigger 상태만 보여줌.
 * 카드 자체가 클릭 불가(pointer-events: none) 상태로 렌더되므로 안전.
 */
export const componentPreviews: Record<string, () => React.ReactElement> = {
  // ─── Foundation ─────────────────────────────────────────────────────────
  typography: () => <Heading level={2}>제목 Aa</Heading>,
  separator: () => (
    <div className="flex w-32 flex-col gap-2">
      <Separator />
    </div>
  ),
  'aspect-ratio': () => (
    <div className="w-20">
      <AspectRatio ratio={16 / 9}>
        <div className="size-full bg-surface-strong" />
      </AspectRatio>
    </div>
  ),
  skeleton: () => <Skeleton className="h-4 w-32" />,
  spinner: () => <Spinner />,
  empty: () => (
    <Empty className="scale-75">
      <EmptyTitle>비어있음</EmptyTitle>
      <EmptyDescription>표시할 항목이 없습니다.</EmptyDescription>
    </Empty>
  ),
  avatar: () => (
    <Avatar>
      <AvatarFallback>BN</AvatarFallback>
    </Avatar>
  ),
  badge: () => <Badge>NEW</Badge>,
  kbd: () => <Kbd>⌘ K</Kbd>,
  label: () => <Label>라벨</Label>,

  // ─── Buttons & Toggles ──────────────────────────────────────────────────
  button: () => <Button>버튼</Button>,
  'button-group': () => (
    <div className="inline-flex">
      <Button variant="outline" className="rounded-none">
        왼쪽
      </Button>
      <Button variant="outline" className="rounded-none border-l-0">
        가운데
      </Button>
      <Button variant="outline" className="rounded-none border-l-0">
        오른쪽
      </Button>
    </div>
  ),
  toggle: () => <Toggle defaultPressed>토글</Toggle>,
  'toggle-group': () => (
    <ToggleGroup type="single" defaultValue="b">
      <ToggleGroupItem value="a">A</ToggleGroupItem>
      <ToggleGroupItem value="b">B</ToggleGroupItem>
      <ToggleGroupItem value="c">C</ToggleGroupItem>
    </ToggleGroup>
  ),

  // ─── Inputs ─────────────────────────────────────────────────────────────
  input: () => <Input placeholder="입력하세요" className="w-40" />,
  'input-group': () => <Input placeholder="이메일" className="w-40" />,
  'input-otp': () => <InputOTP aria-label="OTP" length={4} />,
  textarea: () => <Textarea placeholder="여러 줄 입력" className="h-16 w-40" />,
  field: () => (
    <div className="flex flex-col gap-1">
      <Label>이름</Label>
      <Input placeholder="홍길동" className="w-40" />
    </div>
  ),
  checkbox: () => (
    <div className="flex items-center gap-2">
      <Checkbox defaultChecked />
      <Label>동의합니다</Label>
    </div>
  ),
  'radio-group': () => (
    <RadioGroup defaultValue="a">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="a" id="r-a" />
        <Label htmlFor="r-a">옵션 A</Label>
      </div>
    </RadioGroup>
  ),
  switch: () => <Switch defaultChecked />,
  slider: () => <Slider defaultValue={[40]} max={100} className="w-32" />,

  // ─── Selection ──────────────────────────────────────────────────────────
  select: () => (
    <Button variant="outline" className="w-40 justify-between">
      옵션 선택 <span className="opacity-60">▾</span>
    </Button>
  ),
  'native-select': () => (
    <select className="h-9 w-40 border border-border-default bg-canvas px-2 text-sm">
      <option>옵션 선택</option>
    </select>
  ),
  combobox: () => (
    <Button variant="outline" className="w-40 justify-between">
      검색·선택 <span className="opacity-60">▾</span>
    </Button>
  ),
  command: () => (
    <div className="w-44 border border-border-default bg-canvas">
      <div className="border-b border-border-default px-2 py-1 text-xs text-foreground-subtle">
        검색…
      </div>
      <div className="px-2 py-1 text-xs">결과 항목</div>
    </div>
  ),
  calendar: () => (
    <div className="origin-center scale-50">
      <Calendar events={[]} />
    </div>
  ),
  'date-picker': () => (
    <Button variant="outline" className="w-40 justify-start gap-2">
      <span className="opacity-60">📅</span>
      <span>날짜 선택</span>
    </Button>
  ),

  // ─── Layout ─────────────────────────────────────────────────────────────
  card: () => (
    <Card variant="outlined" className="w-44">
      <CardContent className="p-3 text-xs">카드 콘텐츠</CardContent>
    </Card>
  ),
  item: () => (
    <Item className="w-44">
      <Text size="sm">목록 항목</Text>
    </Item>
  ),
  sidebar: () => (
    <div className="flex w-44 border border-border-default bg-canvas">
      <div className="w-12 border-r border-border-default bg-surface" />
      <div className="flex-1 p-2 text-xs">메인</div>
    </div>
  ),
  resizable: () => (
    <div className="flex w-44 border border-border-default">
      <div className="flex-1 p-2 text-xs">왼쪽</div>
      <div className="w-1 bg-border-strong" />
      <div className="flex-1 p-2 text-xs">오른쪽</div>
    </div>
  ),
  'scroll-area': () => (
    <div className="h-16 w-40 overflow-y-auto border border-border-default p-2 text-xs">
      스크롤 가능한 콘텐츠가 여기에 표시됩니다. 영역을 넘어가면 스크롤바가 나타납니다.
    </div>
  ),
  direction: () => (
    <div className="flex items-center gap-2 text-xs text-foreground-muted">
      <span>LTR</span>
      <span>·</span>
      <span>RTL</span>
    </div>
  ),

  // ─── Navigation ─────────────────────────────────────────────────────────
  tabs: () => (
    <Tabs defaultValue="a">
      <TabsList>
        <TabsTrigger value="a">탭 A</TabsTrigger>
        <TabsTrigger value="b">탭 B</TabsTrigger>
      </TabsList>
    </Tabs>
  ),
  breadcrumb: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">홈</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>›</BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">제품</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  pagination: () => <Pagination total={50} defaultPage={1} />,
  'navigation-menu': () => (
    <div className="flex items-center gap-3 text-sm">
      <span className="border-b-2 border-foreground pb-1">메뉴 1</span>
      <span className="text-foreground-muted">메뉴 2</span>
    </div>
  ),
  menubar: () => (
    <div className="flex border border-border-default bg-canvas">
      <div className="border-r border-border-default px-3 py-1 text-xs">파일</div>
      <div className="border-r border-border-default px-3 py-1 text-xs">편집</div>
      <div className="px-3 py-1 text-xs">보기</div>
    </div>
  ),

  // ─── Overlay (trigger 상태만) ────────────────────────────────────────────
  dialog: () => <Button>다이얼로그 열기</Button>,
  'alert-dialog': () => <Button variant="destructive">삭제 확인</Button>,
  drawer: () => <Button variant="outline">드로어 열기</Button>,
  sheet: () => <Button variant="outline">시트 열기</Button>,
  popover: () => <Button variant="outline">팝오버 열기</Button>,
  'hover-card': () => <Button variant="ghost">@user</Button>,
  tooltip: () => <Button variant="outline">호버하면 툴팁</Button>,
  'dropdown-menu': () => (
    <Button variant="outline" className="gap-2">
      메뉴 <span className="opacity-60">▾</span>
    </Button>
  ),
  'context-menu': () => (
    <div className="grid h-16 w-40 place-items-center border border-dashed border-border-default text-xs text-foreground-muted">
      우클릭 영역
    </div>
  ),

  // ─── Feedback ───────────────────────────────────────────────────────────
  alert: () => (
    <Alert>
      <AlertTitle>알림</AlertTitle>
      <AlertDescription>중요한 메시지가 있습니다.</AlertDescription>
    </Alert>
  ),
  toast: () => (
    <div className="w-48 border border-border-default bg-canvas p-3 shadow-md">
      <div className="text-sm font-medium">알림</div>
      <Muted className="text-xs">메시지가 전송되었습니다</Muted>
    </div>
  ),
  sonner: () => (
    <div className="w-48 border border-border-default bg-canvas p-3 shadow-md">
      <div className="text-sm">✓ 저장됨</div>
    </div>
  ),
  progress: () => <Progress value={60} className="w-40" />,

  // ─── Data Display ───────────────────────────────────────────────────────
  accordion: () => (
    <Accordion type="single" collapsible defaultValue="one" className="w-44">
      <AccordionItem value="one">
        <AccordionTrigger>섹션 제목</AccordionTrigger>
        <AccordionContent>
          <Text size="xs">펼쳐진 내용</Text>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  collapsible: () => (
    <Collapsible defaultOpen className="w-44">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between">
          접기/펼치기 <span className="opacity-60">▾</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Text size="xs">내용</Text>
      </CollapsibleContent>
    </Collapsible>
  ),
  table: () => (
    <Table className="w-44 text-xs">
      <TableHeader>
        <TableRow>
          <TableHead>이름</TableHead>
          <TableHead>역할</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>홍길동</TableCell>
          <TableCell>관리자</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  'data-table': () => (
    <Table className="w-44 text-xs">
      <TableHeader>
        <TableRow>
          <TableHead>이름</TableHead>
          <TableHead>상태</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>항목 1</TableCell>
          <TableCell>
            <Badge variant="secondary">활성</Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  carousel: () => (
    <div className="flex w-44 gap-2 overflow-hidden">
      <div className="size-16 shrink-0 border border-border-default bg-surface-strong" />
      <div className="size-16 shrink-0 border border-border-default bg-surface" />
      <div className="size-16 shrink-0 border border-border-default bg-surface" />
    </div>
  ),
};
