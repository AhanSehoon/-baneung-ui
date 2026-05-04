import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from './menubar';
import { checkA11y } from '../../test-utils/axe';

describe('Menubar', () => {
  it('renders triggers in a menubar role', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>파일</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>새 문서</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>편집</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>실행 취소</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );
    expect(screen.getByRole('menubar')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });

  it('opens menu on trigger click', async () => {
    const user = userEvent.setup();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>파일</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>새 문서</MenubarItem>
            <MenubarItem>열기</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );
    await user.click(screen.getByRole('menuitem', { name: '파일' }));
    expect(await screen.findByText('새 문서')).toBeInTheDocument();
  });

  it('item onSelect fires on click', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>파일</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={onSelect}>새 문서</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );
    await user.click(screen.getByRole('menuitem', { name: '파일' }));
    await user.click(await screen.findByText('새 문서'));
    expect(onSelect).toHaveBeenCalled();
  });

  it('arrow keys navigate top-level menus', async () => {
    const user = userEvent.setup();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>파일</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>새 문서</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>편집</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>복사</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );
    const file = screen.getByRole('menuitem', { name: '파일' });
    file.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('menuitem', { name: '편집' })).toHaveFocus();
  });

  it('passes axe a11y scan (closed)', async () => {
    const { container } = render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>파일</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>새 문서</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
