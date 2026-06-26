import * as React from 'react';

/**
 * IntersectionObserver 기반 in-view 감지 훅.
 *
 * # 동작
 * - 항상 `false`로 시작 → 첫 paint 후 mount/inView 시점에 `true`로 전환.
 *   → CSS transition/animation의 "값 변화"가 트리거되어 효과가 실제로 재생됨.
 * - mount 트리거 (`enabled=false`): 첫 paint 직후 즉시 `true`.
 * - inView 트리거 (`enabled=true`): IntersectionObserver가 화면 진입을 감지하면 `true`.
 *   한 번 보이고 나면 옵저버 해제 (1회 발사).
 *
 * @param enabled true면 IntersectionObserver로 감지, false면 mount 즉시 발사.
 * @param threshold 화면에 얼마나 들어왔을 때 발사할지 (0~1). 기본 0.15.
 *
 * @example
 *   const ref = React.useRef<HTMLDivElement>(null);
 *   const inView = useInView(ref, trigger === 'inView', 0.2);
 */
export function useInView<T extends Element>(
  ref: React.RefObject<T | null>,
  enabled: boolean,
  threshold = 0.15,
): boolean {
  // 핵심: 항상 false로 시작 → 첫 paint 후 true로 → transition/animation이 정상 발사.
  // (true로 시작하면 첫 렌더부터 final state라 시각적 변화가 없어 효과가 안 보임.)
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (!enabled) {
      // mount 트리거: 다음 frame에 true로 전환.
      // rAF로 "현재 paint 이후"임을 보장 → 브라우저가 시작 상태를 한 번 그리고 나서
      // 변경된 final state로의 transition을 인식.
      const id = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(id);
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      // SSR 또는 IO 미지원 환경 — fallback으로 즉시 발사.
      const id = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, enabled, threshold]);

  return inView;
}
