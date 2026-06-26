import * as React from 'react';

/**
 * `prefers-reduced-motion: reduce` 미디어쿼리 추적 훅.
 *
 * 모든 이펙트 컴포넌트가 이 훅을 사용해 a11y 일관성 유지.
 * SSR에서는 false로 시작 (모션 허용 가정) — hydration 후 실제 값으로 보정.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
