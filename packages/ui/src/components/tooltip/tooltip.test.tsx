import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { checkA11y } from '../../test-utils/axe';

describe('Tooltip', () => {
  it('does not render content when closed', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>도움</TooltipTrigger>
          <TooltipContent>안내</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.queryByText('안내')).not.toBeInTheDocument();
  });

  it('opens on focus', async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>도움</TooltipTrigger>
          <TooltipContent>안내</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    await user.tab();
    expect(screen.getByText('도움')).toHaveFocus();
    expect(await screen.findAllByText('안내')).not.toHaveLength(0);
  });

  it('closes on Esc', async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>도움</TooltipTrigger>
          <TooltipContent>안내</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    await user.tab();
    expect(await screen.findAllByText('안내')).not.toHaveLength(0);
    await user.keyboard('{Escape}');
    expect(screen.queryByText('안내')).not.toBeInTheDocument();
  });

  it('passes axe a11y scan (closed)', async () => {
    const { container } = render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>도움</TooltipTrigger>
          <TooltipContent>안내</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
