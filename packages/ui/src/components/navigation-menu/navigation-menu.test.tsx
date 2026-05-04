import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './navigation-menu';
import { checkA11y } from '../../test-utils/axe';

/**
 * NOTE: Radix NavigationMenu는 ARIA "menu" 패턴이 아닌 "navigation" 패턴을 사용합니다.
 * 따라서 trigger는 role="menuitem"이 아니라 일반 button입니다.
 */
describe('NavigationMenu', () => {
  it('renders triggers as buttons in a nav', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>제품</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/p1">제품 1</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /제품/ })).toBeInTheDocument();
  });

  it('opens content on trigger click', async () => {
    const user = userEvent.setup();
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>제품</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/p1">제품 1</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );
    const trigger = screen.getByRole('button', { name: /제품/ });
    await user.click(trigger);
    expect(trigger).toHaveAttribute('data-state', 'open');
  });

  it('arrow keys navigate between top-level items', async () => {
    const user = userEvent.setup();
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>A</NavigationMenuTrigger>
            <NavigationMenuContent>A 콘텐츠</NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>B</NavigationMenuTrigger>
            <NavigationMenuContent>B 콘텐츠</NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );
    const a = screen.getByRole('button', { name: /^A/ });
    a.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: /^B/ })).toHaveFocus();
  });

  it('passes axe a11y scan (closed)', async () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/about">소개</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
