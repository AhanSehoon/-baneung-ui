import * as React from 'react';

import { useReducedMotion } from '../../lib/use-reduced-motion';

import type { CopyButtonProps, CopyButtonSize } from './types';

const SIZE_MAP: Record<CopyButtonSize, { icon: number; pad: string; font: number; h: number }> = {
  sm: { icon: 14, pad: '4px 8px', font: 12, h: 28 },
  md: { icon: 16, pad: '6px 10px', font: 13, h: 32 },
  lg: { icon: 18, pad: '8px 12px', font: 14, h: 36 },
};

/**
 * CopyButton — 클릭 시 navigator.clipboard로 복사 + 아이콘이 copy → check로 모핑.
 *
 * # 동작
 * - 클릭 → clipboard.writeText → 성공 시 'copied' 상태 (duration ms) → idle 복귀.
 * - 실패 시 onError 콜백 (clipboard 미지원, 권한 거부 등).
 *
 * # a11y
 * - `aria-label` 동적 변경 — 'Copy' → 'Copied!'.
 * - 상태 변화를 `aria-live="polite"` (툴팁)으로 안내.
 * - `prefers-reduced-motion: reduce` 시 모핑 없이 즉시 전환.
 */
export function CopyButton({
  value,
  onCopied,
  onError,
  duration = 1800,
  size = 'md',
  showTooltip = true,
  tooltipLabel = 'Copied!',
  iconOnly = false,
  children,
  className,
  style,
  disabled,
  type = 'button',
  ...rest
}: CopyButtonProps) {
  const reduced = useReducedMotion();
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const sz = SIZE_MAP[size];

  // cleanup on unmount.
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  async function handleClick() {
    if (disabled) return;
    try {
      // navigator.clipboard는 secure context (HTTPS or localhost)에서만 동작.
      if (typeof navigator === 'undefined' || !navigator.clipboard) {
        throw new Error('Clipboard API not available');
      }
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopied?.(value);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), duration);
    } catch (err) {
      onError?.(err);
    }
  }

  const buttonStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: sz.h,
    padding: iconOnly ? '0' : sz.pad,
    width: iconOnly ? sz.h : undefined,
    fontSize: sz.font,
    fontWeight: 600,
    background: 'transparent',
    color: copied ? '#16A34A' : '#1F2937',
    border: `1px solid ${copied ? '#16A34A' : '#E9ECEF'}`,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: reduced ? undefined : 'color 200ms ease, border-color 200ms ease',
    borderRadius: 0,
    ...style,
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      aria-label={copied ? tooltipLabel : 'Copy to clipboard'}
      aria-live="polite"
      className={className}
      style={buttonStyle}
      {...rest}
    >
      {/* 아이콘 컨테이너 — 두 아이콘을 절대 위치로 겹쳐서 fade-cross. */}
      <span
        aria-hidden="true"
        style={{
          position: 'relative',
          display: 'inline-block',
          width: sz.icon,
          height: sz.icon,
        }}
      >
        <span
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: copied ? 0 : 1,
            transform: copied ? 'scale(0.6)' : 'scale(1)',
            transition: reduced ? undefined : 'opacity 180ms ease, transform 220ms ease',
          }}
        >
          <CopyIcon size={sz.icon} />
        </span>
        <span
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: copied ? 1 : 0,
            transform: copied ? 'scale(1)' : 'scale(0.6)',
            transition: reduced ? undefined : 'opacity 180ms ease, transform 220ms ease',
          }}
        >
          <CheckIcon size={sz.icon} />
        </span>
      </span>

      {/* 라벨 — iconOnly가 아니면 표시. copied 시 children → tooltipLabel로 잠시 교체. */}
      {!iconOnly && <span>{copied && showTooltip ? tooltipLabel : children}</span>}

      {/* iconOnly + showTooltip + copied: floating 툴팁 */}
      {iconOnly && showTooltip && copied && (
        <span
          role="status"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '4px 8px',
            background: '#0a0e1a',
            color: '#FFFFFF',
            fontSize: 11,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            opacity: 1,
            animation: reduced ? undefined : 'baneung-cb-tooltip 180ms ease',
          }}
        >
          {tooltipLabel}
        </span>
      )}

      <style>{`
        @keyframes baneung-cb-tooltip {
          from { opacity: 0; transform: translate(-50%, 4px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </button>
  );
}

function CopyIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="9" y="9" width="13" height="13" rx="0" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
