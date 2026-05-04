import * as DirectionPrimitive from '@radix-ui/react-direction';

import type * as React from 'react';

/**
 * Direction — RTL/LTR 컨텍스트 프로바이더.
 *
 * Radix 컴포넌트들(예: Slider, Tabs, ToggleGroup, Menubar)은 DirectionProvider 안에 있을 때
 * 키보드 네비/시각 방향이 자동으로 전환됩니다.
 *
 * @example
 *   <Direction dir="rtl">
 *     <App />
 *   </Direction>
 */
export interface DirectionProps {
  dir: 'ltr' | 'rtl';
  children?: React.ReactNode;
}

export function Direction({ dir, children }: DirectionProps): React.ReactElement {
  return <DirectionPrimitive.Provider dir={dir}>{children}</DirectionPrimitive.Provider>;
}
