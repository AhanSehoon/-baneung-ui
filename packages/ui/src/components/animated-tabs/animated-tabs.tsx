import * as React from 'react';

import { useControllableState } from '../../lib/use-controllable-state';
import { useReducedMotion } from '../../lib/use-reduced-motion';

import type { AnimatedTabsProps, AnimatedTabsSize } from './types';

const SIZE_MAP: Record<AnimatedTabsSize, { font: number; pad: string; gap: number; bar: number }> =
  {
    sm: { font: 13, pad: '6px 10px', gap: 4, bar: 2 },
    md: { font: 14, pad: '8px 14px', gap: 6, bar: 2 },
    lg: { font: 15, pad: '10px 16px', gap: 8, bar: 3 },
  };

/**
 * AnimatedTabs — 활성 탭 아래(또는 옆) 인디케이터가 부드럽게 미끄러지는 탭.
 *
 * # ARIA + 키보드
 * - 컨테이너 `role="tablist"` + `aria-orientation`
 * - 각 버튼 `role="tab"` + `aria-selected` + `aria-controls`
 * - 각 패널 `role="tabpanel"` + `aria-labelledby` + `tabIndex={0}`
 * - **ArrowLeft/Right** (horizontal) / **ArrowUp/Down** (vertical) 키로 이동
 * - **Home / End**로 첫/마지막 탭
 * - disabled 탭은 키보드 이동 시 자동 skip
 *
 * # 인디케이터
 * - 활성 탭의 DOM rect를 측정 → 인디케이터를 그 위치로 transform.
 * - resize / 항목 변경 시 ResizeObserver로 재측정.
 *
 * # a11y
 * - `prefers-reduced-motion: reduce` 시 인디케이터 transition 비활성 (즉시 점프).
 */
