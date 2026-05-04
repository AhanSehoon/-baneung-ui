import {
  Panel as PanelPrimitive,
  PanelGroup as PanelGroupPrimitive,
  PanelResizeHandle as PanelResizeHandlePrimitive,
} from 'react-resizable-panels';

import { cn } from '../../lib/cn';

import type * as React from 'react';

/**
 * ResizablePanelGroup — 패널 그룹 컨테이너.
 * `direction="horizontal"` 또는 `"vertical"`로 분할 방향 결정.
 */
export function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof PanelGroupPrimitive>): React.ReactElement {
  return (
    <PanelGroupPrimitive
      className={cn(
        'flex h-full w-full',
        'data-[panel-group-direction=vertical]:flex-col',
        className,
      )}
      {...props}
    />
  );
}

/**
 * ResizablePanel — 개별 패널. `defaultSize`/`minSize`/`maxSize`(%)로 크기 제어.
 * react-resizable-panels primitive 그대로 re-export.
 */
export const ResizablePanel = PanelPrimitive;

interface ResizableHandleProps extends React.ComponentPropsWithoutRef<
  typeof PanelResizeHandlePrimitive
> {
  /** 핸들 중앙에 시각 그립을 표시할지. */
  withHandle?: boolean;
}

/**
 * ResizableHandle — 패널 사이의 리사이즈 핸들.
 *
 * - 키보드: 화살표 키로 리사이즈 (react-resizable-panels가 splitter ARIA 패턴으로 처리)
 * - 시각: 1px 디바이더 + hover/focus 시 강조
 *
 * NOTE: PanelResizeHandle은 imperative ref 패턴이라 forwardRef를 쓰지 않습니다.
 * ref가 필요하면 react-resizable-panels의 useImperativeHandle API를 직접 사용하세요.
 */
export function ResizableHandle({
  className,
  withHandle = false,
  ...props
}: ResizableHandleProps): React.ReactElement {
  return (
    <PanelResizeHandlePrimitive
      className={cn(
        'relative flex shrink-0 items-center justify-center',
        'bg-border-default',
        'data-[panel-group-direction=horizontal]:w-px',
        'data-[panel-group-direction=vertical]:h-px',
        'data-[panel-group-direction=horizontal]:cursor-col-resize',
        'data-[panel-group-direction=vertical]:cursor-row-resize',
        'hover:bg-border-strong data-[resize-handle-state=drag]:bg-ring',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'transition-colors duration-fast ease-standard',
        className,
      )}
      {...props}
    >
      {withHandle ? (
        <span
          aria-hidden="true"
          className={cn(
            'absolute z-10 flex items-center justify-center',
            'size-4 bg-border-default rounded-none',
          )}
        >
          <span className="block h-2 w-px bg-foreground-muted" />
        </span>
      ) : null}
    </PanelResizeHandlePrimitive>
  );
}
