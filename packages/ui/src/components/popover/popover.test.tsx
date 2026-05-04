import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { checkA11y } from '../../test-utils/axe';

describe('Popover', () => {
  it('does not render content when closed', () => {
    render(
      <Popover>
        <PopoverTrigger>열기</PopoverTrigger>
        <PopoverContent>본문</PopoverContent>
      </Popover>,
    );
    expect(screen.queryByText('본문')).not.toBeInTheDocument();
  });

  it('opens content on trigger click', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>열기</PopoverTrigger>
        <PopoverContent>본문</PopoverContent>
      </Popover>,
    );
    await user.click(screen.getByText('열기'));
    expect(await screen.findByText('본문')).toBeInTheDocument();
  });

  it('closes on Esc', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>열기</PopoverTrigger>
        <PopoverContent>본문</PopoverContent>
      </Popover>,
    );
    await user.click(screen.getByText('열기'));
    expect(await screen.findByText('본문')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByText('본문')).not.toBeInTheDocument();
  });

  it('passes axe a11y scan (closed)', async () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger>도움말</PopoverTrigger>
        <PopoverContent>안내</PopoverContent>
      </Popover>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
