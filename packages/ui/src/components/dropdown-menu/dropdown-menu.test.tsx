import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { checkA11y } from '../../test-utils/axe';

describe('DropdownMenu', () => {
  it('opens on trigger click', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>새 문서</DropdownMenuItem>
          <DropdownMenuItem>설정</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText('메뉴'));
    expect(await screen.findByText('새 문서')).toBeInTheDocument();
  });

  it('arrow keys navigate items', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>A</DropdownMenuItem>
          <DropdownMenuItem>B</DropdownMenuItem>
          <DropdownMenuItem>C</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText('메뉴'));
    await screen.findByText('A');
    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('A')).toHaveAttribute('data-highlighted');
    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('B')).toHaveAttribute('data-highlighted');
  });

  it('item onSelect fires + closes menu', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect}>새 문서</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText('메뉴'));
    await user.click(await screen.findByText('새 문서'));
    expect(onSelect).toHaveBeenCalled();
    expect(screen.queryByText('새 문서')).not.toBeInTheDocument();
  });

  it('checkbox item toggles', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    function Demo(): React.ReactElement {
      const [checked, setChecked] = React.useState(false);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={checked}
              onCheckedChange={(v): void => {
                setChecked(Boolean(v));
                onChange(v);
              }}
            >
              그리드 표시
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    render(<Demo />);
    await user.click(screen.getByText('메뉴'));
    await user.click(await screen.findByText('그리드 표시'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('passes axe a11y scan (closed)', async () => {
    const { container } = render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>A</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>B</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
