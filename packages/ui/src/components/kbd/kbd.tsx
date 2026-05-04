import * as React from 'react';

import { cn } from '../../lib/cn';

/**
 * Kbd — 키보드 단축키 표시.
 * 시맨틱 `<kbd>` 사용 → 스크린리더가 "키보드 입력"으로 인식.
 *
 * @example
 *   <Kbd>⌘ K</Kbd>
 *   <span><Kbd>Ctrl</Kbd> + <Kbd>C</Kbd></span>
 */
export const Kbd = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(function Kbd(
  { className, ...props },
  ref,
) {
  return (
    <kbd
      ref={ref}
      className={cn(
        'inline-flex h-5 items-center rounded-sm border border-border-default bg-surface',
        'px-1.5 font-mono text-xs font-medium text-foreground-muted',
        className,
      )}
      {...props}
    />
  );
});
Kbd.displayName = 'Kbd';
