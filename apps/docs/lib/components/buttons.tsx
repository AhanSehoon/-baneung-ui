import * as React from 'react';

import { Button, ButtonGroup, Toggle, ToggleGroup, ToggleGroupItem } from '@baneung-pack/ui';

import type { ComponentSpec } from './_types';

export const buttonsComponents: ComponentSpec[] = [
  {
    slug: 'button',
    title: 'Button',
    category: 'Buttons & Toggles',
    description:
      '5 variants × 3 sizes. asChild로 <a>·next/link 합성. loading=true면 자동으로 Spinner + disabled + aria-busy.',
    importPath: "import { Button } from '@baneung-pack/ui';",
    subpath: "import { Button } from '@baneung-pack/ui/button';",
    Example: () => (
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Button>기본</Button>
          <Button variant="secondary">보조</Button>
          <Button variant="outline">아웃라인</Button>
          <Button variant="ghost">고스트</Button>
          <Button variant="destructive">삭제</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm">sm</Button>
          <Button size="md">md</Button>
          <Button size="lg">lg</Button>
          <Button loading>저장 중</Button>
        </div>
      </div>
    ),
    code: `import { Button } from '@baneung-pack/ui';

<>
  <Button>기본</Button>
  <Button variant="secondary">보조</Button>
  <Button variant="outline">아웃라인</Button>
  <Button variant="ghost">고스트</Button>
  <Button variant="destructive">삭제</Button>

  <Button size="sm">sm</Button>
  <Button size="md">md</Button>
  <Button size="lg">lg</Button>
  <Button loading>저장 중</Button>
</>`,
    api: [
      {
        property: 'variant',
        description: '시각 변형',
        type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'",
        default: "'primary'",
      },
      { property: 'size', description: '크기', type: "'sm' | 'md' | 'lg'", default: "'md'" },
      {
        property: 'asChild',
        description: 'Slot으로 합성. 사용 시 leftIcon/rightIcon/loading 무시',
        type: 'boolean',
        default: 'false',
      },
      {
        property: 'loading',
        description: 'true면 disabled + 좌측에 Spinner + aria-busy',
        type: 'boolean',
        default: 'false',
      },
      { property: 'leftIcon', description: '좌측 아이콘 슬롯', type: 'ReactNode' },
      { property: 'rightIcon', description: '우측 아이콘 슬롯', type: 'ReactNode' },
      { property: 'disabled', description: '비활성', type: 'boolean', default: 'false' },
    ],
  },
  {
    slug: 'button-group',
    title: 'ButtonGroup',
    category: 'Buttons & Toggles',
    description: '여러 Button을 묶어 인접 보더를 합치는 그룹 컨테이너. role="group".',
    importPath: "import { ButtonGroup, Button } from '@baneung-pack/ui';",
    subpath: "import { ButtonGroup } from '@baneung-pack/ui/button-group';",
    Example: () => (
      <div className="flex flex-col gap-3">
        <ButtonGroup aria-label="페이지 이동">
          <Button variant="outline">이전</Button>
          <Button variant="outline">현재</Button>
          <Button variant="outline">다음</Button>
        </ButtonGroup>
        <ButtonGroup orientation="vertical" aria-label="세로 그룹">
          <Button variant="outline">A</Button>
          <Button variant="outline">B</Button>
          <Button variant="outline">C</Button>
        </ButtonGroup>
      </div>
    ),
    code: `import { ButtonGroup, Button } from '@baneung-pack/ui';

<ButtonGroup aria-label="페이지 이동">
  <Button variant="outline">이전</Button>
  <Button variant="outline">현재</Button>
  <Button variant="outline">다음</Button>
</ButtonGroup>

<ButtonGroup orientation="vertical" aria-label="세로 그룹">
  <Button variant="outline">A</Button>
  <Button variant="outline">B</Button>
  <Button variant="outline">C</Button>
</ButtonGroup>`,
    api: [
      {
        property: 'orientation',
        description: '방향',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
      },
      {
        property: 'aria-label',
        description: '그룹 시맨틱 라벨 (스크린리더용 권장)',
        type: 'string',
      },
    ],
  },
  {
    slug: 'toggle',
    title: 'Toggle',
    category: 'Buttons & Toggles',
    description: '단일 on/off 버튼 (Radix Toggle). aria-pressed 자동 관리, Space/Enter로 토글.',
    importPath: "import { Toggle } from '@baneung-pack/ui';",
    subpath: "import { Toggle } from '@baneung-pack/ui/toggle';",
    Example: () => (
      <div className="flex gap-2">
        <Toggle aria-label="굵게">B</Toggle>
        <Toggle aria-label="기울임" defaultPressed>
          I
        </Toggle>
        <Toggle aria-label="밑줄" variant="outline">
          U
        </Toggle>
      </div>
    ),
    code: `import { Toggle } from '@baneung-pack/ui';

<>
  <Toggle aria-label="굵게">B</Toggle>
  <Toggle aria-label="기울임" defaultPressed>I</Toggle>
  <Toggle aria-label="밑줄" variant="outline">U</Toggle>
</>`,
    api: [
      { property: 'pressed', description: 'controlled 토글 상태', type: 'boolean' },
      {
        property: 'defaultPressed',
        description: 'uncontrolled 초기 상태',
        type: 'boolean',
        default: 'false',
      },
      {
        property: 'onPressedChange',
        description: '상태 변경 콜백',
        type: '(pressed: boolean) => void',
      },
      {
        property: 'variant',
        description: '시각 변형',
        type: "'default' | 'outline'",
        default: "'default'",
      },
      { property: 'size', description: '크기', type: "'sm' | 'md' | 'lg'", default: "'md'" },
      { property: 'disabled', description: '비활성', type: 'boolean', default: 'false' },
    ],
  },
  {
    slug: 'toggle-group',
    title: 'ToggleGroup',
    category: 'Buttons & Toggles',
    description: 'Toggle을 묶어 단일/다중 선택 그룹 구성 (Radix). 화살표 키로 항목 이동.',
    importPath: "import { ToggleGroup, ToggleGroupItem } from '@baneung-pack/ui';",
    subpath: "import { ToggleGroup } from '@baneung-pack/ui/toggle-group';",
    Example: () => (
      <div className="flex flex-col gap-3">
        <ToggleGroup type="single" defaultValue="left" aria-label="정렬">
          <ToggleGroupItem variant="outline" value="left">
            왼쪽
          </ToggleGroupItem>
          <ToggleGroupItem variant="outline" value="center">
            가운데
          </ToggleGroupItem>
          <ToggleGroupItem variant="outline" value="right">
            오른쪽
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="multiple" aria-label="포맷">
          <ToggleGroupItem variant="outline" value="bold">
            B
          </ToggleGroupItem>
          <ToggleGroupItem variant="outline" value="italic">
            I
          </ToggleGroupItem>
          <ToggleGroupItem variant="outline" value="under">
            U
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    ),
    code: `import { ToggleGroup, ToggleGroupItem } from '@baneung-pack/ui';

<ToggleGroup type="single" defaultValue="left" aria-label="정렬">
  <ToggleGroupItem variant="outline" value="left">왼쪽</ToggleGroupItem>
  <ToggleGroupItem variant="outline" value="center">가운데</ToggleGroupItem>
  <ToggleGroupItem variant="outline" value="right">오른쪽</ToggleGroupItem>
</ToggleGroup>

<ToggleGroup type="multiple" aria-label="포맷">
  <ToggleGroupItem variant="outline" value="bold">B</ToggleGroupItem>
  <ToggleGroupItem variant="outline" value="italic">I</ToggleGroupItem>
  <ToggleGroupItem variant="outline" value="under">U</ToggleGroupItem>
</ToggleGroup>`,
    api: [
      {
        property: 'type',
        description: '선택 모드 — single은 radio, multiple은 button',
        type: "'single' | 'multiple'",
      },
      {
        property: 'value',
        description: 'controlled 선택값 (single: string, multiple: string[])',
        type: 'string | string[]',
      },
      { property: 'defaultValue', description: 'uncontrolled 초기값', type: 'string | string[]' },
      {
        property: 'onValueChange',
        description: '값 변경 콜백',
        type: '(value: string | string[]) => void',
      },
      { property: 'disabled', description: '전체 비활성', type: 'boolean', default: 'false' },
    ],
  },
];
