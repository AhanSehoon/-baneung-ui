import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ButtonGroup } from './button-group';
import { checkA11y } from '../../test-utils/axe';
import { Button } from '../button';

describe('ButtonGroup', () => {
  it('renders role="group" with horizontal orientation by default', () => {
    render(
      <ButtonGroup aria-label="actions">
        <Button>A</Button>
        <Button>B</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole('group', { name: 'actions' });
    expect(group.className).toMatch(/flex-row/);
  });

  it('respects vertical orientation', () => {
    render(
      <ButtonGroup orientation="vertical" aria-label="vertical">
        <Button>A</Button>
        <Button>B</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('group').className).toMatch(/flex-col/);
  });

  it('renders all child buttons', () => {
    render(
      <ButtonGroup aria-label="g">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>,
    );
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('child buttons remain individually clickable (Tab navigation)', async () => {
    const user = userEvent.setup();
    const onA = vi.fn();
    const onB = vi.fn();
    render(
      <ButtonGroup aria-label="g">
        <Button onClick={onA}>A</Button>
        <Button onClick={onB}>B</Button>
      </ButtonGroup>,
    );

    await user.tab();
    expect(screen.getByRole('button', { name: 'A' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onA).toHaveBeenCalledTimes(1);

    await user.tab();
    expect(screen.getByRole('button', { name: 'B' })).toHaveFocus();
    await user.keyboard(' ');
    expect(onB).toHaveBeenCalledTimes(1);
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(
      <ButtonGroup aria-label="페이지">
        <Button variant="outline">이전</Button>
        <Button variant="outline">다음</Button>
      </ButtonGroup>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
