import { Toaster as SonnerToaster, toast } from 'sonner';

import type * as React from 'react';

/**
 * Sonner — sonner 라이브러리의 Toaster를 바능 디자인 시스템 톤으로 노출.
 *
 * - sonner의 모든 기능(토스트 큐, 스와이프 dismiss, promise toast 등)을 그대로 사용
 * - 더 의견적인 래퍼는 `@baneung-pack/ui/toast` 참조 (ToastProvider + useToast)
 *
 * @example
 *   // 앱 루트에 한 번 마운트
 *   <Sonner />
 *
 *   // 어디서나
 *   import { toast } from '@baneung-pack/ui/sonner';
 *   toast.success('저장됨');
 */
export const Sonner = (props: React.ComponentProps<typeof SonnerToaster>): React.ReactElement => (
  <SonnerToaster
    position={props.position ?? 'top-right'}
    visibleToasts={props.visibleToasts ?? 5}
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
      ...props.toastOptions,
    }}
    {...props}
  />
);
Sonner.displayName = 'Sonner';

export { toast };
