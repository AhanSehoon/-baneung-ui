import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../lib/cn';

const cardVariants = cva('flex flex-col bg-canvas text-foreground rounded-none', {
  variants: {
    variant: {
      default: '',
      outlined: 'border border-border-default',
      elevated: 'border border-border-subtle shadow-sm',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

/**
 * Card — 콘텐츠 그루핑 컨테이너.
 *
 * 합성 패턴(CardHeader / CardTitle / CardDescription / CardContent / CardFooter)으로 사용.
 *
 * @example
 *   <Card variant="outlined">
 *     <CardHeader>
 *       <CardTitle>제목</CardTitle>
 *       <CardDescription>설명</CardDescription>
 *     </CardHeader>
 *     <CardContent>본문</CardContent>
 *     <CardFooter><Button>액션</Button></CardFooter>
 *   </Card>
 */
const CardRoot = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant, ...props },
  ref,
) {
  return <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props} />;
});
CardRoot.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...props }, ref) {
    return <div ref={ref} className={cn('flex flex-col gap-1 p-6', className)} {...props} />;
  },
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(function CardTitle({ className, children, ...props }, ref) {
  return (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold tracking-tight text-foreground', className)}
      {...props}
    >
      {children}
    </h3>
  );
});
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...props }, ref) {
  return <p ref={ref} className={cn('text-sm text-foreground-muted', className)} {...props} />;
});
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardContent({ className, ...props }, ref) {
    return <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />;
  },
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...props }, ref) {
    return (
      <div ref={ref} className={cn('flex items-center gap-2 p-6 pt-0', className)} {...props} />
    );
  },
);
CardFooter.displayName = 'CardFooter';

/**
 * 합성 패턴 dot 표기 + named export 양쪽 지원.
 */
type CardComponent = typeof CardRoot & {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
};

export const Card = CardRoot as CardComponent;
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;
