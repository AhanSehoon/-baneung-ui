import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from './context-menu';
import { checkA11y } from '../../test-utils/axe';

describe('ContextMenu', () => {
  it('opens on right-click', async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="area">우클릭 영역</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>복사</ContextMenuItem>
          <ContextMenuItem>붙여넣기</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByTestId('area'));
    expect(await screen.findByText('복사')).toBeInTheDocument();
  });

  it('renders trigger area', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div>우클릭</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>복사</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );
    expect(screen.getByText('우클릭')).toBeInTheDocument();
  });

  it('does not show items when not opened', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div>영역</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>복사</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );
    expect(screen.queryByText('복사')).not.toBeInTheDocument();
  });

  it('passes axe a11y scan (closed)', async () => {
    const { container } = render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div>우클릭</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>복사</ContextMenuItem>
          <ContextMenuItem>붙여넣기</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
