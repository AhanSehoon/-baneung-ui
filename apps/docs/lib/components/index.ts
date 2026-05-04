import { buttonsComponents } from './buttons';
import { dataDisplayComponents } from './data-display';
import { feedbackComponents } from './feedback';
import { foundationComponents } from './foundation';
import { inputsComponents } from './inputs';
import { layoutComponents } from './layout';
import { navigationComponents } from './navigation';
import { overlayComponents } from './overlay';
import { selectionComponents } from './selection';

export type { ComponentSpec, ComponentCategory } from './_types';

/** 모든 컴포넌트 spec — 카테고리 순서대로. */
export const allComponents = [
  ...foundationComponents,
  ...buttonsComponents,
  ...inputsComponents,
  ...selectionComponents,
  ...layoutComponents,
  ...navigationComponents,
  ...overlayComponents,
  ...feedbackComponents,
  ...dataDisplayComponents,
];

/** slug로 단일 컴포넌트 spec 조회. */
export function findComponent(slug: string) {
  return allComponents.find((c) => c.slug === slug);
}

/** 카테고리별 그룹. */
export function componentsByCategory() {
  const groups = new Map<string, typeof allComponents>();
  for (const spec of allComponents) {
    const list = groups.get(spec.category) ?? [];
    list.push(spec);
    groups.set(spec.category, list);
  }
  return groups;
}
