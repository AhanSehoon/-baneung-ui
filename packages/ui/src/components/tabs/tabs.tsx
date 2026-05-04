import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';

import { cn } from '../../lib/cn';

/**
 * Tabs — Radix Tabs 기반 탭.
 *
 * - `orientation="horizontal" | "vertical"` (기본 horizontal)
 * - 키보드: ←→ (horizontal) / ↑↓ (vertical), Home/End 처음/끝, Tab은 panel로 진입
 * - controlled(`value`) / uncontrolled(`defaultValue`) 양쪽
 *
 * @example
 *   <Tabs defaultValue="overview">
 *     <TabsList>
 *       <TabsTrigger value="overview">개요</TabsTrigger>
 *       <TabsTrigger value="details">상세</TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="overview">...</TabsContent>
 *     <TabsContent value="details">...</TabsContent>
 *   </Tabs>
 */
const TabsRoot = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(function Tabs({ className, orientation = 'horizontal', ...props }, ref) {
  return (
    <TabsPrimitive.Root
      ref={ref}
      orientation={orientation}
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'flex-col gap-2' : 'flex-row gap-4',
        className,
      )}
      {...props}
    />
  );
});
TabsRoot.displayName = 'Tabs';

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(function TabsList({ className, ...props }, ref) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        'inline-flex items-center border-b border-border-default',
        'data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-b-0',
        'data-[orientation=vertical]:border-r',
        className,
      )}
      {...props}
    />
  );
});
TabsList.displayName = 'TabsList';

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(function TabsTrigger({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center px-4 py-2 text-sm font-medium',
        'text-foreground-muted hover:text-foreground',
        'transition-colors duration-fast ease-standard',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'disabled:pointer-events-none disabled:opacity-60',
        // 활성 탭은 brand-strong 보더 + foreground 텍스트
        'data-[state=active]:text-foreground',
        'data-[state=active]:border-b-2 data-[state=active]:-mb-px data-[state=active]:border-foreground',
        'data-[orientation=vertical]:data-[state=active]:border-b-0',
        'data-[orientation=vertical]:data-[state=active]:-mb-0',
        'data-[orientation=vertical]:data-[state=active]:border-r-2',
        'data-[orientation=vertical]:data-[state=active]:-mr-px',
        className,
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(function TabsContent({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        'flex-1 outline-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        className,
      )}
      {...props}
    />
  );
});
TabsContent.displayName = 'TabsContent';

/**
 * 합성 패턴 dot 표기 + named export 양쪽 지원.
 */
type TabsComponent = typeof TabsRoot & {
  List: typeof TabsList;
  Trigger: typeof TabsTrigger;
  Content: typeof TabsContent;
};

export const Tabs = TabsRoot as TabsComponent;
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
