import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as React from 'react';

import { cn } from '../../lib/cn';

/**
 * Accordion — Radix Accordion 기반 펼침/접힘 컨테이너.
 *
 * - `type="single"` (한 번에 하나) / `type="multiple"` (여러 개 동시) 모드
 * - `collapsible`: single 모드에서 모두 닫힌 상태를 허용할지
 * - 키보드: ↑↓ 트리거 이동, Home/End 처음/끝, Space/Enter 토글
 * - 기본 `w-full` — 펼침/닫힘 시 컨테이너 너비가 콘텐츠에 따라 변하지 않도록
 *   부모 너비에 고정. 좁은 폭이 필요하면 `className`으로 덮어쓰세요.
 *
 * `type` discriminated union을 보존하려면 컴포넌트 시그니처가 Radix의 Root와
 * 동일해야 합니다 → forwardRef 결과를 `typeof AccordionPrimitive.Root`로 캐스트.
 */
const AccordionInner = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(function Accordion({ className, ...props }, ref) {
  return (
    <AccordionPrimitive.Root
      ref={ref}
      className={cn('w-full', className)}
      {...(props as React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>)}
    />
  );
});
AccordionInner.displayName = 'Accordion';

export const Accordion = AccordionInner as unknown as typeof AccordionPrimitive.Root;

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(function AccordionItem({ className, ...props }, ref) {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn('border-b border-border-default', className)}
      {...props}
    />
  );
});
AccordionItem.displayName = 'AccordionItem';

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(function AccordionTrigger({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          'flex flex-1 items-center justify-between gap-2',
          'py-4 text-sm font-medium text-foreground',
          'transition-colors duration-fast ease-standard',
          'hover:text-foreground',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          // 화살표 회전
          '[&[data-state=open]>svg]:rotate-180',
          className,
        )}
        {...props}
      >
        {children}
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="size-4 shrink-0 opacity-60 transition-transform duration-base ease-standard"
        >
          <path d="M4 6l4 4 4-4" strokeLinecap="square" />
        </svg>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});
AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(function AccordionContent({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        'overflow-hidden text-sm text-foreground-muted',
        'data-[state=open]:animate-[accordion-open_200ms_cubic-bezier(0.2,0,0,1)]',
        'data-[state=closed]:animate-[accordion-close_200ms_cubic-bezier(0.2,0,0,1)]',
        className,
      )}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
      {/* 콘텐츠 높이 기반 애니메이션 (Radix가 --radix-accordion-content-height 제공) */}
      <style>{`
        @keyframes accordion-open {
          from { height: 0 }
          to { height: var(--radix-accordion-content-height) }
        }
        @keyframes accordion-close {
          from { height: var(--radix-accordion-content-height) }
          to { height: 0 }
        }
      `}</style>
    </AccordionPrimitive.Content>
  );
});
AccordionContent.displayName = 'AccordionContent';
