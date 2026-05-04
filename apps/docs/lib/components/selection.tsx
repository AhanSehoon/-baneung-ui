'use client';

import * as React from 'react';

import { Calendar, Combobox, Command, DatePicker, NativeSelect, Select } from '@baneung-pack/ui';

import type { ComponentSpec } from './_types';

const cities = [
  { label: '서울', value: 'seoul' },
  { label: '부산', value: 'busan' },
  { label: '대구', value: 'daegu' },
  { label: '인천', value: 'incheon' },
  { label: '광주', value: 'gwangju' },
  { label: '대전', value: 'daejeon' },
  { label: '울산', value: 'ulsan' },
];

export const selectionComponents: ComponentSpec[] = [
  {
    slug: 'select',
    title: 'Select',
    category: 'Selection',
    description:
      'single / multiple / searchable 3 모드를 단일 컴포넌트로. cmdk + Popover 기반, IME 안전.',
    importPath: "import { Select } from '@baneung-pack/ui';",
    subpath: "import { Select } from '@baneung-pack/ui/select';",
    Example: () => (
      <div className="flex flex-col gap-3 max-w-sm">
        <Select options={cities} placeholder="도시" aria-label="도시 (single)" />
        <Select
          options={cities}
          searchable
          placeholder="검색 가능"
          aria-label="도시 (searchable)"
        />
        <Select
          mode="multiple"
          searchable
          options={cities}
          placeholder="다중 + 검색"
          aria-label="도시 (multiple)"
        />
      </div>
    ),
    code: `import { Select } from '@baneung-pack/ui';

const cities = [
  { label: '서울', value: 'seoul' },
  { label: '부산', value: 'busan' },
  { label: '대구', value: 'daegu' },
];

// single (default)
<Select options={cities} placeholder="도시" aria-label="도시" />

// searchable
<Select options={cities} searchable aria-label="도시" />

// multiple + searchable
<Select
  mode="multiple"
  searchable
  options={cities}
  aria-label="도시"
/>`,
    api: [
      { property: 'options', description: '후보 목록', type: 'SelectOption[]' },
      {
        property: 'mode',
        description: '선택 모드',
        type: "'single' | 'multiple'",
        default: "'single'",
      },
      { property: 'searchable', description: '검색 입력 노출', type: 'boolean', default: 'false' },
      {
        property: 'value',
        description: 'controlled 값 (single은 string, multiple은 string[])',
        type: 'string | string[]',
      },
      { property: 'defaultValue', description: 'uncontrolled 초기값', type: 'string | string[]' },
      {
        property: 'onValueChange',
        description: '값 변경 콜백',
        type: '(value: string | string[]) => void',
      },
      { property: 'placeholder', description: 'placeholder', type: 'string', default: "'선택…'" },
      {
        property: 'emptyText',
        description: '검색 결과 없음 텍스트',
        type: 'string',
        default: "'결과 없음'",
      },
      { property: 'maxSelected', description: 'multiple 모드 최대 선택 수', type: 'number' },
      {
        property: 'showSelectedCount',
        description: 'multiple에서 칩 대신 "N개 선택" 표시',
        type: 'boolean',
        default: 'false',
      },
      { property: 'filterFn', description: '커스텀 필터', type: '(option, query) => boolean' },
      { property: 'size', description: '트리거 크기', type: "'sm' | 'md' | 'lg'", default: "'md'" },
      { property: 'disabled', description: '비활성', type: 'boolean', default: 'false' },
    ],
  },
  {
    slug: 'native-select',
    title: 'NativeSelect',
    category: 'Selection',
    description: '브라우저 native <select> 래퍼. 모바일/저사양 폴백 + Field context 픽업.',
    importPath: "import { NativeSelect } from '@baneung-pack/ui';",
    subpath: "import { NativeSelect } from '@baneung-pack/ui/native-select';",
    Example: () => (
      <NativeSelect aria-label="도시" defaultValue="seoul" className="max-w-sm">
        <option value="seoul">서울</option>
        <option value="busan">부산</option>
        <option value="daegu">대구</option>
      </NativeSelect>
    ),
    code: `import { NativeSelect } from '@baneung-pack/ui';

<NativeSelect aria-label="도시" defaultValue="seoul">
  <option value="seoul">서울</option>
  <option value="busan">부산</option>
  <option value="daegu">대구</option>
</NativeSelect>`,
    api: [
      { property: 'size', description: '크기', type: "'sm' | 'md' | 'lg'", default: "'md'" },
      { property: 'children', description: '<option> 자식', type: 'ReactNode' },
    ],
  },
  {
    slug: 'combobox',
    title: 'Combobox',
    category: 'Selection',
    description: '자유 입력 + 자동완성. allowFreeText로 후보 없는 값 허용 가능.',
    importPath: "import { Combobox } from '@baneung-pack/ui';",
    subpath: "import { Combobox } from '@baneung-pack/ui/combobox';",
    Example: () => (
      <Combobox
        options={cities}
        placeholder="도시"
        aria-label="도시"
        allowFreeText
        className="max-w-sm"
      />
    ),
    code: `import { Combobox } from '@baneung-pack/ui';

const cities = [
  { label: '서울', value: 'seoul' },
  { label: '부산', value: 'busan' },
];

<Combobox
  options={cities}
  placeholder="도시"
  aria-label="도시"
  allowFreeText
/>`,
    api: [
      { property: 'options', description: '후보 목록', type: 'ComboboxOption[]' },
      { property: 'value', description: 'controlled 값', type: 'string' },
      { property: 'defaultValue', description: 'uncontrolled 초기값', type: 'string' },
      { property: 'onValueChange', description: '변경 콜백', type: '(value: string) => void' },
      {
        property: 'allowFreeText',
        description: '후보에 없는 자유 텍스트 허용',
        type: 'boolean',
        default: 'false',
      },
      { property: 'placeholder', description: 'placeholder', type: 'string', default: "'선택…'" },
      {
        property: 'emptyText',
        description: '결과 없음 텍스트',
        type: 'string',
        default: "'결과 없음'",
      },
      { property: 'disabled', description: '비활성', type: 'boolean', default: 'false' },
    ],
  },
  {
    slug: 'command',
    title: 'Command',
    category: 'Selection',
    description: 'cmdk 기반 ⌘K 팔레트. Input/List/Empty/Group/Item/Separator 합성.',
    importPath:
      "import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@baneung-pack/ui';",
    subpath: "import { Command } from '@baneung-pack/ui/command';",
    Example: () => (
      <Command label="명령" className="max-w-sm">
        <Command.Input placeholder="명령 검색…" />
        <Command.List>
          <Command.Empty>결과 없음</Command.Empty>
          <Command.Group heading="액션">
            <Command.Item>새 문서</Command.Item>
            <Command.Item>설정</Command.Item>
            <Command.Item>로그아웃</Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    ),
    code: `import { Command } from '@baneung-pack/ui';

<Command label="명령">
  <Command.Input placeholder="명령 검색…" />
  <Command.List>
    <Command.Empty>결과 없음</Command.Empty>
    <Command.Group heading="액션">
      <Command.Item onSelect={createDoc}>새 문서</Command.Item>
      <Command.Item onSelect={openSettings}>설정</Command.Item>
      <Command.Item onSelect={signOut}>로그아웃</Command.Item>
    </Command.Group>
  </Command.List>
</Command>`,
    api: [
      { property: 'label', description: '스크린리더용 라벨', type: 'string' },
      { property: 'filter', description: '커스텀 필터 함수', type: '(value, search) => number' },
      {
        property: 'children',
        description: 'Command.Input / List / Empty / Group / Item / Separator',
        type: 'ReactNode',
      },
    ],
  },
  {
    slug: 'calendar',
    title: 'Calendar',
    category: 'Selection',
    description:
      'react-day-picker v9 래퍼. mode="single" / "multiple" / "range" 지원, 토큰 기반 클래스 매핑.',
    importPath: "import { Calendar } from '@baneung-pack/ui';",
    subpath: "import { Calendar } from '@baneung-pack/ui/calendar';",
    Example: () => <Calendar mode="single" defaultMonth={new Date()} />,
    code: `import { Calendar } from '@baneung-pack/ui';

const [date, setDate] = useState<Date>();

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  defaultMonth={new Date()}
/>

// 범위 모드
<Calendar mode="range" selected={range} onSelect={setRange} />`,
    api: [
      {
        property: 'mode',
        description: '선택 모드',
        type: "'single' | 'multiple' | 'range'",
        default: "'default'",
      },
      { property: 'selected', description: '선택된 날짜', type: 'Date | Date[] | DateRange' },
      { property: 'onSelect', description: '선택 변경', type: '(date) => void' },
      {
        property: 'disabled',
        description: '비활성 날짜 매처',
        type: 'Date[] | ((date: Date) => boolean)',
      },
      { property: 'month', description: '표시 월 (controlled)', type: 'Date' },
      { property: 'defaultMonth', description: '표시 월 (uncontrolled)', type: 'Date' },
    ],
  },
  {
    slug: 'date-picker',
    title: 'DatePicker',
    category: 'Selection',
    description: 'Calendar + Popover 조합 — 트리거 클릭 시 캘린더 팝오버.',
    importPath: "import { DatePicker } from '@baneung-pack/ui';",
    subpath: "import { DatePicker } from '@baneung-pack/ui/date-picker';",
    Example: () => (
      <div className="max-w-sm">
        <DatePicker aria-label="날짜" placeholder="날짜 선택" />
      </div>
    ),
    code: `import { DatePicker } from '@baneung-pack/ui';

const [date, setDate] = useState<Date>();

<DatePicker
  aria-label="날짜"
  placeholder="날짜 선택"
  value={date}
  onValueChange={setDate}
/>`,
    api: [
      { property: 'value', description: 'controlled 값', type: 'Date' },
      { property: 'defaultValue', description: 'uncontrolled 초기값', type: 'Date' },
      {
        property: 'onValueChange',
        description: '변경 콜백',
        type: '(value: Date | undefined) => void',
      },
      {
        property: 'placeholder',
        description: 'placeholder',
        type: 'string',
        default: "'날짜 선택'",
      },
      { property: 'formatDate', description: '날짜 포맷터', type: '(date: Date) => string' },
      {
        property: 'disabledDates',
        description: '비활성 날짜',
        type: 'Date[] | ((date: Date) => boolean)',
      },
      { property: 'disabled', description: '비활성', type: 'boolean', default: 'false' },
    ],
  },
];
