import * as React from 'react';

import { Icons, type IconName } from './icons';
import { cn } from '../../lib/cn';

import type { ActiveFormats, ToolbarItem } from './types';

/**
 * 에디터 툴바. 버튼은 실제 명령 실행을 부모(editor)에 위임하고, 부모가 내려준
 * `active` 상태로 토글 표시만 담당한다. mousedown에서 preventDefault해 본문
 * 셀렉션이 풀리지 않도록 한다(WYSIWYG 툴바의 핵심 디테일).
 */

interface ToolbarProps {
  groups: ToolbarItem[][];
  active: ActiveFormats;
  disabled?: boolean;
  isFullscreen: boolean;
  isSourceMode: boolean;
  onAction: (item: ToolbarItem, value?: string) => void;
}

const BLOCK_OPTIONS: { label: string; value: string }[] = [
  { label: '본문', value: 'p' },
  { label: '제목 1', value: 'h1' },
  { label: '제목 2', value: 'h2' },
  { label: '제목 3', value: 'h3' },
  { label: '인용구', value: 'blockquote' },
  { label: '코드', value: 'pre' },
];

const FONT_SIZE_OPTIONS: { label: string; value: string }[] = [
  { label: '아주 작게', value: '1' },
  { label: '작게', value: '2' },
  { label: '보통', value: '3' },
  { label: '약간 크게', value: '4' },
  { label: '크게', value: '5' },
  { label: '매우 크게', value: '6' },
  { label: '최대', value: '7' },
];

const TITLES: Record<string, string> = {
  undo: '실행 취소 (Ctrl+Z)',
  redo: '다시 실행 (Ctrl+Y)',
  bold: '굵게 (Ctrl+B)',
  italic: '기울임 (Ctrl+I)',
  underline: '밑줄 (Ctrl+U)',
  strikethrough: '취소선',
  foreColor: '글자 색',
  backColor: '형광펜',
  bulletList: '글머리 기호 목록',
  orderedList: '번호 매기기 목록',
  indent: '들여쓰기',
  outdent: '내어쓰기',
  alignLeft: '왼쪽 정렬',
  alignCenter: '가운데 정렬',
  alignRight: '오른쪽 정렬',
  alignJustify: '양쪽 정렬',
  link: '링크 (Ctrl+K)',
  unlink: '링크 제거',
  image: '이미지 삽입',
  horizontalRule: '구분선',
  blockquote: '인용구',
  codeBlock: '코드 블록',
  clearFormat: '서식 지우기',
  fullscreen: '전체 화면',
  sourceCode: 'HTML 소스',
};

/** ToolbarItem → 활성 상태 키 매핑 (토글 버튼만). */
const ACTIVE_KEY: Partial<Record<ToolbarItem, keyof ActiveFormats>> = {
  bold: 'bold',
  italic: 'italic',
  underline: 'underline',
  strikethrough: 'strikethrough',
  bulletList: 'bulletList',
  orderedList: 'orderedList',
  alignLeft: 'alignLeft',
  alignCenter: 'alignCenter',
  alignRight: 'alignRight',
  alignJustify: 'alignJustify',
};

const buttonBase = cn(
  'inline-flex h-8 min-w-8 items-center justify-center px-1.5',
  'text-foreground-muted hover:bg-surface hover:text-foreground',
  'transition-colors duration-fast ease-standard',
  'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring',
  'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent',
);

function ToolbarButton({
  item,
  icon,
  active,
  disabled,
  onAction,
  label,
}: {
  item: ToolbarItem;
  icon: IconName;
  active?: boolean;
  disabled?: boolean;
  onAction: ToolbarProps['onAction'];
  label?: string;
}) {
  const Icon = Icons[icon];
  return (
    <button
      type="button"
      // mousedown 단계에서 막아야 본문 셀렉션이 유지된다.
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onAction(item)}
      disabled={disabled}
      aria-label={label ?? TITLES[item] ?? item}
      aria-pressed={active}
      title={label ?? TITLES[item]}
      className={cn(buttonBase, active && 'bg-surface-strong text-foreground')}
    >
      <Icon />
    </button>
  );
}