export function AnimatedTabs({
  items,
  value: valueProp,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  size = 'md',
  indicatorColor = '#1F2937',
  activeColor = '#1F2937',
  duration = 250,
  className,
  style,
}: AnimatedTabsProps) {
  const reduced = useReducedMotion();
  const dims = SIZE_MAP[size];
  const isHorizontal = orientation === 'horizontal';

  const firstEnabled = items.find((i) => !i.disabled)?.value ?? items[0]?.value ?? '';
  const [valueRaw, setValue] = useControllableState<string>({
    prop: valueProp,
    defaultProp: defaultValue ?? firstEnabled,
    onChange: onValueChange,
  });
  const value = valueRaw ?? firstEnabled;

  // 자동 id prefix — 같은 페이지에 여러 인스턴스 있어도 unique.
  const idPrefix = React.useId();
  const tabId = (v: string) => `${idPrefix}-tab-${v}`;
  const panelId = (v: string) => `${idPrefix}-panel-${v}`;

  // 탭 버튼 ref 모음 — DOM 측정 + 키보드 포커스 이동에 사용.
  const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const listRef = React.useRef<HTMLDivElement>(null);

  // 인디케이터 위치 — DOM rect 측정.
  const [indicator, setIndicator] = React.useState<{ offset: number; size: number }>({
    offset: 0,
    size: 0,
  });

  const measureIndicator = React.useCallback(() => {
    const list = listRef.current;
    const tab = tabRefs.current[value];
    if (!list || !tab) return;
    const listRect = list.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    if (isHorizontal) {
      setIndicator({ offset: tabRect.left - listRect.left, size: tabRect.width });
    } else {
      setIndicator({ offset: tabRect.top - listRect.top, size: tabRect.height });
    }
  }, [value, isHorizontal]);

  React.useLayoutEffect(() => {
    measureIndicator();
  }, [measureIndicator, items.length]);

  React.useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const list = listRef.current;
    if (!list) return;
    const ro = new ResizeObserver(measureIndicator);
    ro.observe(list);
    return () => ro.disconnect();
  }, [measureIndicator]);

  // 키보드 — 다음/이전 활성 탭으로 이동.
  function moveBy(delta: 1 | -1) {
    const enabled = items.filter((i) => !i.disabled);
    if (enabled.length === 0) return;
    const currentIdx = enabled.findIndex((i) => i.value === value);
    const nextIdx = (currentIdx + delta + enabled.length) % enabled.length;
    const next = enabled[nextIdx];
    if (next) {
      setValue(next.value);
      // 다음 frame에 포커스 이동.
      requestAnimationFrame(() => tabRefs.current[next.value]?.focus());
    }
  }

  function moveTo(idx: 'first' | 'last') {
    const enabled = items.filter((i) => !i.disabled);
    const target = idx === 'first' ? enabled[0] : enabled[enabled.length - 1];
    if (target) {
      setValue(target.value);
      requestAnimationFrame(() => tabRefs.current[target.value]?.focus());
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    if (e.key === nextKey) {
      e.preventDefault();
      moveBy(1);
    } else if (e.key === prevKey) {
      e.preventDefault();
      moveBy(-1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      moveTo('first');
    } else if (e.key === 'End') {
      e.preventDefault();
      moveTo('last');
    }
  }

  const activeItem = items.find((i) => i.value === value);

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'column' : 'row',
        gap: 16,
        ...style,
      }}
    >
      {/* tablist */}
      <div
        ref={listRef}
        role="tablist"
        aria-orientation={orientation}
        style={{
          position: 'relative',
          display: 'inline-flex',
          flexDirection: isHorizontal ? 'row' : 'column',
          gap: dims.gap,
          borderBottom: isHorizontal ? '1px solid #E9ECEF' : 'none',
          borderRight: !isHorizontal ? '1px solid #E9ECEF' : 'none',
          fontSize: dims.font,
        }}
      >
        {items.map((item) => {
          const selected = item.value === value;
          return (
            <button
              key={item.value}
              ref={(el) => {
                tabRefs.current[item.value] = el;
              }}
              type="button"
              role="tab"
              id={tabId(item.value)}
              aria-controls={panelId(item.value)}
              aria-selected={selected}
              aria-disabled={item.disabled || undefined}
              disabled={item.disabled}
              tabIndex={selected ? 0 : -1}
              onClick={() => !item.disabled && setValue(item.value)}
              onKeyDown={handleKeyDown}
              style={{
                padding: dims.pad,
                background: 'transparent',
                color: selected ? activeColor : '#6B7280',
                border: 'none',
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                opacity: item.disabled ? 0.4 : 1,
                fontWeight: selected ? 600 : 500,
                outline: 'none',
                transition: reduced ? undefined : 'color 200ms ease',
                whiteSpace: 'nowrap',
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `inset 0 0 0 2px ${withAlpha(indicatorColor, 0.25)}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {item.label}
            </button>
          );
        })}

        {/* indicator — 가로면 아래, 세로면 우측. */}
        <span
          aria-hidden="true"
          style={
            isHorizontal
              ? {
                  position: 'absolute',
                  left: 0,
                  bottom: -1, // border 위로 올라가기
                  height: dims.bar,
                  width: indicator.size,
                  transform: `translateX(${indicator.offset}px)`,
                  background: indicatorColor,
                  transition: reduced
                    ? undefined
                    : `transform ${duration}ms cubic-bezier(.4,0,.2,1), width ${duration}ms cubic-bezier(.4,0,.2,1)`,
                }
              : {
                  position: 'absolute',
                  top: 0,
                  right: -1,
                  width: dims.bar,
                  height: indicator.size,
                  transform: `translateY(${indicator.offset}px)`,
                  background: indicatorColor,
                  transition: reduced
                    ? undefined
                    : `transform ${duration}ms cubic-bezier(.4,0,.2,1), height ${duration}ms cubic-bezier(.4,0,.2,1)`,
                }
          }
        />
      </div>

      {/* tabpanels — 활성 항목만 렌더 (간단함, 상태 보존이 필요하면 hidden 패턴으로 변경 가능). */}
      {activeItem && (
        <div
          role="tabpanel"
          id={panelId(activeItem.value)}
          aria-labelledby={tabId(activeItem.value)}
          tabIndex={0}
          style={{ outline: 'none' }}
        >
          {activeItem.content}
        </div>
      )}
    </div>
  );
}

function withAlpha(hex: string, alpha: number): string {
  if (!hex.startsWith('#') || hex.length !== 7) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
