import * as React from 'react';

import { applyLink, commands, readActiveFormats } from './commands';
import { extractImageFiles, insertImageFiles } from './image';
import { sanitizeHtml } from './sanitize';
import { placeCaretAtEnd, restoreSelection, saveSelection } from './selection';
import { Toolbar } from './toolbar';
import { cn } from '../../lib/cn';

import type { ActiveFormats, EditorHandle, EditorProps, ToolbarConfig, ToolbarItem } from './types';

/** 기본 전체 툴바 — 그룹별로 구분. */
const DEFAULT_TOOLBAR: ToolbarItem[][] = [
  ['undo', 'redo'],
  ['blockFormat', 'fontSize'],
  ['bold', 'italic', 'underline', 'strikethrough'],
  ['foreColor', 'backColor'],
  ['bulletList', 'orderedList', 'outdent', 'indent'],
  ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify'],
  ['link', 'unlink', 'image'],
  ['blockquote', 'codeBlock', 'horizontalRule'],
  ['clearFormat'],
  ['sourceCode', 'fullscreen'],
];

const EMPTY_VARIANTS = new Set([
  '',
  '<br>',
  '<p></p>',
  '<p><br></p>',
  '<div></div>',
  '<div><br></div>',
]);

function isEmptyHtml(html: string): boolean {
  return EMPTY_VARIANTS.has(html.trim().toLowerCase());
}

/** ToolbarConfig를 항상 그룹(2차원)으로 정규화. */
function normalizeToolbar(config: ToolbarConfig | false | undefined): ToolbarItem[][] {
  if (config === false) return [];
  if (!config) return DEFAULT_TOOLBAR;
  if (config.length === 0) return [];
  return Array.isArray(config[0]) ? (config as ToolbarItem[][]) : [config as ToolbarItem[]];
}

const INITIAL_ACTIVE: ActiveFormats = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  bulletList: false,
  orderedList: false,
  alignLeft: false,
  alignCenter: false,
  alignRight: false,
  alignJustify: false,
  block: 'p',
};

/**
 * Editor — contentEditable 기반 리치 텍스트 WYSIWYG 에디터.
 *
 * # 기능
 * - 굵게/기울임/밑줄/취소선, 글자색/형광펜, 글자 크기
 * - 제목·인용구·코드 블록, 목록(글머리/번호), 들여쓰기, 정렬
 * - 링크, 이미지(파일 선택·붙여넣기·드래그앤드롭), 구분선
 * - 실행취소/다시실행, 서식 지우기, HTML 소스 보기, 전체 화면
 *
 * # 제어/비제어
 * - `value`+`onChange`로 제어, 또는 `defaultValue`로 비제어.
 *
 * # 이미지
 * - 기본은 base64 data URL 인라인 삽입(서버 불필요).
 * - `onImageUpload`를 주면 File을 업로드하고 반환 URL을 삽입.
 *
 * # 반응형
 * - 툴바는 폭이 좁으면 자동 줄바꿈, 이미지는 max-width:100%.
 */
