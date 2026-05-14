import * as React from 'react';

import { cn } from '../../lib/cn';

interface EditableCellProps {
  /** 현재 표시 값. */
  value: unknown;
  /** 비편집 시 표시되는 노드. */
  display: React.ReactNode;
  /** 정렬 — input의 text-align에도 적용. */
  align?: 'left' | 'center' | 'right';
  /** 편집 commit 콜백. 새 string 값을 받는다 (caller가 type 변환 책임). */
  onCommit: (next: string) => void;
}

/**
 * 더블클릭 → input 전환, Enter/blur로 commit, Escape로 cancel.
 *
 * # 키보드/포커스
 * - 더블클릭으로 진입 (네이티브 dblclick — 마우스 사용자만)
 * - Enter: commit
 * - Escape: cancel
 * - blur: commit (다른 곳 클릭 시)
 * - 자동 포커스 + 전체 선택 (rapid edit 흐름 위해)
 *
 * # 한글 IME
 * - composition 중에는 Enter가 commit이 아니라 한글 조합 확정 키이므로
 *   `e.nativeEvent.isComposing` 가드로 보호.
 */
export function EditableCell({ value, display, align, onCommit }: EditableCellProps) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  // 편집 진입 시 현재 값을 draft에 복사 + 자동 포커스/전체선택
  React.useEffect(() => {
    if (editing) {
      setDraft(value === null || value === undefined ? '' : String(value));
    }
  }, [editing, value]);

  React.useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const enter = () => setEditing(true);
  const cancel = () => setEditing(false);
  const commit = () => {
    setEditing(false);
    onCommit(draft);
  };

  if (!editing) {
    return (
      <div
        onDoubleClick={enter}
        className={cn(
          'min-h-[1.5rem] cursor-text',
          align === 'right' && 'text-right',
          align === 'center' && 'text-center',
          (!align || align === 'left') && 'text-left',
        )}
        title="더블클릭하여 편집"
      >
        {display}
      </div>
    );
  }

  // 편집 모드: input을 부모 td의 inset-0에 absolute로 깔아 셀 전체를 꽉 채운다
  // (AUIGrid 스타일). td는 항상 relative여야 한다 (grid.tsx에서 보장).
  // 부모 td 높이가 input absolute로 인해 collapse되지 않도록 invisible
  // placeholder를 같이 렌더해서 원래 표시 노드의 크기를 유지한다.
  return (
    <>
      <span aria-hidden="true" className="invisible block min-h-[1.5rem]">
        {display ?? ' '}
      </span>
      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          // IME 조합 중 Enter는 commit이 아니라 한글 조합 확정 — 무시한다.
          if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            e.preventDefault();
            commit();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            cancel();
          }
        }}
        onBlur={commit}
        className={cn(
          // 셀 가장자리까지 꽉 차도록 absolute inset-0. 내부 padding은 셀 padding과 동일하게.
          'absolute inset-0 z-10 box-border w-full bg-canvas px-3 py-2 text-foreground',
          'border-2 border-ring outline-none',
          align === 'right' && 'text-right',
          align === 'center' && 'text-center',
        )}
        aria-label="셀 편집"
      />
    </>
  );
}
