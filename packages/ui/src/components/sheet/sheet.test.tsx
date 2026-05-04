import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from './sheet';
import { checkA11y } from '../../test-utils/axe';

describe('Sheet', () => {
  it('opens with role="dialog"', async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger>열기</SheetTrigger>
        <SheetContent>
          <SheetTitle>제목</SheetTitle>
          <SheetDescription>설명</SheetDescription>
        </SheetContent>
      </Sheet>,
    );
    await user.click(screen.getByText('열기'));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('side variant applies correct classes', async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger>열기</SheetTrigger>
        <SheetContent side="left" data-testid="content">
          <SheetTitle>제목</SheetTitle>
          <SheetDescription>설명</SheetDescription>
        </SheetContent>
      </Sheet>,
    );
    await user.click(screen.getByText('열기'));
    const content = await screen.findByTestId('content');
    expect(content.className).toMatch(/inset-y-0/);
    expect(content.className).toMatch(/left-0/);
  });

  it('closes on Esc', async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger>열기</SheetTrigger>
        <SheetContent>
          <SheetTitle>제목</SheetTitle>
          <SheetDescription>설명</SheetDescription>
        </SheetContent>
      </Sheet>,
    );
    await user.click(screen.getByText('열기'));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('passes axe a11y scan (open)', async () => {
    const { container } = render(
      <Sheet open>
        <SheetTrigger>열기</SheetTrigger>
        <SheetContent>
          <SheetTitle>설정</SheetTitle>
          <SheetDescription>패널</SheetDescription>
        </SheetContent>
      </Sheet>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
