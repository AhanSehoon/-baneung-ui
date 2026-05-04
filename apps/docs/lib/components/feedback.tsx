'use client';

import * as React from 'react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Progress,
  ToastProvider,
  useToast,
} from '@baneung-pack/ui';

import type { ComponentSpec } from './_types';

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <ToastProvider />
      <Button variant="outline" onClick={() => toast.success('저장됨')}>
        성공
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.error('실패', { description: '다시 시도해 주세요.' })}
      >
        오류
      </Button>
      <Button variant="outline" onClick={() => toast.message('알림')}>
        일반
      </Button>
    </div>
  );
}

export const feedbackComponents: ComponentSpec[] = [
  {
    slug: 'alert',
    title: 'Alert',
    category: 'Feedback',
    description:
      '페이지 내 비차단 안내. variant=danger는 role="alert"+aria-live="assertive", 그 외 role="status"+aria-live="polite".',
    importPath: "import { Alert, AlertTitle, AlertDescription } from '@baneung-pack/ui';",
    subpath: "import { Alert } from '@baneung-pack/ui/alert';",
    Example: () => (
      <div className="flex flex-col gap-3">
        <Alert variant="info">
          <AlertTitle>정보</AlertTitle>
          <AlertDescription>새 버전이 출시되었습니다.</AlertDescription>
        </Alert>
        <Alert variant="success">
          <AlertTitle>저장됨</AlertTitle>
          <AlertDescription>변경사항이 저장되었습니다.</AlertDescription>
        </Alert>
        <Alert variant="warning">
          <AlertTitle>주의</AlertTitle>
          <AlertDescription>저장되지 않은 변경 사항이 있습니다.</AlertDescription>
        </Alert>
        <Alert variant="danger" onDismiss={() => undefined}>
          <AlertTitle>오류</AlertTitle>
          <AlertDescription>요청을 처리할 수 없습니다.</AlertDescription>
        </Alert>
      </div>
    ),
    code: `import { Alert, AlertTitle, AlertDescription } from '@baneung-pack/ui';

<Alert variant="info">
  <AlertTitle>정보</AlertTitle>
  <AlertDescription>새 버전이 출시되었습니다.</AlertDescription>
</Alert>

<Alert variant="success">
  <AlertTitle>저장됨</AlertTitle>
  <AlertDescription>변경사항이 저장되었습니다.</AlertDescription>
</Alert>

<Alert variant="warning">
  <AlertTitle>주의</AlertTitle>
  <AlertDescription>저장되지 않은 변경 사항이 있습니다.</AlertDescription>
</Alert>

<Alert variant="danger" onDismiss={handleDismiss}>
  <AlertTitle>오류</AlertTitle>
  <AlertDescription>요청을 처리할 수 없습니다.</AlertDescription>
</Alert>`,
    api: [
      {
        property: 'variant',
        description: '시각/시맨틱 변형',
        type: "'info' | 'success' | 'warning' | 'danger'",
        default: "'info'",
      },
      {
        property: 'onDismiss',
        description: 'dismiss 콜백 (지정 시 닫기 버튼 표시)',
        type: '() => void',
      },
      {
        property: 'dismissLabel',
        description: '닫기 버튼 aria-label',
        type: 'string',
        default: "'닫기'",
      },
    ],
  },
  {
    slug: 'toast',
    title: 'Toast',
    category: 'Feedback',
    description:
      'sonner 기반 의견적 래퍼. 앱 루트에 <ToastProvider /> 한 번 + 어디서나 useToast(). 동시 5개 + 큐.',
    importPath: "import { ToastProvider, useToast } from '@baneung-pack/ui';",
    subpath: "import { ToastProvider, useToast } from '@baneung-pack/ui/toast';",
    Example: ToastDemo,
    code: `import { ToastProvider, useToast } from '@baneung-pack/ui';

// 앱 루트에 한 번
<ToastProvider position="top-right" />

// 어디서나
function MyButton() {
  const { toast } = useToast();
  return (
    <Button onClick={() => toast.success('저장됨')}>
      저장
    </Button>
  );
}

// 비동기
toast.promise(savePost(), {
  loading: '저장 중…',
  success: '저장됨',
  error: '실패',
});`,
    api: [
      {
        property: 'position (Provider)',
        description: '표시 위치',
        type: "'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center'",
        default: "'top-right'",
      },
      {
        property: 'visibleToasts (Provider)',
        description: '동시 노출 최대 개수',
        type: 'number',
        default: '5',
      },
      {
        property: 'duration (Provider)',
        description: '자동 닫힘(ms)',
        type: 'number',
        default: '4000',
      },
      {
        property: 'closeButton (Provider)',
        description: '닫기 버튼 항상 표시',
        type: 'boolean',
        default: 'false',
      },
      {
        property: 'toast.success/info/warning/error/message',
        description: '토스트 발생 (useToast 반환)',
        type: '(message, options?) => void',
      },
      {
        property: 'toast.promise',
        description: 'loading → success/error 추적',
        type: '(promise, { loading, success, error })',
      },
      { property: 'toast.dismiss', description: '특정/전체 토스트 닫기', type: '(id?) => void' },
    ],
  },
  {
    slug: 'sonner',
    title: 'Sonner',
    category: 'Feedback',
    description:
      'sonner Toaster 직접 노출. 풀 sonner API가 필요할 때 — subpath import 전용 (`@baneung-pack/ui/sonner`).',
    importPath: "import { Sonner, toast } from '@baneung-pack/ui/sonner';",
    Example: () => (
      <p className="text-sm text-foreground-muted">
        예제는 <code className="font-mono text-xs">/components/toast</code>를 참조하세요. Sonner는
        sonner의 풀 API(자체 Toaster 컴포넌트)가 필요할 때 사용하는 escape hatch입니다.
      </p>
    ),
    code: `import { Sonner, toast } from '@baneung-pack/ui/sonner';

// 앱 루트에 한 번
<Sonner position="top-right" richColors closeButton />

// 어디서나 — sonner의 풀 API
toast('이벤트 생성됨', {
  description: '월요일, 12월 3일 9:00 AM',
  action: {
    label: '실행취소',
    onClick: () => undo(),
  },
});`,
    api: [
      {
        property: 'Sonner (Toaster)',
        description: 'sonner Toaster + 바능 톤 prestyled',
        type: 'see sonner docs',
      },
      { property: 'toast', description: 'sonner의 toast 함수 그대로', type: 'see sonner docs' },
    ],
  },
  {
    slug: 'progress',
    title: 'Progress',
    category: 'Feedback',
    description:
      'Radix Progress. 결정(value 0~100) / 비결정(value 생략) 모드. role="progressbar" + aria-valuenow 자동.',
    importPath: "import { Progress } from '@baneung-pack/ui';",
    subpath: "import { Progress } from '@baneung-pack/ui/progress';",
    Example: () => (
      <div className="flex flex-col gap-4">
        <Progress value={20} aria-label="20%" />
        <Progress value={60} aria-label="60%" size="md" />
        <Progress value={90} aria-label="90%" size="lg" />
        <Progress aria-label="indeterminate" />
      </div>
    ),
    code: `import { Progress } from '@baneung-pack/ui';

// 결정 모드
<Progress value={60} aria-label="60%" />

// 비결정 모드 (loading)
<Progress aria-label="로딩 중" />

// 사이즈
<Progress value={20} size="sm" aria-label="20%" />
<Progress value={60} size="md" aria-label="60%" />
<Progress value={90} size="lg" aria-label="90%" />`,
    api: [
      {
        property: 'value',
        description: '진행률 (0~100). 생략/null이면 indeterminate',
        type: 'number | null',
      },
      { property: 'size', description: '높이', type: "'sm' | 'md' | 'lg'", default: "'md'" },
    ],
  },
];
