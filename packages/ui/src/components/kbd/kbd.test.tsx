import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Kbd } from './kbd';
import { checkA11y } from '../../test-utils/axe';

describe('Kbd', () => {
  it('renders semantic <kbd>', () => {
    render(<Kbd>⌘ K</Kbd>);
    const el = screen.getByText('⌘ K');
    expect(el.tagName).toBe('KBD');
  });

  it('forwards className', () => {
    render(<Kbd className="ml-2">A</Kbd>);
    expect(screen.getByText('A').className).toMatch(/ml-2/);
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(
      <p>
        검색을 열려면 <Kbd>⌘ K</Kbd>를 누르세요.
      </p>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
