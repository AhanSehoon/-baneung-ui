import { run, type AxeResults } from 'axe-core';

/**
 * 렌더된 element를 axe-core로 a11y 스캔.
 *
 * @example
 *   const { container } = render(<MyComponent />);
 *   const results = await checkA11y(container);
 *   expect(results.violations).toEqual([]);
 */
export async function checkA11y(node: Element): Promise<AxeResults> {
  return run(node);
}
