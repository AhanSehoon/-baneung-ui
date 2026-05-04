import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from './sidebar';
import { checkA11y } from '../../test-utils/axe';

describe('Sidebar', () => {
  it('renders <aside> with aria-label', () => {
    render(
      <Sidebar aria-label="네비">
        <SidebarContent>내용</SidebarContent>
      </Sidebar>,
    );
    expect(screen.getByRole('complementary', { name: '네비' })).toBeInTheDocument();
  });

  it('starts expanded by default (data-collapsed not set)', () => {
    render(
      <Sidebar aria-label="네비" data-testid="s">
        <SidebarContent>내용</SidebarContent>
      </Sidebar>,
    );
    expect(screen.getByTestId('s')).not.toHaveAttribute('data-collapsed');
  });

  it('SidebarTrigger toggles collapsed state', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Sidebar aria-label="네비" data-testid="s" onCollapsedChange={onChange}>
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>내용</SidebarContent>
      </Sidebar>,
    );
    const trigger = screen.getByRole('button');
    await user.click(trigger);
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByTestId('s')).toHaveAttribute('data-collapsed');
    await user.click(trigger);
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it('respects controlled `collapsed` prop and side', () => {
    render(
      <Sidebar aria-label="네비" side="right" collapsed data-testid="s">
        <SidebarContent>내용</SidebarContent>
      </Sidebar>,
    );
    const el = screen.getByTestId('s');
    expect(el).toHaveAttribute('data-collapsed');
    expect(el).toHaveAttribute('data-side', 'right');
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(
      <Sidebar aria-label="네비">
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>내용</SidebarContent>
      </Sidebar>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
