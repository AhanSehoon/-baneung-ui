import * as React from 'react';

import { useReducedMotion } from '../../lib/use-reduced-motion';
import { Spinner } from '../spinner';

import type {
  AnimatedButtonProps,
  AnimatedButtonSize,
  AnimatedButtonStatus,
  AnimatedButtonVariant,
} from './types';

const SIZE_STYLES: Record<AnimatedButtonSize, React.CSSProperties> = {
  sm: { height: 32, padding: '0 12px', fontSize: 13 },
  md: { height: 40, padding: '0 16px', fontSize: 14 },
  lg: { height: 48, padding: '0 20px', fontSize: 16 },
};

const VARIANT_STYLES: Record<AnimatedButtonVariant, React.CSSProperties> = {
  primary: { background: '#1F2937', color: '#FFFFFF', border: '1px solid #1F2937' },
  secondary: { background: '#F1F3F5', color: '#1F2937', border: '1px solid #E9ECEF' },
  ghost: { background: 'transparent', color: '#1F2937', border: '1px solid #E9ECEF' },
  danger: { background: '#DC2626', color: '#FFFFFF', border: '1px solid #DC2626' },
};

const STATUS_BG_OVERRIDE: Record<AnimatedButtonStatus, string | undefined> = {
  idle: undefined,
  loading: undefined,
  success: '#16A34A', // emerald
  error: '#DC2626', // red
};

/**
 * AnimatedButton — idle / loading / success / error 상태가 부드럽게 모핑되는 버튼.
 *
 * # 동작 모드
 * 1. **Promise 자동 모드**: `onClick`이 Promise를 반환하면 내부에서 자동으로
 *    loading → success(resolved) / error(rejected) 로 전환.
 * 2. **외부 제어 모드**: `status` prop으로 직접 제어. (Promise 자동 모드와 함께 쓰면 status 우선)
 *
 * # 자동 복귀
 * - success/error 상태는 `resetMs` 후 자동으로 idle로 복귀 (기본 1800ms, 0이면 비활성).
 *
 * # a11y
 * - 상태 변화를 `aria-live="polite"`로 보조 기술에 안내.
 * - loading 시 `disabled` + `aria-disabled` 적용.
 * - `prefers-reduced-motion: reduce` 시 모핑 애니메이션 비활성, 즉시 상태 전환.
 */
export function AnimatedButton({
  children,
  onClick,
  status: statusProp,
  resetMs = 1800,
  variant = 'primary',
  size = 'md',
  loadingText,
  successText,
  errorText,
  className,
  style,
  disabled,
  type = 'button',
  ...rest
}: AnimatedButtonProps) {
  const reduced = useReducedMotion();

  // 내부 status — Promise 자동 모드용. statusProp이 있으면 무시되고 그게 우선.
  const [internalStatus, setInternalStatus] = React.useState<AnimatedButtonStatus>('idle');
  const status = statusProp ?? internalStatus;
  const isControlled = statusProp !== undefined;

  // success/error 자동 복귀 — controlled/uncontrolled 둘 다 동작.
  React.useEffect(() => {
    if (status !== 'success' && status !== 'error') return;
    if (resetMs <= 0) return;
    const id = setTimeout(() => {
      if (!isControlled) setInternalStatus('idle');
      // controlled 모드면 외부에서 idle로 돌려야 함 — 사용자 책임.
    }, resetMs);
    return () => clearTimeout(id);
  }, [status, resetMs, isControlled]);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!onClick) return;
    const result = onClick(event);
    // Promise인지 검사 — thenable이면 자동 모드 발동.
    if (result && typeof (result as Promise<unknown>).then === 'function') {
      if (!isControlled) setInternalStatus('loading');
      try {
        await result;
        if (!isControlled) setInternalStatus('success');
      } catch {
        if (!isControlled) setInternalStatus('error');
      }
    }
  };

  const isBusy = status === 'loading';
  const isDisabled = disabled || isBusy;

  // 상태별 시각 override.
  const overrideBg = STATUS_BG_OVERRIDE[status];
  const buttonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontWeight: 600,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled && status === 'idle' ? 0.6 : 1,
    transition: reduced
      ? undefined
      : 'background 220ms ease, color 220ms ease, transform 220ms cubic-bezier(.34,.07,.43,.95)',
    transform: status === 'error' && !reduced ? 'translateX(0)' : undefined,
    animation: status === 'error' && !reduced ? 'baneung-ab-shake 380ms ease-in-out' : undefined,
    borderRadius: 0,
    ...SIZE_STYLES[size],
    ...VARIANT_STYLES[variant],
    ...(overrideBg && { background: overrideBg, borderColor: overrideBg, color: '#FFFFFF' }),
    ...style,
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      aria-live="polite"
      aria-busy={isBusy || undefined}
      className={className}
      style={buttonStyle}
      {...rest}
    >
      <ButtonContent
        status={status}
        idleChildren={children}
        loadingText={loadingText}
        successText={successText}
        errorText={errorText}
      />
      <style>{`
        @keyframes baneung-ab-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
      `}</style>
    </button>
  );
}

function ButtonContent({
  status,
  idleChildren,
  loadingText,
  successText,
  errorText,
}: {
  status: AnimatedButtonStatus;
  idleChildren?: React.ReactNode;
  loadingText?: React.ReactNode;
  successText?: React.ReactNode;
  errorText?: React.ReactNode;
}) {
  if (status === 'loading') {
    return (
      <>
        <Spinner size="sm" label="처리 중" />
        {loadingText ?? idleChildren}
      </>
    );
  }
  if (status === 'success') {
    return (
      <>
        <CheckIcon />
        {successText ?? null}
      </>
    );
  }
  if (status === 'error') {
    return (
      <>
        <XIcon />
        {errorText ?? null}
      </>
    );
  }
  return <>{idleChildren}</>;
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden="true"
    >
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
    </svg>
  );
}
