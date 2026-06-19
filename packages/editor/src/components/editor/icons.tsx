import type * as React from 'react';

/**
 * 툴바 아이콘 모음 — 의존성 없이 인라인 SVG로 제공.
 * 모두 currentColor를 사용하므로 버튼 텍스트 색을 따라간다.
 */

type IconProps = React.SVGProps<SVGSVGElement>;

function Svg({ children, ...props }: React.PropsWithChildren<IconProps>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const Icons = {
  undo: (p: IconProps) => (
    <Svg {...p}>
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </Svg>
  ),
  redo: (p: IconProps) => (
    <Svg {...p}>
      <path d="M21 7v6h-6" />
      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
    </Svg>
  ),
  bold: (p: IconProps) => (
    <Svg {...p}>
      <path d="M6 4h7a4 4 0 0 1 0 8H6z" />
      <path d="M6 12h8a4 4 0 0 1 0 8H6z" />
    </Svg>
  ),
  italic: (p: IconProps) => (
    <Svg {...p}>
      <line x1="19" y1="4" x2="10" y2="4" />
      <line x1="14" y1="20" x2="5" y2="20" />
      <line x1="15" y1="4" x2="9" y2="20" />
    </Svg>
  ),
  underline: (p: IconProps) => (
    <Svg {...p}>
      <path d="M6 3v7a6 6 0 0 0 12 0V3" />
      <line x1="4" y1="21" x2="20" y2="21" />
    </Svg>
  ),
  strikethrough: (p: IconProps) => (
    <Svg {...p}>
      <line x1="4" y1="12" x2="20" y2="12" />
      <path d="M16 6.5C16 5 14.5 4 12 4S8 5 8 6.5" />
      <path d="M8 17.5C8 19 9.5 20 12 20s4-1 4-2.5" />
    </Svg>
  ),
  foreColor: (p: IconProps) => (
    <Svg {...p}>
      <path d="M5 16l4-10 4 10" />
      <line x1="6.5" y1="12.5" x2="11.5" y2="12.5" />
      <line x1="4" y1="20" x2="20" y2="20" strokeWidth="3" />
    </Svg>
  ),
  backColor: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 3l7 7-8 8H4v-7z" />
      <line x1="3" y1="22" x2="21" y2="22" strokeWidth="3" />
    </Svg>
  ),
  bulletList: (p: IconProps) => (
    <Svg {...p}>
      <line x1="9" y1="6" x2="20" y2="6" />
      <line x1="9" y1="12" x2="20" y2="12" />
      <line x1="9" y1="18" x2="20" y2="18" />
      <circle cx="4" cy="6" r="1" fill="currentColor" />
      <circle cx="4" cy="12" r="1" fill="currentColor" />
      <circle cx="4" cy="18" r="1" fill="currentColor" />
    </Svg>
  ),
  orderedList: (p: IconProps) => (
    <Svg {...p}>
      <line x1="10" y1="6" x2="20" y2="6" />
      <line x1="10" y1="12" x2="20" y2="12" />
      <line x1="10" y1="18" x2="20" y2="18" />
      <path d="M4 4h1v4M3 8h3" strokeWidth="1.6" />
      <path d="M3 13.5C3 12.5 5 12.5 5 13.8 5 15 3 15 3 16.5h2.2" strokeWidth="1.6" />
    </Svg>
  ),
  indent: (p: IconProps) => (
    <Svg {...p}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="11" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
      <path d="M3 10l4 2-4 2z" fill="currentColor" />
    </Svg>
  ),
  outdent: (p: IconProps) => (
    <Svg {...p}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="11" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
      <path d="M7 10l-4 2 4 2z" fill="currentColor" />
    </Svg>
  ),
  alignLeft: (p: IconProps) => (
    <Svg {...p}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="14" y2="12" />
      <line x1="3" y1="18" x2="18" y2="18" />
    </Svg>
  ),
  alignCenter: (p: IconProps) => (
    <Svg {...p}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="6" y1="12" x2="18" y2="12" />
      <line x1="5" y1="18" x2="19" y2="18" />
    </Svg>
  ),
  alignRight: (p: IconProps) => (
    <Svg {...p}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="10" y1="12" x2="21" y2="12" />
      <line x1="6" y1="18" x2="21" y2="18" />
    </Svg>
  ),
  alignJustify: (p: IconProps) => (
    <Svg {...p}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </Svg>
  ),
  link: (p: IconProps) => (
    <Svg {...p}>
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5" />
      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5" />
    </Svg>
  ),
  unlink: (p: IconProps) => (
    <Svg {...p}>
      <path d="M17 7l3-3a5 5 0 0 0-7 0" />
      <path d="M7 17l-3 3a5 5 0 0 0 7 0" />
      <line x1="4" y1="4" x2="20" y2="20" />
    </Svg>
  ),
  image: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="4" width="18" height="16" rx="1" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M21 16l-5-5L5 20" />
    </Svg>
  ),
  horizontalRule: (p: IconProps) => (
    <Svg {...p}>
      <line x1="3" y1="12" x2="21" y2="12" />
    </Svg>
  ),
  blockquote: (p: IconProps) => (
    <Svg {...p}>
      <path d="M7 7H4v6h3l-1 4" />
      <path d="M17 7h-3v6h3l-1 4" />
    </Svg>
  ),
  codeBlock: (p: IconProps) => (
    <Svg {...p}>
      <polyline points="8 7 3 12 8 17" />
      <polyline points="16 7 21 12 16 17" />
    </Svg>
  ),
  clearFormat: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 7h16" />
      <path d="M10 7l-2 13" />
      <path d="M14 7l1 6" />
      <line x1="15" y1="16" x2="21" y2="22" />
      <line x1="21" y1="16" x2="15" y2="22" />
    </Svg>
  ),
  fullscreen: (p: IconProps) => (
    <Svg {...p}>
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M16 3h3a2 2 0 0 1 2 2v3" />
      <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </Svg>
  ),
  fullscreenExit: (p: IconProps) => (
    <Svg {...p}>
      <path d="M3 8h3a2 2 0 0 0 2-2V3" />
      <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
      <path d="M3 16h3a2 2 0 0 1 2 2v3" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
    </Svg>
  ),
  sourceCode: (p: IconProps) => (
    <Svg {...p}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </Svg>
  ),
};

export type IconName = keyof typeof Icons;
