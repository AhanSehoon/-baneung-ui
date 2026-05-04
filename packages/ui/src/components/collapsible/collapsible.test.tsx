import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';
import { checkA11y } from '../../test-utils/axe';

describe('Collapsible', () => {
  it('renders trigger', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>토글</CollapsibleTrigger>
        <CollapsibleContent>숨김 내용</CollapsibleContent>
      </Collapsible>,
    );
    expect(screen.getByRole('button', { name: '토글' })).toBeInTheDocument();
  });

  it('toggles content on click', async () => {
    const user = userEvent.setup();
    render(
      <Collapsible>
        <CollapsibleTrigger>토글</CollapsibleTrigger>
        <CollapsibleContent>숨김 내용</CollapsibleContent>
      </Collapsible>,
    );
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('respects controlled `open` prop', () => {
    const { rerender } = render(
      <Collapsible open={false}>
        <CollapsibleTrigger>토글</CollapsibleTrigger>
        <CollapsibleContent>숨김</CollapsibleContent>
      </Collapsible>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    rerender(
      <Collapsible open>
        <CollapsibleTrigger>토글</CollapsibleTrigger>
        <CollapsibleContent>숨김</CollapsibleContent>
      </Collapsible>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(
      <Collapsible>
        <CollapsibleTrigger>더 보기</CollapsibleTrigger>
        <CollapsibleContent>추가 정보</CollapsibleContent>
      </Collapsible>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
