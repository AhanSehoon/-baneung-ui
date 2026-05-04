/**
 * @baneung-pack/ui — 바능 디자인 시스템 React 컴포넌트 라이브러리.
 *
 * 메인 진입점 — 모든 컴포넌트를 한 번에 import 할 수 있습니다.
 * 트리쉐이킹을 위해 컴포넌트별 subpath import도 지원합니다:
 *
 *   import { Heading } from '@baneung-pack/ui';            // 메인
 *   import { Heading } from '@baneung-pack/ui/typography'; // subpath
 *
 * @see ../../../CLAUDE.md
 * @see ../../../PROJECT_PLAN.md
 */

// Lib (utils + hooks)
export * from './lib';

// Phase 3 — Foundation
export * from './components/aspect-ratio';
export * from './components/avatar';
export * from './components/badge';
export * from './components/empty';
export * from './components/kbd';
export * from './components/label';
export * from './components/separator';
export * from './components/skeleton';
export * from './components/spinner';
export * from './components/typography';

// Phase 4 — Buttons & Toggles
export * from './components/button';
export * from './components/button-group';
export * from './components/toggle';
export * from './components/toggle-group';

// Phase 5 — Inputs
export * from './components/checkbox';
export * from './components/field';
export * from './components/input';
export * from './components/input-group';
export * from './components/input-otp';
export * from './components/radio-group';
export * from './components/slider';
export * from './components/switch';
export * from './components/textarea';

// Phase 6 — Selection
export * from './components/calendar';
export * from './components/combobox';
export * from './components/command';
export * from './components/date-picker';
export * from './components/native-select';
export * from './components/select';

// Phase 7 — Layout
export * from './components/card';
export * from './components/direction';
export * from './components/item';
export * from './components/resizable';
export * from './components/scroll-area';
export * from './components/sidebar';

// Phase 8 — Navigation
export * from './components/breadcrumb';
export * from './components/menubar';
export * from './components/navigation-menu';
export * from './components/pagination';
export * from './components/tabs';

// Phase 9 — Overlay
export * from './components/alert-dialog';
export * from './components/context-menu';
export * from './components/dialog';
export * from './components/drawer';
export * from './components/dropdown-menu';
export * from './components/hover-card';
export * from './components/popover';
export * from './components/sheet';
export * from './components/tooltip';

// Phase 10 — Feedback
//
// `Sonner`/`toast`는 `./components/sonner`와 `./components/toast` 양쪽에서 export 되지만
// 메인 진입점에는 `toast` 패키지만 노출 — sonner의 직접 노출은 subpath
// (`@baneung-pack/ui/sonner`)로만 접근하도록 합니다 (이름 충돌 회피).
export * from './components/alert';
export * from './components/progress';
export * from './components/toast';

// Phase 11 — Data Display
export * from './components/accordion';
export * from './components/carousel';
export * from './components/chart';
export * from './components/collapsible';
export * from './components/data-table';
export * from './components/table';

export const VERSION = '0.0.0';
