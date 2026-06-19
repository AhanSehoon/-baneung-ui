import type * as React from 'react';

/**
 * 툴바에 노출할 수 있는 기능 식별자.
 * `toolbar` prop에 이 키들의 배열(그룹은 중첩 배열)을 넘겨 구성한다.
 */
export type ToolbarItem =
  | 'undo'
  | 'redo'
  | 'blockFormat' // 문단/제목/인용/코드 드롭다운
  | 'fontSize'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'foreColor' // 글자 색
  | 'backColor' // 형광펜
  | 'bulletList'
  | 'orderedList'
  | 'indent'
  | 'outdent'
  | 'alignLeft'
  | 'alignCenter'
  | 'alignRight'
  | 'alignJustify'
  | 'link'
  | 'unlink'
  | 'image'
  | 'horizontalRule'
  | 'blockquote'
  | 'codeBlock'
  | 'clearFormat'
  | 'fullscreen'
  | 'sourceCode' // HTML 소스 토글
  | 'separator'; // 시각적 구분선

/** `toolbar` prop 타입 — 항목의 1차원 배열(평면) 또는 그룹(2차원). */
export type ToolbarConfig = ToolbarItem[] | ToolbarItem[][];

/**
 * 이미지 업로드 핸들러. File을 받아 최종 src(URL)를 Promise로 반환한다.
 * 미지정 시 에디터는 파일을 base64 data URL로 인라인 삽입한다(서버 불필요).
 */
export type ImageUploadHandler = (file: File) => Promise<string>;

export interface EditorProps {
  /** 제어 컴포넌트용 HTML 문자열. 지정 시 외부 상태와 동기화된다. */
  value?: string;
  /** 비제어 초기 HTML. `value` 미지정 시 사용. */
  defaultValue?: string;
  /** 내용이 바뀔 때마다 현재 HTML 문자열을 전달. */
  onChange?: (html: string) => void;
  /** 비어 있을 때 표시할 placeholder. */
  placeholder?: string;
  /** 읽기 전용 — 편집 불가, 툴바 비활성. */
  readOnly?: boolean;
  /** 툴바 구성. 미지정 시 기본 전체 툴바. `false`면 툴바 숨김. */
  toolbar?: ToolbarConfig | false;
  /**
   * 이미지 업로드 핸들러. 미지정 시 base64 data URL로 인라인 삽입.
   * 붙여넣기·드래그앤드롭·파일선택 모두 이 핸들러를 거친다.
   */
  onImageUpload?: ImageUploadHandler;
  /** 본문 영역 최소 높이 (px 또는 CSS 길이). 기본 240. */
  minHeight?: number | string;
  /** 본문 영역 최대 높이 — 초과 시 스크롤. 미지정 시 무제한. */
  maxHeight?: number | string;
  /** 루트 요소 className. */
  className?: string;
  /** 본문(contentEditable) 영역 className. */
  contentClassName?: string;
  /** 본문 영역 ARIA 라벨. 기본 '리치 텍스트 편집기'. */
  ariaLabel?: string;
}

/** ref로 노출되는 명령형 핸들. */
export interface EditorHandle {
  /** 현재 HTML 문자열을 반환. */
  getHTML: () => string;
  /** 마크업을 제거한 순수 텍스트를 반환. */
  getText: () => string;
  /** HTML을 설정(덮어쓰기)하고 onChange를 발생. */
  setHTML: (html: string) => void;
  /** 본문 영역에 포커스. */
  focus: () => void;
  /** 커서 위치에 HTML 삽입. */
  insertHTML: (html: string) => void;
  /** 내부 contentEditable DOM 노드. */
  getElement: () => HTMLDivElement | null;
}

/** 툴바 버튼이 참조하는 현재 포맷 활성 상태. */
export interface ActiveFormats {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  bulletList: boolean;
  orderedList: boolean;
  alignLeft: boolean;
  alignCenter: boolean;
  alignRight: boolean;
  alignJustify: boolean;
  /** 현재 블록 포맷: 'p' | 'h1' | 'h2' | 'h3' | 'blockquote' | 'pre' 등. */
  block: string;
}

export type EditorContentRef = React.RefObject<HTMLDivElement | null>;
