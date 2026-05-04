import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';

import type * as React from 'react';

export type ToastPosition =
  | 'top-left'
  | 'top-right'
  | 'top-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom-center';

export interface ToastProviderProps {
  /** 토스트 표시 위치. 기본 'top-right'. */
  position?: ToastPosition;
  /** 동시에 보이는 최대 토스트 수. 초과 시 큐에 대기. 기본 5. */
  visibleToasts?: number;
  /** 토스트 자동 닫힘 시간(ms). 기본 4000. `Infinity`로 영구 표시. */
  duration?: number;
  /** 닫기 버튼 항상 노출. 기본 false. */
  closeButton?: boolean;
}

/**
 * ToastProvider — 앱 루트에 한 번 마운트하는 토스트 컨테이너.
 *
 * - sonner 기반, 바능 디자인 시스템 톤으로 prestyled
 * - aria-live: info/success는 polite, danger는 assertive (sonner 자동 처리)
 * - 동시 노출 5개 (디폴트), 초과 시 큐
 *
 * @example
 *   // app/layout.tsx
 *   <ToastProvider position="top-right" />
 *
 *   // 컴포넌트 어디서나
 *   const { toast } = useToast();
 *   toast.success('저장됨');
 */
export function ToastProvider({
  position = 'top-right',
  visibleToasts = 5,
  duration = 4000,
  closeButton = false,
}: ToastProviderProps): React.ReactElement {
  return (
    <SonnerToaster
      position={position}
      visibleToasts={visibleToasts}
      duration={duration}
      closeButton={closeButton}
      toastOptions={{
        classNames: {
          toast: 'border border-border-default bg-canvas text-foreground rounded-none shadow-md',
          title: 'text-sm font-medium',
          description: 'text-sm text-foreground-muted',
          actionButton:
            'bg-foreground text-foreground-inverse rounded-none px-3 py-1.5 text-xs font-medium',
          cancelButton:
            'bg-surface-strong text-foreground rounded-none px-3 py-1.5 text-xs font-medium',
          success: 'border-success/40',
          error: 'border-danger/40',
          warning: 'border-warning/40',
          info: 'border-info/40',
        },
      }}
    />
  );
}

export interface ToastApi {
  /** 일반 토스트. */
  message: typeof sonnerToast;
  /** 성공 변형 (✓). */
  success: typeof sonnerToast.success;
  /** 정보 변형. */
  info: typeof sonnerToast.info;
  /** 경고 변형. */
  warning: typeof sonnerToast.warning;
  /** 오류 변형 (assertive). */
  error: typeof sonnerToast.error;
  /** Promise 추적 (loading → success/error). */
  promise: typeof sonnerToast.promise;
  /** 특정 토스트 닫기 / 전체 닫기. */
  dismiss: typeof sonnerToast.dismiss;
}

/**
 * useToast — 토스트 발생 API.
 *
 * sonner의 함수형 API를 그대로 노출하지만, 훅 형태라 IDE에서 발견 가능합니다.
 *
 * @example
 *   const { toast } = useToast();
 *   toast.success('저장됨');
 *   toast.error('실패', { description: '다시 시도해 주세요.' });
 */
export function useToast(): { toast: ToastApi } {
  return {
    toast: {
      message: sonnerToast,
      success: sonnerToast.success,
      info: sonnerToast.info,
      warning: sonnerToast.warning,
      error: sonnerToast.error,
      promise: sonnerToast.promise,
      dismiss: sonnerToast.dismiss,
    },
  };
}

/** 직접 import해서 사용할 수 있는 toast 함수 (sonner 그대로). */
export const toast = sonnerToast;
