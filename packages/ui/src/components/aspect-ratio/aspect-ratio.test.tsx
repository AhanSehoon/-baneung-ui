import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AspectRatio } from './aspect-ratio';
import { checkA11y } from '../../test-utils/axe';

describe('AspectRatio', () => {
  it('wraps children inside a positioned container', () => {
    const { container } = render(
      <AspectRatio ratio={16 / 9} data-testid="ar">
        <div>content</div>
      </AspectRatio>,
    );
    expect(container.querySelector('[data-testid="ar"]')).toBeInTheDocument();
  });

  it('applies the requested ratio (padding-bottom 56.25% for 16/9)', () => {
    const { container } = render(
      <AspectRatio ratio={16 / 9}>
        <div>content</div>
      </AspectRatio>,
    );
    // Radix uses padding-bottom on a wrapping div for the ratio.
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.paddingBottom).toBe('56.25%');
  });

  it('passes axe a11y scan with image content', async () => {
    const { container } = render(
      <AspectRatio ratio={1}>
        <img src="https://example.com/img.png" alt="설명" />
      </AspectRatio>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
