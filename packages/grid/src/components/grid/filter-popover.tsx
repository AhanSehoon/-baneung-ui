import * as React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../../lib/cn';

/** null/undefined 값을 표현하는 키. UI에서는 "(필드 값 없음)"으로 표시. */
export const NULL_VALUE_KEY = '__BANEUNG_GRID_NULL__';

interface FilterPopoverProps {
  /** 헤더 funnel 버튼의 위치 (clientRect). 이 아래에 popover를 띄움. */
  anchorRect: { left: number; top: number; bottom: number; right: number };
  /** 해당 컬럼의 추출 가능한 모든 unique 값(문자열화). null은 NULL_VALUE_KEY로. */
  allValues: string[];
  /** 현재 제외(체크 해제)된 값 집합. */
  excluded: Set<string>;
  /** 확인 시 호출 — 새 제외 set 전달. */
  onApply: (next: Set<string>) => void;
  /** 닫기 (외부 클릭/Escape/취소). */
  onClose: () => void;
}

/**
 * 컬럼 필터 popover — 헤더의 funnel 버튼 클릭 시 나타나는 다중 선택 필터.
 *
 * # Portal 렌더링
 * 그리드 스크롤 컨테이너의 `overflow: auto`에 클리핑되지 않도록
 * `react-dom` portal로 `document.body`에 직접 렌더한다.
 * `anchorRect`(funnel 버튼의 위치)를 받아 fixed positioning으로 그 아래 띄움.
 *
 * # 동작
 * - draft 상태: 확인 누르기 전엔 외부 반영 X (취소 시 원복).
 * - 검색 input으로 체크박스 목록 좁히기.
 * - "(전체선택)": 보이는 항목 모두 토글.
 * - "(필드 값 없음)": null/undefined 값. NULL_VALUE_KEY로 표현.
 * - "필터 초기화": draft를 비우기 (모든 값 체크 상태).
 * - 외부 클릭 / Escape / 취소: draft 폐기하고 닫기.
 * - 확인: draft를 onApply로 전달.
 *
 * # 데이터 모델
 * 필터 상태 = "**제외할 값**의 집합". 빈 set이면 필터 없음.
 * UI에선 체크박스 checked = `!excluded.has(v)` (체크 = 표시).
 */
export function FilterPopover({
  anchorRect,
  allValues,
  excluded,
  onApply,
  onClose,
}: FilterPopoverProps) {
  const [draft, setDraft] = React.useState<Set<string>>(() => new Set(excluded));
  const [search, setSearch] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);
  // SSR safety — document.body는 client에서만 존재
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // 외부 클릭 닫기
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // Escape 닫기
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!mounted) return null;

  const lower = search.toLowerCase();
  const filteredValues = allValues.filter((v) => {
    const display = v === NULL_VALUE_KEY ? '(필드 값 없음)' : v;
    return display.toLowerCase().includes(lower);
  });
  const allChecked = filteredValues.length > 0 && filteredValues.every((v) => !draft.has(v));
  const someChecked = !allChecked && filteredValues.some((v) => !draft.has(v));

  const toggleAll = () => {
    setDraft((prev) => {
      const next = new Set(prev);
      if (allChecked) {
        filteredValues.forEach((v) => next.add(v));
      } else {
        filteredValues.forEach((v) => next.delete(v));
      }
      return next;
    });
  };

  const toggleValue = (v: string) => {
    setDraft((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });
  };

  // 위치 계산 — 화면 우측/하단 넘침 방지
  const POPOVER_W = 256; // w-64
  const POPOVER_H_EST = 380; // 대략적인 높이
  const viewW = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const viewH = typeof window !== 'undefined' ? window.innerHeight : 768;
  let left = anchorRect.left;
  if (left + POPOVER_W > viewW - 8) left = Math.max(8, viewW - POPOVER_W - 8);
  let top = anchorRect.bottom + 4;
  if (top + POPOVER_H_EST > viewH - 8) top = Math.max(8, anchorRect.top - POPOVER_H_EST - 4);

  return createPortal(
    <div
      ref={containerRef}
      role="dialog"
      aria-label="컬럼 필터"
      className="fixed z-50 flex w-64 flex-col gap-2 border border-border-default bg-canvas p-3 text-xs font-normal text-foreground shadow-md"
      style={{ top, left }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => setDraft(new Set())}
        className="self-start text-foreground-muted underline hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        ▽ 필터 초기화
      </button>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="검색"
        aria-label="필터 값 검색"
        className="w-full border border-border-default bg-canvas px-2 py-1 placeholder:text-foreground-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
      <div className="max-h-48 overflow-auto border border-border-subtle">
        <label className="flex cursor-pointer items-center gap-2 border-b border-border-subtle bg-surface px-2 py-1 hover:bg-surface-strong">
          <input
            type="checkbox"
            checked={allChecked}
            ref={(el) => {
              if (el) el.indeterminate = someChecked;
            }}
            onChange={toggleAll}
            aria-label="전체선택"
            className="h-3.5 w-3.5"
          />
          <span>(전체선택)</span>
        </label>
        {filteredValues.map((v) => (
          <label
            key={v}
            className="flex cursor-pointer items-center gap-2 px-2 py-1 hover:bg-surface"
          >
            <input
              type="checkbox"
              checked={!draft.has(v)}
              onChange={() => toggleValue(v)}
              className="h-3.5 w-3.5"
            />
            <span>{v === NULL_VALUE_KEY ? '(필드 값 없음)' : v}</span>
          </label>
        ))}
        {filteredValues.length === 0 && (
          <div className="px-2 py-2 text-foreground-subtle">검색 결과 없음</div>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            onApply(draft);
            onClose();
          }}
          className={cn(
            'border border-border-default bg-foreground px-3 py-1 text-foreground-inverse',
            'hover:bg-foreground/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          )}
        >
          확인
        </button>
        <button
          type="button"
          onClick={onClose}
          className={cn(
            'border border-border-default bg-canvas text-foreground',
            'px-3 py-1 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          )}
        >
          취소
        </button>
      </div>
    </div>,
    document.body,
  );
}
