import * as React from 'react';

import { useReducedMotion } from '../../lib/use-reduced-motion';

import type { RotatingWordsProps } from './types';

/**
 * RotatingWords — 고정 문구 뒤의 단어만 슬라이드+페이드로 순환.
 *
 * # 구현 메모 (정렬·폭 처리)
 * - CSS Grid의 `grid-template-areas: "stack"`을 사용해 모든 단어를 동일한 그리드 셀에 배치.
 *   그리드 셀은 자식의 max 사이즈로 자동 측정되므로, 컨테이너 폭이 항상 **모든 단어의
 *   실제 픽셀 폭 중 최댓값**으로 고정됨. (length로 longest 추정하면 한글처럼 같은 글자수라도
 *   폭이 다른 케이스에서 잘림 발생.)
 * - sizer 단어들은 visibility:hidden으로 폭만 기여, 시각적으론 안 보임.
 * - `verticalAlign: baseline`으로 주변 인라인 텍스트와 베이스라인 정렬.
 * - `overflow:hidden`은 슬라이드 인/아웃이 컨테이너 위/아래로 빠지는 부분 클리핑에 사용.
 *
 * # a11y
 * - `prefers-reduced-motion: reduce`면 애니메이션 없이 즉시 다음 단어로 교체.
 * - `aria-live="polite"`로 스크린리더에 변경 안내.
 */
export function RotatingWords({
  words,
  intervalMs = 2000,
  transitionMs = 400,
  loop = true,
  fontSize,
  fontWeight,
  color,
  className,
  style,
}: RotatingWordsProps) {
  const reduced = useReducedMotion();
  const [current, setCurrent] = React.useState(0);
  const [previous, setPrevious] = React.useState<number | null>(null);
  // useEffect에서 setInterval 콜백이 항상 최신 current를 보도록 ref로 mirror.
  const currentRef = React.useRef(current);
  currentRef.current = current;

  // 빈/단일 단어 케이스 — 애니메이션 없이 그대로 표시.
  const safeWords = words.length > 0 ? words : [''];

  React.useEffect(() => {
    if (safeWords.length <= 1) return;
    if (reduced) {
      // 모션 줄임: 애니메이션 없이 간단히 교체만.
      const id = window.setInterval(() => {
        setCurrent((c) => {
          if (!loop && c === safeWords.length - 1) {
            window.clearInterval(id);
            return c;
          }
          return (c + 1) % safeWords.length;
        });
      }, intervalMs);
      return () => window.clearInterval(id);
    }

    const id = window.setInterval(() => {
      // loop=false면 마지막 단어 도달 시 정지.
      if (!loop && currentRef.current === safeWords.length - 1) {
        window.clearInterval(id);
        return;
      }
      setPrevious(currentRef.current);
      setCurrent((c) => (c + 1) % safeWords.length);
      // 전환 끝나면 previous 정리 — DOM 누적 방지.
      window.setTimeout(() => setPrevious(null), transitionMs);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [safeWords, intervalMs, transitionMs, loop, reduced]);

  const containerStyle: React.CSSProperties = {
    // inline-grid + single-area로 자식들이 같은 셀에 겹침 → 셀이 max(자식 폭/높이)로 자동 사이징.
    display: 'inline-grid',
    gridTemplateAreas: '"stack"',
    verticalAlign: 'baseline',
    overflow: 'hidden',
    lineHeight: 1.15,
    fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    fontWeight,
    color,
    ...style,
  };

  // grid cell 안의 자식 공통 스타일 — 모두 같은 area에 배치.
  const cellStyle: React.CSSProperties = {
    gridArea: 'stack',
    whiteSpace: 'nowrap',
  };

  return (
    <span className={className} style={containerStyle} aria-live="polite" aria-atomic="true">
      {/* Sizers — 모든 단어를 visibility:hidden으로 렌더해서 컨테이너가 최대 폭을 잡도록.
          length가 아닌 실제 픽셀 폭 기준 → 한글 등 가변 폭 글자도 안전. */}
      {safeWords.map((w, i) => (
        <span key={`sizer-${i}`} aria-hidden="true" style={{ ...cellStyle, visibility: 'hidden' }}>
          {w}
        </span>
      ))}

      {/* 이전 단어 (전환 중에만 렌더) — 위로 슬라이드 + 페이드 아웃. */}
      {previous !== null && previous !== current && (
        <span
          key={`prev-${previous}-${current}`}
          aria-hidden="true"
          style={{
            ...cellStyle,
            animation: `baneung-rw-out ${transitionMs}ms ease forwards`,
          }}
        >
          {safeWords[previous]}
        </span>
      )}

      {/* 현재 단어 — 아래에서 위로 슬라이드 + 페이드 인. key 변경으로 매번 animation 재시작. */}
      <span
        key={`cur-${current}`}
        style={{
          ...cellStyle,
          animation: reduced ? undefined : `baneung-rw-in ${transitionMs}ms ease forwards`,
        }}
      >
        {safeWords[current]}
      </span>

      <style>{`
        @keyframes baneung-rw-in {
          0% { opacity: 0; transform: translateY(0.45em); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes baneung-rw-out {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-0.45em); }
        }
      `}</style>
    </span>
  );
}