/** 네이티브 color input을 감싼 색상 버튼. */
function ColorButton({
  item,
  icon,
  disabled,
  onAction,
}: {
  item: ToolbarItem;
  icon: IconName;
  disabled?: boolean;
  onAction: ToolbarProps['onAction'];
}) {
  const Icon = Icons[icon];
  return (
    <label
      className={cn(
        buttonBase,
        'relative cursor-pointer',
        disabled && 'pointer-events-none opacity-40',
      )}
      title={TITLES[item]}
    >
      <Icon />
      <input
        type="color"
        disabled={disabled}
        aria-label={TITLES[item]}
        // mousedown 단계에서 막아야 본문 셀렉션이 풀리지 않는다(색상은 selection 기준 적용).
        onMouseDown={(e) => e.preventDefault()}
        onChange={(e) => onAction(item, e.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </label>
  );
}

const selectBase = cn(
  'h-8 border border-border-default bg-canvas px-2 text-xs text-foreground',
  'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring',
  'disabled:cursor-not-allowed disabled:opacity-40',
);

export function Toolbar({
  groups,
  active,
  disabled,
  isFullscreen,
  isSourceMode,
  onAction,
}: ToolbarProps) {
  const renderItem = (item: ToolbarItem, key: string): React.ReactNode => {
    if (item === 'separator') {
      return (
        <span key={key} aria-hidden className="mx-0.5 h-5 w-px self-center bg-border-subtle" />
      );
    }

    if (item === 'blockFormat') {
      const current = BLOCK_OPTIONS.some((o) => o.value === active.block) ? active.block : 'p';
      return (
        <select
          key={key}
          value={current}
          disabled={disabled}
          aria-label="문단 형식"
          title="문단 형식"
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => onAction('blockFormat', e.target.value)}
          className={cn(selectBase, 'min-w-[5.5rem]')}
        >
          {BLOCK_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    }

    if (item === 'fontSize') {
      return (
        <select
          key={key}
          defaultValue="3"
          disabled={disabled}
          aria-label="글자 크기"
          title="글자 크기"
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => onAction('fontSize', e.target.value)}
          className={cn(selectBase, 'min-w-[5rem]')}
        >
          {FONT_SIZE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    }

    if (item === 'foreColor' || item === 'backColor') {
      return (
        <ColorButton key={key} item={item} icon={item} disabled={disabled} onAction={onAction} />
      );
    }

    // 토글/액션 버튼 — 아이콘 이름은 item과 동일.
    const activeKey = ACTIVE_KEY[item];
    const isActive =
      (activeKey ? active[activeKey] : false) ||
      (item === 'fullscreen' && isFullscreen) ||
      (item === 'sourceCode' && isSourceMode) ||
      (item === 'blockquote' && active.block === 'blockquote') ||
      (item === 'codeBlock' && active.block === 'pre');

    // sourceCode/fullscreen 토글은 readOnly여도 사용 가능해야 한다.
    const itemDisabled = disabled && item !== 'fullscreen' && item !== 'sourceCode';

    return (
      <ToolbarButton
        key={key}
        item={item}
        icon={item as IconName}
        active={!!isActive}
        disabled={itemDisabled}
        onAction={onAction}
        label={
          item === 'fullscreen' && isFullscreen
            ? '전체 화면 종료'
            : item === 'sourceCode' && isSourceMode
              ? '에디터로 돌아가기'
              : undefined
        }
      />
    );
  };

  return (
    <div
      role="toolbar"
      aria-label="서식 도구 모음"
      className={cn(
        'flex flex-wrap items-center gap-0.5 border-b border-border-default bg-canvas p-1.5',
      )}
    >
      {groups.map((group, gi) => (
        <React.Fragment key={gi}>
          {gi > 0 && <span aria-hidden className="mx-0.5 h-5 w-px self-center bg-border-subtle" />}
          <div className="flex flex-wrap items-center gap-0.5">
            {group.map((item, ii) => renderItem(item, `${gi}-${ii}`))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
