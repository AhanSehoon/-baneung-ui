import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../lib/cn';

/**
 * Heading — h1~h6 시맨틱 헤딩. `level`로 시맨틱과 시각 위계를 동시에 결정.
 */
const headingVariants = cva('font-semibold tracking-tight text-foreground', {
  variants: {
    level: {
      1: 'text-5xl leading-[1.2]',
      2: 'text-4xl leading-[1.2]',
      3: 'text-3xl leading-[1.2]',
      4: 'text-2xl leading-[1.2]',
      5: 'text-xl leading-[1.2]',
      6: 'text-lg leading-[1.2]',
    },
  },
  defaultVariants: { level: 1 },
});

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps
  extends
    React.HTMLAttributes<HTMLHeadingElement>,
    Omit<VariantProps<typeof headingVariants>, 'level'> {
  /** 시맨틱 레벨 + 기본 시각 위계. 시각만 바꾸려면 className으로 override. */
  level?: HeadingLevel;
  /** Slot으로 합성해 자식 element 자체로 렌더(asChild 패턴). */
  asChild?: boolean;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { level = 1, asChild = false, className, ...props },
  ref,
) {
  const Tag = asChild ? Slot : (`h${level}` as `h${HeadingLevel}`);
  return React.createElement(Tag, {
    ref,
    className: cn(headingVariants({ level }), className),
    ...props,
  });
});
Heading.displayName = 'Heading';

/**
 * Text — 본문 단락. 기본 `<p>`, asChild로 다른 inline 요소에 합성 가능.
 */
const textVariants = cva('text-foreground', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      md: 'text-md',
      lg: 'text-lg',
    },
    weight: {
      regular: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    tone: {
      default: 'text-foreground',
      muted: 'text-foreground-muted',
      subtle: 'text-foreground-subtle',
    },
  },
  defaultVariants: { size: 'base', weight: 'regular', tone: 'default' },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof textVariants> {
  asChild?: boolean;
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(function Text(
  { size, weight, tone, asChild = false, className, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'p';
  return (
    <Comp ref={ref} className={cn(textVariants({ size, weight, tone }), className)} {...props} />
  );
});
Text.displayName = 'Text';

/**
 * Lead — 도입부 큰 본문(섹션 첫 단락 등).
 */
export const Lead = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function Lead({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      className={cn('text-lg leading-[1.6] text-foreground-muted', className)}
      {...props}
    />
  );
});
Lead.displayName = 'Lead';

/**
 * Muted — 약한 보조 텍스트(캡션, 메타 정보).
 */
export const Muted = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function Muted({ className, ...props }, ref) {
  return <p ref={ref} className={cn('text-sm text-foreground-subtle', className)} {...props} />;
});
Muted.displayName = 'Muted';

/**
 * Code — 인라인 코드 스니펫. 모노스페이스 + 옅은 surface 배경.
 */
export const Code = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(function Code(
  { className, ...props },
  ref,
) {
  return (
    <code
      ref={ref}
      className={cn(
        'rounded-sm bg-surface-strong px-1.5 py-0.5 font-mono text-sm text-foreground',
        className,
      )}
      {...props}
    />
  );
});
Code.displayName = 'Code';
