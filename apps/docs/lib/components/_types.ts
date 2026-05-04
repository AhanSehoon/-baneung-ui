import type { ApiProp } from '@/components/api-table';

import type * as React from 'react';

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

export interface ComponentSpec {
  slug: string;
  title: string;
  category: ComponentCategory;
  description: string;
  /** 라이브 예제 — 필요 시 useState 등 사용 가능. */
  Example: React.ComponentType;
  /** 라이브 예제와 동일한 동작의 사용자용 소스(TSX 문자열). 코드 블록에 표시됩니다. */
  code: string;
  /** props 명세표. */
  api: ApiProp[];
  /** 메인 import 한 줄. */
  importPath: string;
  /** subpath import 한 줄(있으면). */
  subpath?: string;
}
