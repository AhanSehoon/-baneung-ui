import * as React from 'react';

import {
  Button,
  Checkbox,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
  InputGroup,
  InputOTP,
  RadioGroup,
  RadioGroupItem,
  Slider,
  Switch,
  Textarea,
} from '@baneung-pack/ui';

import type { ComponentSpec } from './_types';

export const inputsComponents: ComponentSpec[] = [
  {
    slug: 'input',
    title: 'Input',
    category: 'Inputs',
    description:
      '단일 라인 텍스트 입력. leftAdornment/rightAdornment, error 상태(aria-invalid), Field context 자동 픽업, 한글 IME 안전.',
    importPath: "import { Input } from '@baneung-pack/ui';",
    subpath: "import { Input } from '@baneung-pack/ui/input';",
    Example: () => (
      <div className="flex flex-col gap-3">
        <Input placeholder="이름" aria-label="이름" />
        <Input
          aria-label="검색"
          placeholder="검색어"
          leftAdornment={<span aria-hidden="true">⌕</span>}
        />
        <Input aria-label="에러" placeholder="잘못된 값" aria-invalid />
      </div>
    ),
    code: `import { Input } from '@baneung-pack/ui';

<Input placeholder="이름" />

<Input
  placeholder="검색어"
  leftAdornment={<SearchIcon />}
/>

<Input placeholder="잘못된 값" aria-invalid />`,
    api: [
      { property: 'size', description: '크기', type: "'sm' | 'md' | 'lg'", default: "'md'" },
      {
        property: 'leftAdornment',
        description: '좌측 슬롯 (아이콘, 단위 라벨 등)',
        type: 'ReactNode',
      },
      { property: 'rightAdornment', description: '우측 슬롯', type: 'ReactNode' },
      {
        property: 'aria-invalid',
        description: '에러 상태 — Field invalid가 자동 주입',
        type: 'boolean',
      },
      {
        property: 'type',
        description: 'native input type',
        type: "'text' | 'email' | 'password' | ...",
        default: "'text'",
      },
      {
        property: 'wrapperClassName',
        description: 'adornment 사용 시 외부 wrapper 클래스',
        type: 'string',
      },
    ],
  },
  {
    slug: 'input-group',
    title: 'InputGroup',
    category: 'Inputs',
    description: 'Input + Button + Icon을 한 줄로 묶고 인접 보더를 머지.',
    importPath: "import { InputGroup, Input, Button } from '@baneung-pack/ui';",
    subpath: "import { InputGroup } from '@baneung-pack/ui/input-group';",
    Example: () => (
      <InputGroup aria-label="검색">
        <Input placeholder="검색어" aria-label="검색어" />
        <Button variant="outline" className="shrink-0">
          검색
        </Button>
      </InputGroup>
    ),
    code: `import { InputGroup, Input, Button } from '@baneung-pack/ui';

<InputGroup aria-label="검색">
  <Input placeholder="검색어" />
  <Button variant="outline">검색</Button>
</InputGroup>`,
    api: [{ property: 'aria-label', description: '그룹 라벨', type: 'string' }],
  },
  {
    slug: 'input-otp',
    title: 'InputOTP',
    category: 'Inputs',
    description:
      'N자리 코드(예: 6자리 OTP) 입력. 자동 advance, paste 분배, 한글 IME 패턴 차단(기본 숫자만).',
    importPath: "import { InputOTP } from '@baneung-pack/ui';",
    subpath: "import { InputOTP } from '@baneung-pack/ui/input-otp';",
    Example: () => <InputOTP aria-label="2단계 인증 코드" length={6} />,
    code: `import { InputOTP } from '@baneung-pack/ui';

<InputOTP
  aria-label="2단계 인증 코드"
  length={6}
  onComplete={(code) => verify(code)}
/>`,
    api: [
      { property: 'length', description: '슬롯 개수', type: 'number', default: '6' },
      { property: 'value', description: 'controlled 값', type: 'string' },
      { property: 'defaultValue', description: 'uncontrolled 초기값', type: 'string' },
      { property: 'onValueChange', description: '값 변경 콜백', type: '(value: string) => void' },
      {
        property: 'pattern',
        description: '허용 문자 정규식',
        type: 'RegExp',
        default: '/^[0-9]$/',
      },
      { property: 'onComplete', description: '입력 완료 시 호출', type: '(value: string) => void' },
      { property: 'disabled', description: '비활성', type: 'boolean', default: 'false' },
    ],
  },
  {
    slug: 'textarea',
    title: 'Textarea',
    category: 'Inputs',
    description: '다중 라인 텍스트. autoResize + maxRows 지원, 한글 IME 안전.',
    importPath: "import { Textarea } from '@baneung-pack/ui';",
    subpath: "import { Textarea } from '@baneung-pack/ui/textarea';",
    Example: () => (
      <Textarea aria-label="설명" placeholder="자세히 입력하세요" autoResize maxRows={6} rows={3} />
    ),
    code: `import { Textarea } from '@baneung-pack/ui';

<Textarea
  placeholder="자세히 입력하세요"
  autoResize
  maxRows={6}
  rows={3}
/>`,
    api: [
      {
        property: 'autoResize',
        description: '내용에 맞춰 높이 자동 조정',
        type: 'boolean',
        default: 'false',
      },
      {
        property: 'maxRows',
        description: 'autoResize 활성 시 최대 행 수',
        type: 'number',
        default: '8',
      },
      { property: 'rows', description: '초기 행 수', type: 'number', default: '3' },
    ],
  },
  {
    slug: 'field',
    title: 'Field',
    category: 'Inputs',
    description:
      '라벨/설명/에러/컨트롤을 묶는 표준 폼 래퍼. React Context로 자식 input에 id·aria-*·disabled를 자동 주입.',
    importPath:
      "import { Field, FieldLabel, FieldDescription, FieldError, Input } from '@baneung-pack/ui';",
    subpath: "import { Field } from '@baneung-pack/ui/field';",
    Example: () => (
      <Field invalid required>
        <FieldLabel>이메일</FieldLabel>
        <FieldDescription>업무용 이메일을 입력하세요.</FieldDescription>
        <Input type="email" placeholder="user@company.com" />
        <FieldError>유효한 이메일 형식이 아닙니다.</FieldError>
      </Field>
    ),
    code: `import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  Input,
} from '@baneung-pack/ui';

<Field invalid required>
  <FieldLabel>이메일</FieldLabel>
  <FieldDescription>업무용 이메일을 입력하세요.</FieldDescription>
  <Input type="email" placeholder="user@company.com" />
  <FieldError>유효한 이메일 형식이 아닙니다.</FieldError>
</Field>`,
    api: [
      {
        property: 'invalid',
        description: '검증 실패 — 자식 컨트롤에 aria-invalid + Error를 aria-describedby로 연결',
        type: 'boolean',
        default: 'false',
      },
      {
        property: 'required',
        description: '필수 — 자식 컨트롤에 aria-required + Label에 별표',
        type: 'boolean',
        default: 'false',
      },
      { property: 'disabled', description: '일괄 disable', type: 'boolean', default: 'false' },
      { property: 'id', description: '컨트롤 id 강제 지정 (미지정 시 자동 생성)', type: 'string' },
    ],
  },
  {
    slug: 'checkbox',
    title: 'Checkbox',
    category: 'Inputs',
    description: 'Radix Checkbox. checked={true | false | "indeterminate"} 모두 지원.',
    importPath: "import { Checkbox } from '@baneung-pack/ui';",
    subpath: "import { Checkbox } from '@baneung-pack/ui/checkbox';",
    Example: () => (
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox /> 기본
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox defaultChecked /> 체크됨
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked="indeterminate" /> indeterminate
        </label>
      </div>
    ),
    code: `import { Checkbox } from '@baneung-pack/ui';

<label>
  <Checkbox /> 기본
</label>

<label>
  <Checkbox defaultChecked /> 체크됨
</label>

<label>
  <Checkbox checked="indeterminate" /> indeterminate
</label>`,
    api: [
      { property: 'checked', description: 'controlled 상태', type: "boolean | 'indeterminate'" },
      {
        property: 'defaultChecked',
        description: 'uncontrolled 초기 상태',
        type: "boolean | 'indeterminate'",
      },
      {
        property: 'onCheckedChange',
        description: '상태 변경 콜백',
        type: "(checked: boolean | 'indeterminate') => void",
      },
      { property: 'disabled', description: '비활성', type: 'boolean', default: 'false' },
      { property: 'required', description: '필수', type: 'boolean', default: 'false' },
    ],
  },
  {
    slug: 'radio-group',
    title: 'RadioGroup',
    category: 'Inputs',
    description: '단일 선택 그룹 (Radix). 화살표 ↑↓←→로 항목 이동.',
    importPath: "import { RadioGroup, RadioGroupItem } from '@baneung-pack/ui';",
    subpath: "import { RadioGroup } from '@baneung-pack/ui/radio-group';",
    Example: () => (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs text-foreground-muted">vertical (기본)</p>
          <RadioGroup defaultValue="basic" aria-label="플랜">
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="basic" /> 기본
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="pro" /> 프로
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="team" /> 팀
            </label>
          </RadioGroup>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs text-foreground-muted">horizontal</p>
          <RadioGroup defaultValue="m" aria-label="사이즈" orientation="horizontal">
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="s" /> S
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="m" /> M
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="l" /> L
            </label>
          </RadioGroup>
        </div>
      </div>
    ),
    code: `import { RadioGroup, RadioGroupItem } from '@baneung-pack/ui';

// vertical (기본)
<RadioGroup defaultValue="basic" aria-label="플랜">
  <label><RadioGroupItem value="basic" /> 기본</label>
  <label><RadioGroupItem value="pro" /> 프로</label>
  <label><RadioGroupItem value="team" /> 팀</label>
</RadioGroup>

// horizontal
<RadioGroup defaultValue="m" aria-label="사이즈" orientation="horizontal">
  <label><RadioGroupItem value="s" /> S</label>
  <label><RadioGroupItem value="m" /> M</label>
  <label><RadioGroupItem value="l" /> L</label>
</RadioGroup>`,
    api: [
      { property: 'value', description: 'controlled 선택값', type: 'string' },
      { property: 'defaultValue', description: 'uncontrolled 초기값', type: 'string' },
      { property: 'onValueChange', description: '변경 콜백', type: '(value: string) => void' },
      {
        property: 'orientation',
        description: '항목 정렬 방향',
        type: "'horizontal' | 'vertical'",
        default: "'vertical'",
      },
      { property: 'disabled', description: '전체 비활성', type: 'boolean', default: 'false' },
      { property: 'required', description: '필수', type: 'boolean', default: 'false' },
    ],
  },
  {
    slug: 'switch',
    title: 'Switch',
    category: 'Inputs',
    description: 'Radix Switch (role="switch"). Space/Enter로 토글.',
    importPath: "import { Switch } from '@baneung-pack/ui';",
    subpath: "import { Switch } from '@baneung-pack/ui/switch';",
    Example: () => (
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 text-sm">
          <Switch /> 알림 받기
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch defaultChecked /> 자동 저장
        </label>
      </div>
    ),
    code: `import { Switch } from '@baneung-pack/ui';

<label>
  <Switch /> 알림 받기
</label>

<label>
  <Switch defaultChecked /> 자동 저장
</label>`,
    api: [
      { property: 'checked', description: 'controlled 상태', type: 'boolean' },
      {
        property: 'defaultChecked',
        description: 'uncontrolled 초기 상태',
        type: 'boolean',
        default: 'false',
      },
      {
        property: 'onCheckedChange',
        description: '상태 변경 콜백',
        type: '(checked: boolean) => void',
      },
      { property: 'disabled', description: '비활성', type: 'boolean', default: 'false' },
    ],
  },
  {
    slug: 'slider',
    title: 'Slider',
    category: 'Inputs',
    description: '단일/범위 값 슬라이더 (Radix). 화살표/PageUp/Down/Home/End 키 지원.',
    importPath: "import { Slider } from '@baneung-pack/ui';",
    subpath: "import { Slider } from '@baneung-pack/ui/slider';",
    Example: () => (
      <div className="flex flex-col gap-6">
        <Slider defaultValue={[40]} min={0} max={100} aria-label="볼륨" />
        <Slider
          defaultValue={[20, 80]}
          min={0}
          max={100}
          thumbLabels={['최소', '최대']}
          aria-label="가격 범위"
        />
      </div>
    ),
    code: `import { Slider } from '@baneung-pack/ui';

// 단일
<Slider defaultValue={[40]} min={0} max={100} aria-label="볼륨" />

// 범위
<Slider
  defaultValue={[20, 80]}
  min={0}
  max={100}
  thumbLabels={['최소', '최대']}
  aria-label="가격 범위"
/>`,
    api: [
      {
        property: 'value',
        description: 'controlled 값 (단일은 [n], 범위는 [min, max])',
        type: 'number[]',
      },
      { property: 'defaultValue', description: 'uncontrolled 초기값', type: 'number[]' },
      { property: 'onValueChange', description: '변경 콜백', type: '(value: number[]) => void' },
      { property: 'min', description: '최소값', type: 'number', default: '0' },
      { property: 'max', description: '최대값', type: 'number', default: '100' },
      { property: 'step', description: '간격', type: 'number', default: '1' },
      {
        property: 'thumbLabels',
        description: '각 thumb의 aria-label (범위 모드 권장)',
        type: 'string[]',
      },
      {
        property: 'orientation',
        description: '방향',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
      },
    ],
  },
];
