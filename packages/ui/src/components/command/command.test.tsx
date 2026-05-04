import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Command } from './command';
import { checkA11y } from '../../test-utils/axe';

describe('Command', () => {
  it('renders items inside a list', () => {
    render(
      <Command label="명령">
        <Command.List>
          <Command.Item>새 문서</Command.Item>
          <Command.Item>설정</Command.Item>
        </Command.List>
      </Command>,
    );
    expect(screen.getByText('새 문서')).toBeInTheDocument();
    expect(screen.getByText('설정')).toBeInTheDocument();
  });

  it('filters items via Input value', async () => {
    const user = userEvent.setup();
    render(
      <Command label="명령">
        <Command.Input placeholder="검색" />
        <Command.List>
          <Command.Empty>없음</Command.Empty>
          <Command.Item>Apple</Command.Item>
          <Command.Item>Banana</Command.Item>
          <Command.Item>Cherry</Command.Item>
        </Command.List>
      </Command>,
    );
    const input = screen.getByPlaceholderText('검색');
    await user.type(input, 'Ban');
    expect(screen.getByText('Banana')).toBeVisible();
  });

  it('shows Empty state when no match', async () => {
    const user = userEvent.setup();
    render(
      <Command label="명령">
        <Command.Input placeholder="검색" />
        <Command.List>
          <Command.Empty>없음</Command.Empty>
          <Command.Item>Apple</Command.Item>
        </Command.List>
      </Command>,
    );
    await user.type(screen.getByPlaceholderText('검색'), 'zzz');
    expect(screen.getByText('없음')).toBeInTheDocument();
  });

  it('triggers onSelect on item click', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Command label="명령">
        <Command.List>
          <Command.Item onSelect={onSelect}>실행</Command.Item>
        </Command.List>
      </Command>,
    );
    await user.click(screen.getByText('실행'));
    expect(onSelect).toHaveBeenCalled();
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(
      <Command label="명령 메뉴">
        <Command.Input placeholder="검색" />
        <Command.List>
          <Command.Empty>결과 없음</Command.Empty>
          <Command.Group heading="액션">
            <Command.Item>새 문서</Command.Item>
            <Command.Item>설정</Command.Item>
          </Command.Group>
        </Command.List>
      </Command>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
