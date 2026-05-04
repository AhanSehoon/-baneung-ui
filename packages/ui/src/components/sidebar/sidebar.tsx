import * as React from 'react';

import { cn } from '../../lib/cn';
import { useControllableState } from '../../lib/use-controllable-state';

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  /** 표시 위치. 기본 'left'. */
  side?: 'left' | 'right';
  /** controlled 펼침 상태 (true=펼침, false=접힘). */
  collapsed?: boolean;
  /** uncontrolled 초기 상태. */
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** 펼친 상태 너비(px). 기본 240. */
  width?: number;
  /** 접힌 상태 너비(px). 0이면 완전 숨김. 기본 64. */
  collapsedWidth?: number;
  /** 시맨틱 라벨 (스크린리더용). */
  'aria-label'?: string;
}

/**
 * Sidebar — 좌/우에 위치하는 collapsible 사이드 패널.
 *
 * - `<aside>` 시맨틱 — `aria-label`로 영역 명시
 * - `collapsed` controlled / uncontrolled 모두 지원
 * - SidebarTrigger로 토글 버튼 제공 (예: 햄버거 / 화살표)
 * - 모바일(sm 미만)에서 Drawer로 자동 전환은 Phase 9의 Drawer 의존 — 이번 페이즈에서는 보류
 *
 * @example
 *   <Sidebar aria-label="네비">
 *     <SidebarHeader><SidebarTrigger /></SidebarHeader>
 *     <SidebarContent>...</SidebarContent>
 *   </Sidebar>
 */
const SidebarContext = React.createContext<{
  collapsed: boolean;
  setCollapsed: (next: boolean) => void;
} | null>(null);

function useSidebar(): {
  collapsed: boolean;
  setCollapsed: (next: boolean) => void;
} {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) {
    throw new Error('Sidebar 하위 컴포넌트는 <Sidebar> 안에서만 사용해야 합니다.');
  }
  return ctx;
}

const SidebarRoot = React.forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  {
    side = 'left',
    collapsed: collapsedProp,
    defaultCollapsed = false,
    onCollapsedChange,
    width = 240,
    collapsedWidth = 64,
    className,
    style,
    children,
    ...props
  },
  ref,
) {
  const [collapsed, setCollapsed] = useControllableState<boolean>({
    prop: collapsedProp,
    defaultProp: defaultCollapsed,
    onChange: onCollapsedChange,
  });

  const ctxValue = React.useMemo(
    () => ({
      collapsed: Boolean(collapsed),
      setCollapsed: (next: boolean) => setCollapsed(next),
    }),
    [collapsed, setCollapsed],
  );

  const currentWidth = collapsed ? collapsedWidth : width;

  return (
    <SidebarContext.Provider value={ctxValue}>
      <aside
        ref={ref}
        data-collapsed={collapsed || undefined}
        data-side={side}
        className={cn(
          'flex flex-col h-full shrink-0',
          'bg-canvas text-foreground',
          side === 'left' ? 'border-r border-border-default' : 'border-l border-border-default',
          'transition-[width] duration-base ease-standard',
          'overflow-hidden',
          className,
        )}
        style={{ width: currentWidth, ...style }}
        {...props}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  );
});

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarHeader({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between gap-2 p-3 border-b border-border-default',
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarHeader.displayName = 'SidebarHeader';

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function SidebarContent({ className, ...props }, ref) {
  return <div ref={ref} className={cn('flex-1 overflow-auto p-2', className)} {...props} />;
});
SidebarContent.displayName = 'SidebarContent';

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarFooter({ className, ...props }, ref) {
    return (
      <div ref={ref} className={cn('p-3 border-t border-border-default', className)} {...props} />
    );
  },
);
SidebarFooter.displayName = 'SidebarFooter';

/**
 * SidebarTrigger — 펼침/접힘 토글 버튼.
 * Sidebar 안에서 사용해야 하며, 키보드 Space/Enter로도 동작.
 */
export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function SidebarTrigger(
  { className, onClick, children, 'aria-label': ariaLabel, ...props },
  ref,
) {
  const { collapsed, setCollapsed } = useSidebar();
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={collapsed}
      aria-label={ariaLabel ?? (collapsed ? '사이드바 펼치기' : '사이드바 접기')}
      onClick={(e) => {
        setCollapsed(!collapsed);
        onClick?.(e);
      }}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-none',
        'text-foreground-muted hover:bg-surface',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        className,
      )}
      {...props}
    >
      {children ?? (collapsed ? '›' : '‹')}
    </button>
  );
});
SidebarTrigger.displayName = 'SidebarTrigger';

/**
 * 합성 패턴 dot 표기.
 */
type SidebarComponent = typeof SidebarRoot & {
  Header: typeof SidebarHeader;
  Content: typeof SidebarContent;
  Footer: typeof SidebarFooter;
  Trigger: typeof SidebarTrigger;
};

export const Sidebar = SidebarRoot as SidebarComponent;
Sidebar.Header = SidebarHeader;
Sidebar.Content = SidebarContent;
Sidebar.Footer = SidebarFooter;
Sidebar.Trigger = SidebarTrigger;
Sidebar.displayName = 'Sidebar';
