/**
 * 컴포넌트 메타데이터 — 서버 컴포넌트 안전.
 *
 * `@baneung-pack/ui` 컴포넌트 일부(Carousel, Drawer, Field 등)는 React.createContext를 모듈 최상위에서
 * 호출하므로 server 컴포넌트에서 임포트할 수 없습니다. 인덱스 페이지·동적 라우트의 generateStaticParams는
 * 서버에서 실행되니, 이 메타데이터 파일만 임포트해 React 의존성을 끊습니다.
 *
 * 라이브 예제와 props API는 `lib/components/`(client side)에서 다룹니다.
 */
export type ComponentCategory =
  | 'Foundation'
  | 'Buttons & Toggles'
  | 'Inputs'
  | 'Selection'
  | 'Layout'
  | 'Navigation'
  | 'Overlay'
  | 'Feedback'
  | 'Data Display';

export interface ComponentMeta {
  slug: string;
  title: string;
  category: ComponentCategory;
  description: string;
}

export const componentMetadata: ComponentMeta[] = [
  // Foundation
  {
    slug: 'typography',
    title: 'Typography',
    category: 'Foundation',
    description:
      'Heading(h1~h6), Text, Lead, Muted, Code — 한·영 단일 폰트(Pretendard)의 시각 위계.',
  },
  {
    slug: 'separator',
    title: 'Separator',
    category: 'Foundation',
    description: 'Radix Separator 기반 가로/세로 구분선.',
  },
  {
    slug: 'aspect-ratio',
    title: 'AspectRatio',
    category: 'Foundation',
    description: '자식 요소를 지정한 비율로 고정. Radix Primitive.',
  },
  {
    slug: 'skeleton',
    title: 'Skeleton',
    category: 'Foundation',
    description: '로딩 플레이스홀더. prefers-reduced-motion 존중.',
  },
  {
    slug: 'spinner',
    title: 'Spinner',
    category: 'Foundation',
    description: '회전 SVG 인디케이터. role="status" + sr-only 라벨.',
  },
  {
    slug: 'empty',
    title: 'Empty',
    category: 'Foundation',
    description: '빈 상태 컨테이너 — 아이콘/제목/설명/액션 슬롯.',
  },
  {
    slug: 'avatar',
    title: 'Avatar',
    category: 'Foundation',
    description: '사용자 아바타. 이미지 로드 실패 시 자동 fallback.',
  },
  {
    slug: 'badge',
    title: 'Badge',
    category: 'Foundation',
    description: '상태/카테고리/카운트를 표현하는 작은 라벨.',
  },
  {
    slug: 'kbd',
    title: 'Kbd',
    category: 'Foundation',
    description: '키보드 단축키 표시 — 시맨틱 <kbd>.',
  },
  {
    slug: 'label',
    title: 'Label',
    category: 'Foundation',
    description: '폼 컨트롤 라벨. htmlFor로 클릭 시 포커스 이전.',
  },

  // Buttons & Toggles
  {
    slug: 'button',
    title: 'Button',
    category: 'Buttons & Toggles',
    description: '5 variants × 3 sizes. asChild·loading·leftIcon/rightIcon.',
  },
  {
    slug: 'button-group',
    title: 'ButtonGroup',
    category: 'Buttons & Toggles',
    description: '여러 Button을 묶어 인접 보더 합치기.',
  },
  {
    slug: 'toggle',
    title: 'Toggle',
    category: 'Buttons & Toggles',
    description: '단일 on/off 버튼. aria-pressed 자동 관리.',
  },
  {
    slug: 'toggle-group',
    title: 'ToggleGroup',
    category: 'Buttons & Toggles',
    description: '단일/다중 선택 토글 그룹.',
  },

  // Inputs
  {
    slug: 'input',
    title: 'Input',
    category: 'Inputs',
    description: '단일 라인 텍스트 입력. adornment, error, Field context, IME 안전.',
  },
  {
    slug: 'input-group',
    title: 'InputGroup',
    category: 'Inputs',
    description: 'Input + Button + Icon을 한 줄로 묶기.',
  },
  {
    slug: 'input-otp',
    title: 'InputOTP',
    category: 'Inputs',
    description: 'N자리 OTP — 자동 advance, paste 분배.',
  },
  {
    slug: 'textarea',
    title: 'Textarea',
    category: 'Inputs',
    description: '다중 라인 텍스트. autoResize, IME 안전.',
  },
  {
    slug: 'field',
    title: 'Field',
    category: 'Inputs',
    description: '라벨/설명/에러/컨트롤 묶기 + 자동 a11y 주입.',
  },
  {
    slug: 'checkbox',
    title: 'Checkbox',
    category: 'Inputs',
    description: 'Radix Checkbox. indeterminate 지원.',
  },
  { slug: 'radio-group', title: 'RadioGroup', category: 'Inputs', description: '단일 선택 그룹.' },
  { slug: 'switch', title: 'Switch', category: 'Inputs', description: 'role="switch" 토글.' },
  { slug: 'slider', title: 'Slider', category: 'Inputs', description: '단일/범위 슬라이더.' },

  // Selection
  {
    slug: 'select',
    title: 'Select',
    category: 'Selection',
    description: 'single / multiple / searchable 통합.',
  },
  {
    slug: 'native-select',
    title: 'NativeSelect',
    category: 'Selection',
    description: '브라우저 native <select> 래퍼.',
  },
  {
    slug: 'combobox',
    title: 'Combobox',
    category: 'Selection',
    description: '자유 입력 + 자동완성.',
  },
  { slug: 'command', title: 'Command', category: 'Selection', description: 'cmdk 기반 ⌘K 팔레트.' },
  {
    slug: 'calendar',
    title: 'Calendar',
    category: 'Selection',
    description: 'react-day-picker v9 래퍼.',
  },
  {
    slug: 'date-picker',
    title: 'DatePicker',
    category: 'Selection',
    description: 'Calendar + Popover.',
  },

  // Layout
  {
    slug: 'card',
    title: 'Card',
    category: 'Layout',
    description: '콘텐츠 그루핑 — default/outlined/elevated.',
  },
  {
    slug: 'item',
    title: 'Item',
    category: 'Layout',
    description: '리스트 단일 항목 — slot, selected, asChild.',
  },
  {
    slug: 'sidebar',
    title: 'Sidebar',
    category: 'Layout',
    description: '좌/우 collapsible 사이드 패널.',
  },
  {
    slug: 'resizable',
    title: 'Resizable',
    category: 'Layout',
    description: 'react-resizable-panels 분할.',
  },
  {
    slug: 'scroll-area',
    title: 'ScrollArea',
    category: 'Layout',
    description: 'Radix ScrollArea — navy 톤 thumb.',
  },
  {
    slug: 'direction',
    title: 'Direction',
    category: 'Layout',
    description: 'RTL/LTR 컨텍스트 프로바이더.',
  },

  // Navigation
  {
    slug: 'tabs',
    title: 'Tabs',
    category: 'Navigation',
    description: 'Radix Tabs. 화살표 키 분기.',
  },
  {
    slug: 'breadcrumb',
    title: 'Breadcrumb',
    category: 'Navigation',
    description: '페이지 위계 네비.',
  },
  {
    slug: 'pagination',
    title: 'Pagination',
    category: 'Navigation',
    description: '1, 2, 3 … N 패턴 + 모바일 단순 모드.',
  },
  {
    slug: 'navigation-menu',
    title: 'NavigationMenu',
    category: 'Navigation',
    description: '드롭다운 네비 — 단일 viewport 공유.',
  },
  {
    slug: 'menubar',
    title: 'Menubar',
    category: 'Navigation',
    description: '데스크톱 가로 메뉴 (파일/편집/...).',
  },

  // Overlay
  {
    slug: 'dialog',
    title: 'Dialog',
    category: 'Overlay',
    description: 'Radix Dialog 모달. 포커스 트랩 + 복귀.',
  },
  {
    slug: 'alert-dialog',
    title: 'AlertDialog',
    category: 'Overlay',
    description: '파괴적 액션 확인용 (alertdialog).',
  },
  {
    slug: 'drawer',
    title: 'Drawer',
    category: 'Overlay',
    description: 'vaul 기반 모바일 친화 시트.',
  },
  { slug: 'sheet', title: 'Sheet', category: 'Overlay', description: '상/하/좌/우 슬라이드 시트.' },
  {
    slug: 'popover',
    title: 'Popover',
    category: 'Overlay',
    description: 'Radix Popover 부유 패널.',
  },
  {
    slug: 'hover-card',
    title: 'HoverCard',
    category: 'Overlay',
    description: '호버로 열리는 정보 카드.',
  },
  {
    slug: 'tooltip',
    title: 'Tooltip',
    category: 'Overlay',
    description: '짧은 안내 툴팁 (모바일 미동작).',
  },
  {
    slug: 'dropdown-menu',
    title: 'DropdownMenu',
    category: 'Overlay',
    description: '서브메뉴/체크박스/라디오 항목.',
  },
  {
    slug: 'context-menu',
    title: 'ContextMenu',
    category: 'Overlay',
    description: '우클릭 컨텍스트 메뉴.',
  },

  // Feedback
  {
    slug: 'alert',
    title: 'Alert',
    category: 'Feedback',
    description: '4 variants — info/success/warning/danger.',
  },
  {
    slug: 'toast',
    title: 'Toast',
    category: 'Feedback',
    description: 'sonner 기반 의견적 래퍼 + useToast.',
  },
  {
    slug: 'sonner',
    title: 'Sonner',
    category: 'Feedback',
    description: 'sonner 직접 노출 (subpath 전용).',
  },
  { slug: 'progress', title: 'Progress', category: 'Feedback', description: '결정/비결정 진행률.' },

  // Data Display
  {
    slug: 'accordion',
    title: 'Accordion',
    category: 'Data Display',
    description: 'Radix Accordion — single/multiple.',
  },
  {
    slug: 'collapsible',
    title: 'Collapsible',
    category: 'Data Display',
    description: '단일 영역 fold/unfold.',
  },
  { slug: 'table', title: 'Table', category: 'Data Display', description: '시맨틱 <table> 래퍼.' },
  {
    slug: 'data-table',
    title: 'DataTable',
    category: 'Data Display',
    description: '@tanstack/react-table — 정렬/페이지/선택.',
  },
  {
    slug: 'carousel',
    title: 'Carousel',
    category: 'Data Display',
    description: 'embla-carousel-react.',
  },
];

export function findComponentMeta(slug: string): ComponentMeta | undefined {
  return componentMetadata.find((c) => c.slug === slug);
}

export function metaByCategory(): Map<ComponentCategory, ComponentMeta[]> {
  const groups = new Map<ComponentCategory, ComponentMeta[]>();
  for (const meta of componentMetadata) {
    const list = groups.get(meta.category) ?? [];
    list.push(meta);
    groups.set(meta.category, list);
  }
  return groups;
}
