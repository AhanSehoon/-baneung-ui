import type { ActiveFormats } from './types';

/**
 * contentEditable 명령 래퍼.
 *
 * 브라우저 표준 `document.execCommand`를 사용한다. 오래된 API지만 모든 메이저
 * 브라우저에서 여전히 동작하며, contentEditable 기반 WYSIWYG에서 undo 스택·
 * 셀렉션 처리를 브라우저에 위임할 수 있어 의존성 0으로 구현하기에 적합하다.
 */

/** execCommand 안전 래퍼 — SSR/미지원 환경에서 throw하지 않도록. */
export function exec(command: string, value?: string): boolean {
  if (typeof document === 'undefined' || typeof document.execCommand !== 'function') {
    return false;
  }
  try {
    return document.execCommand(command, false, value);
  } catch {
    return false;
  }
}

function queryState(command: string): boolean {
  if (typeof document === 'undefined' || typeof document.queryCommandState !== 'function') {
    return false;
  }
  try {
    return document.queryCommandState(command);
  } catch {
    return false;
  }
}

/** 현재 셀렉션이 속한 가장 가까운 블록 요소의 태그명(소문자)을 반환. */
export function currentBlockTag(root: HTMLElement | null): string {
  if (typeof window === 'undefined') return 'p';
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return 'p';
  let node: Node | null = sel.getRangeAt(0).startContainer;
  const blocks = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'div']);
  while (node && node !== root) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = (node as HTMLElement).tagName.toLowerCase();
      if (blocks.has(tag)) return tag === 'div' ? 'p' : tag;
    }
    node = node.parentNode;
  }
  return 'p';
}

/** 현재 셀렉션 기준 모든 포맷 활성 상태를 한 번에 조회. */
export function readActiveFormats(root: HTMLElement | null): ActiveFormats {
  return {
    bold: queryState('bold'),
    italic: queryState('italic'),
    underline: queryState('underline'),
    strikethrough: queryState('strikeThrough'),
    bulletList: queryState('insertUnorderedList'),
    orderedList: queryState('insertOrderedList'),
    alignLeft: queryState('justifyLeft'),
    alignCenter: queryState('justifyCenter'),
    alignRight: queryState('justifyRight'),
    alignJustify: queryState('justifyFull'),
    block: currentBlockTag(root),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 개별 명령
// ─────────────────────────────────────────────────────────────────────────────

export const commands = {
  undo: () => exec('undo'),
  redo: () => exec('redo'),
  bold: () => exec('bold'),
  italic: () => exec('italic'),
  underline: () => exec('underline'),
  strikethrough: () => exec('strikeThrough'),
  bulletList: () => exec('insertUnorderedList'),
  orderedList: () => exec('insertOrderedList'),
  indent: () => exec('indent'),
  outdent: () => exec('outdent'),
  alignLeft: () => exec('justifyLeft'),
  alignCenter: () => exec('justifyCenter'),
  alignRight: () => exec('justifyRight'),
  alignJustify: () => exec('justifyFull'),
  horizontalRule: () => exec('insertHorizontalRule'),
  unlink: () => exec('unlink'),
  /** 선택 영역의 인라인 서식 제거 + 블록을 문단으로. */
  clearFormat: () => {
    exec('removeFormat');
    exec('unlink');
    exec('formatBlock', 'p');
  },
  /** 블록 포맷 지정. tag 예: 'p' | 'h1' | 'h2' | 'h3' | 'blockquote' | 'pre'. */
  formatBlock: (tag: string) => {
    // 일부 브라우저는 <h1> 형태의 꺾쇠 인자를 요구한다.
    return exec('formatBlock', tag.startsWith('<') ? tag : `<${tag}>`);
  },
  foreColor: (color: string) => exec('foreColor', color),
  backColor: (color: string) => {
    // Firefox는 hiliteColor, 그 외는 backColor.
    return exec('hiliteColor', color) || exec('backColor', color);
  },
  /** px 기준 글자 크기 → execCommand fontSize(1~7)로 매핑 후 fallback. */
  fontSize: (size: string) => exec('fontSize', size),
  insertHTML: (html: string) => exec('insertHTML', html),
  insertText: (text: string) => exec('insertText', text),
} as const;

/**
 * 링크 삽입/수정. 셀렉션이 비어 있으면 url 텍스트를 삽입 후 링크화한다.
 */
export function applyLink(url: string): boolean {
  if (!url) return false;
  const normalized = normalizeUrl(url);
  const sel = typeof window !== 'undefined' ? window.getSelection() : null;
  if (sel && sel.isCollapsed) {
    // 선택이 없으면 URL 자체를 링크 텍스트로 삽입.
    return exec(
      'insertHTML',
      `<a href="${escapeAttr(normalized)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
        url,
      )}</a>`,
    );
  }
  const ok = exec('createLink', normalized);
  // createLink로 만든 <a>에 target/rel 부여.
  if (ok && sel && sel.anchorNode) {
    const anchor = closestAnchor(sel.anchorNode);
    if (anchor) {
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('rel', 'noopener noreferrer');
    }
  }
  return ok;
}

function closestAnchor(node: Node | null): HTMLAnchorElement | null {
  let el: Node | null = node;
  while (el) {
    if (el.nodeType === Node.ELEMENT_NODE && (el as HTMLElement).tagName === 'A') {
      return el as HTMLAnchorElement;
    }
    el = el.parentNode;
  }
  return null;
}

/** 프로토콜이 없으면 https:// 보정 (메일/앵커/상대경로는 그대로). */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (/^(https?:|mailto:|tel:|#|\/)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/"/g, '&quot;');
}