export const Editor = React.forwardRef<EditorHandle, EditorProps>(function Editor(
  {
    value,
    defaultValue,
    onChange,
    placeholder = '내용을 입력하세요…',
    readOnly = false,
    toolbar,
    onImageUpload,
    minHeight = 240,
    maxHeight,
    className,
    contentClassName,
    ariaLabel = '리치 텍스트 편집기',
  },
  ref,
) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  // onChange로 마지막에 내보낸 HTML — 제어 value의 echo를 구분해 caret 점프 방지.
  const lastEmittedRef = React.useRef<string>('');
  // 링크 프롬프트를 열 때의 셀렉션 저장용.
  const savedRangeRef = React.useRef<Range | null>(null);

  const [active, setActive] = React.useState<ActiveFormats>(INITIAL_ACTIVE);
  const [isFullscreen, setFullscreen] = React.useState(false);
  const [isSourceMode, setSourceMode] = React.useState(false);
  const [sourceHtml, setSourceHtml] = React.useState('');
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [linkValue, setLinkValue] = React.useState('');

  const groups = React.useMemo(() => normalizeToolbar(toolbar), [toolbar]);
  const showToolbar = groups.length > 0;

  const updateEmptyState = React.useCallback((el: HTMLDivElement) => {
    el.dataset.empty = String(isEmptyHtml(el.innerHTML));
  }, []);

  const emitChange = React.useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const html = el.innerHTML;
    lastEmittedRef.current = html;
    updateEmptyState(el);
    onChange?.(html);
  }, [onChange, updateEmptyState]);

  const updateActive = React.useCallback(() => {
    if (!contentRef.current) return;
    setActive(readActiveFormats(contentRef.current));
  }, []);

  // ── 마운트 시 초기 HTML 주입 ──────────────────────────────────────────────
  React.useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const initial = value ?? defaultValue ?? '';
    el.innerHTML = initial;
    lastEmittedRef.current = initial;
    updateEmptyState(el);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 제어 value 동기화 (자기 자신이 낸 변경의 echo는 무시) ──────────────────
  React.useEffect(() => {
    if (value === undefined) return;
    const el = contentRef.current;
    if (!el) return;
    if (value === lastEmittedRef.current) return;
    if (value !== el.innerHTML) {
      el.innerHTML = value;
      lastEmittedRef.current = value;
      updateEmptyState(el);
    }
  }, [value, updateEmptyState]);

  // ── selectionchange로 활성 서식 추적 ─────────────────────────────────────
  React.useEffect(() => {
    const handler = () => {
      const el = contentRef.current;
      if (!el) return;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      if (el.contains(sel.getRangeAt(0).commonAncestorContainer)) {
        setActive(readActiveFormats(el));
      }
    };
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, []);

  // ── ESC로 전체 화면 종료 ─────────────────────────────────────────────────
  React.useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isFullscreen]);

  const focusContent = React.useCallback(() => {
    contentRef.current?.focus();
  }, []);

  // ── 이미지 파일 삽입 (붙여넣기/드롭/파일선택 공통) ─────────────────────────
  const handleImageFiles = React.useCallback(
    async (files: File[], range: Range | null) => {
      const el = contentRef.current;
      if (!el || files.length === 0) return;
      await insertImageFiles(files, el, range, onImageUpload, emitChange);
    },
    [onImageUpload, emitChange],
  );

  // ── 툴바 액션 디스패치 ───────────────────────────────────────────────────
  const runAction = React.useCallback(
    (item: ToolbarItem, val?: string) => {
      // readOnly여도 fullscreen/sourceCode 토글은 허용.
      if (item === 'fullscreen') {
        setFullscreen((v) => !v);
        return;
      }
      if (item === 'sourceCode') {
        setSourceMode((prev) => {
          const next = !prev;
          const el = contentRef.current;
          if (next) {
            // 소스 모드 진입 → 현재 HTML을 textarea로.
            if (el) setSourceHtml(el.innerHTML);
          } else if (el) {
            // 소스 모드 종료 → 편집 내용을 본문에 반영.
            const clean = sanitizeHtml(sourceHtml);
            el.innerHTML = clean;
            updateEmptyState(el);
            emitChange();
          }
          return next;
        });
        return;
      }

      if (readOnly || isSourceMode) return;

      focusContent();

      switch (item) {
        case 'undo':
          commands.undo();
          break;
        case 'redo':
          commands.redo();
          break;
        case 'bold':
          commands.bold();
          break;
        case 'italic':
          commands.italic();
          break;
        case 'underline':
          commands.underline();
          break;
        case 'strikethrough':
          commands.strikethrough();
          break;
        case 'bulletList':
          commands.bulletList();
          break;
        case 'orderedList':
          commands.orderedList();
          break;
        case 'indent':
          commands.indent();
          break;
        case 'outdent':
          commands.outdent();
          break;
        case 'alignLeft':
          commands.alignLeft();
          break;
        case 'alignCenter':
          commands.alignCenter();
          break;
        case 'alignRight':
          commands.alignRight();
          break;
        case 'alignJustify':
          commands.alignJustify();
          break;
        case 'horizontalRule':
          commands.horizontalRule();
          break;
        case 'unlink':
          commands.unlink();
          break;
        case 'clearFormat':
          commands.clearFormat();
          break;
        case 'blockquote':
          commands.formatBlock(active.block === 'blockquote' ? 'p' : 'blockquote');
          break;
        case 'codeBlock':
          commands.formatBlock(active.block === 'pre' ? 'p' : 'pre');
          break;
        case 'blockFormat':
          if (val) commands.formatBlock(val);
          break;
        case 'fontSize':
          if (val) commands.fontSize(val);
          break;
        case 'foreColor':
          if (val) commands.foreColor(val);
          break;
        case 'backColor':
          if (val) commands.backColor(val);
          break;
        case 'link':
          // 현재 셀렉션을 저장하고 링크 입력창을 연다.
          savedRangeRef.current = contentRef.current ? saveSelection(contentRef.current) : null;
          setLinkValue('');
          setLinkOpen(true);
          return; // emit은 적용 시점에.
        case 'image':
          fileInputRef.current?.click();
          return;
        default:
          break;
      }
      emitChange();
      updateActive();
    },
    [
      active.block,
      emitChange,
      focusContent,
      isSourceMode,
      readOnly,
      sourceHtml,
      updateActive,
      updateEmptyState,
    ],
  );

  const applyLinkValue = React.useCallback(() => {
    setLinkOpen(false);
    const url = linkValue.trim();
    if (!url) return;
    focusContent();
    restoreSelection(savedRangeRef.current);
    applyLink(url);
    emitChange();
    updateActive();
  }, [linkValue, focusContent, emitChange, updateActive]);

  // ── 이벤트 핸들러 ────────────────────────────────────────────────────────
  const handleInput = React.useCallback(() => {
    emitChange();
    updateActive();
  }, [emitChange, updateActive]);

  const handlePaste = React.useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      if (readOnly) return;
      const images = extractImageFiles(e.clipboardData);
      if (images.length > 0) {
        e.preventDefault();
        const range = contentRef.current ? saveSelection(contentRef.current) : null;
        void handleImageFiles(images, range);
        return;
      }
      // 리치 텍스트 붙여넣기 → 새니타이즈 후 삽입.
      const html = e.clipboardData.getData('text/html');
      if (html) {
        e.preventDefault();
        commands.insertHTML(sanitizeHtml(html));
        emitChange();
        updateActive();
      }
      // 순수 텍스트는 기본 동작(input 이벤트가 emitChange 처리).
    },
    [readOnly, handleImageFiles, emitChange, updateActive],
  );

  const handleDrop = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (readOnly) return;
      const images = extractImageFiles(e.dataTransfer);
      if (images.length === 0) return;
      e.preventDefault();
      // 드롭 지점에 caret 배치 (지원 브라우저 한정).
      let range: Range | null = null;
      const doc = document as Document & {
        caretRangeFromPoint?: (x: number, y: number) => Range | null;
      };
      if (doc.caretRangeFromPoint) {
        range = doc.caretRangeFromPoint(e.clientX, e.clientY);
        restoreSelection(range);
      } else if (contentRef.current) {
        placeCaretAtEnd(contentRef.current);
        range = saveSelection(contentRef.current);
      }
      void handleImageFiles(images, range);
    },
    [readOnly, handleImageFiles],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (readOnly) return;
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const key = e.key.toLowerCase();
      if (key === 'k') {
        e.preventDefault();
        runAction('link');
      } else if (key === 'z' && e.shiftKey) {
        // Ctrl+Shift+Z = redo (일부 브라우저 단축키 보강)
        e.preventDefault();
        runAction('redo');
      }
      // b/i/u는 contentEditable 네이티브 처리(input 이벤트로 emit).
    },
    [readOnly, runAction],
  );

  const handleFileChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      const imgs = files.filter((f) => f.type.startsWith('image/'));
      const range = contentRef.current ? saveSelection(contentRef.current) : null;
      void handleImageFiles(imgs, range);
      e.target.value = ''; // 같은 파일 재선택 허용
    },
    [handleImageFiles],
  );

  // ── 이미지 클릭 선택 표시 ────────────────────────────────────────────────
  const handleClick = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = contentRef.current;
    if (!el) return;
    el.querySelectorAll('img.baneung-editor-img--selected').forEach((img) =>
      img.classList.remove('baneung-editor-img--selected'),
    );
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      target.classList.add('baneung-editor-img--selected');
    }
  }, []);

  // ── 명령형 핸들 ──────────────────────────────────────────────────────────
  React.useImperativeHandle(
    ref,
    (): EditorHandle => ({
      getHTML: () => contentRef.current?.innerHTML ?? '',
      getText: () => contentRef.current?.innerText ?? '',
      setHTML: (html: string) => {
        const el = contentRef.current;
        if (!el) return;
        el.innerHTML = sanitizeHtml(html);
        updateEmptyState(el);
        emitChange();
      },
      focus: focusContent,
      insertHTML: (html: string) => {
        focusContent();
        commands.insertHTML(html);
        emitChange();
      },
      getElement: () => contentRef.current,
    }),
    [emitChange, focusContent, updateEmptyState],
  );

  return (
    <div
      className={cn(
        'flex flex-col border border-border-default bg-canvas text-foreground',
        isFullscreen && 'fixed inset-0 z-50 h-screen w-screen border-0',
        className,
      )}
    >
      {showToolbar && (
        <Toolbar
          groups={groups}
          active={active}
          disabled={readOnly}
          isFullscreen={isFullscreen}
          isSourceMode={isSourceMode}
          onAction={runAction}
        />
      )}

      {linkOpen && (
        <div className="flex items-center gap-2 border-b border-border-default bg-surface p-2">
          <input
            // 링크 바는 사용자 액션(버튼/Ctrl+K)으로만 열리므로 즉시 포커스가 자연스럽다.
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            type="text"
            value={linkValue}
            placeholder="https://example.com"
            aria-label="링크 URL"
            onChange={(e) => setLinkValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                applyLinkValue();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                setLinkOpen(false);
              }
            }}
            className={cn(
              'h-8 flex-1 border border-border-default bg-canvas px-2 text-sm text-foreground',
              'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring',
            )}
          />
          <button
            type="button"
            onClick={applyLinkValue}
            className="h-8 border border-border-default bg-canvas px-3 text-sm hover:bg-surface-strong"
          >
            적용
          </button>
          <button
            type="button"
            onClick={() => setLinkOpen(false)}
            className="h-8 px-3 text-sm text-foreground-muted hover:text-foreground"
          >
            취소
          </button>
        </div>
      )}

      {isSourceMode ? (
        <textarea
          value={sourceHtml}
          onChange={(e) => setSourceHtml(e.target.value)}
          spellCheck={false}
          aria-label="HTML 소스"
          className={cn(
            'w-full resize-y bg-canvas p-4 font-mono text-sm text-foreground',
            'focus-visible:outline-none',
          )}
          style={{
            minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
            ...(maxHeight
              ? { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }
              : {}),
          }}
        />
      ) : (
        <div
          ref={contentRef}
          className={cn(
            'baneung-editor-content w-full overflow-auto p-4',
            readOnly && 'cursor-default',
            contentClassName,
          )}
          contentEditable={!readOnly}
          suppressContentEditableWarning
          role="textbox"
          tabIndex={0}
          aria-multiline="true"
          aria-label={ariaLabel}
          aria-readonly={readOnly}
          data-placeholder={placeholder}
          data-empty="true"
          spellCheck
          onInput={handleInput}
          onBlur={emitChange}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          style={{
            minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
            ...(maxHeight
              ? { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }
              : {}),
          }}
        />
      )}

      {/* 이미지 파일 선택 (숨김) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
});
