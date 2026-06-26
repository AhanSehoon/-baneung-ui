'use client';

import * as React from 'react';
import { useState } from 'react';

import {
  Calendar,
  Combobox,
  Command,
  DatePicker,
  NativeSelect,
  Select,
  type CalendarEvent,
} from '@baneung-pack/ui';

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
  {
    slug: 'calendar',
    title: 'Calendar',
    category: 'Selection',
    description:
      '월간 일정 캘린더 (Google Calendar 스타일). 1일/range/다중 lane/더보기/드래그-드롭 지원.',
    importPath: "import { Calendar } from '@baneung-pack/ui';",
    subpath: "import { Calendar } from '@baneung-pack/ui/calendar';",
    Example: () => <CalendarDemo />,
    code: `import { Calendar, type CalendarEvent } from '@baneung-pack/ui';
import { useState } from 'react';

const [events, setEvents] = useState<CalendarEvent[]>([
  { id: '1', start: new Date(2026, 5, 15), end: new Date(2026, 5, 15),
    title: '회의', color: 'blue', allDay: true },
  { id: '2', start: new Date(2026, 5, 20), end: new Date(2026, 5, 23),
    title: '워크샵', color: 'green' },
]);

<Calendar
  events={events}
  onEventClick={(e) => alert(e.title)}
  onEventMove={(e, start, end) =>
    setEvents(prev => prev.map(ev => ev.id === e.id ? { ...ev, start, end } : ev))
  }
/>`,
    api: [
      { property: 'events', description: '표시할 일정 배열', type: 'CalendarEvent[]' },
      { property: 'month', description: '표시 월 (controlled)', type: 'Date' },
      { property: 'defaultMonth', description: '표시 월 초기값', type: 'Date' },
      { property: 'onMonthChange', description: '월 변경 콜백', type: '(date: Date) => void' },
      { property: 'onEventClick', description: '일정 클릭', type: '(event) => void' },
      {
        property: 'onEventMove',
        description: '일정 드래그 이동 — 전달 시 DnD 활성',
        type: '(event, start, end) => void',
      },
      {
        property: 'maxVisible',
        description: '셀당 최대 표시 일정 수',
        type: 'number',
        default: '3',
      },
      {
        property: 'locale',
        description: '표시 언어',
        type: 'CalendarLocale | Locale',
        default: "'ko'",
      },
    ],
  },
];

/**
 * CalendarDemo — 데모용 stateful wrapper (드래그 이동 시 state 갱신).
 */
function CalendarDemo(): React.ReactElement {
  const today = new Date();
  const m = today.getMonth();
  const y = today.getFullYear();
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      start: new Date(y, m, 5),
      end: new Date(y, m, 5),
      title: '디자인 리뷰',
      color: 'blue',
      allDay: true,
    },
    {
      id: '2',
      start: new Date(y, m, 10),
      end: new Date(y, m, 13),
      title: '사내 워크샵',
      color: 'green',
    },
    {
      id: '3',
      start: new Date(y, m, 12),
      end: new Date(y, m, 12),
      title: '점심 미팅',
      color: 'amber',
      allDay: false,
    },
    {
      id: '4',
      start: new Date(y, m, 18),
      end: new Date(y, m, 22),
      title: '컨퍼런스 출장',
      color: 'purple',
    },
    {
      id: '5',
      start: new Date(y, m, 20),
      end: new Date(y, m, 20),
      title: '발표 준비',
      color: 'red',
      allDay: true,
    },
    {
      id: '6',
      start: new Date(y, m, 20),
      end: new Date(y, m, 20),
      title: '리뷰 회의',
      color: 'gray',
      allDay: true,
    },
    {
      id: '7',
      start: new Date(y, m, 20),
      end: new Date(y, m, 20),
      title: '추가 일정',
      color: 'blue',
      allDay: true,
    },
    { id: '8', start: new Date(y, m, 25), end: new Date(y, m, 27), title: '연휴', color: 'gray' },
  ]);

  return (
    <Calendar
      events={events}
      onEventClick={(e) => alert(`클릭: ${e.title}`)}
      onEventMove={(e, start, end) =>
        setEvents((prev) => prev.map((ev) => (ev.id === e.id ? { ...ev, start, end } : ev)))
      }
    />
  );
}
