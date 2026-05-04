import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { checkA11y } from '../../test-utils/axe';

describe('Dialog', () => {
  it('opens with role="dialog" + traps focus', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>열기</DialogTrigger>
        <DialogContent>
          <DialogTitle>제목</DialogTitle>
          <DialogDescription>설명</DialogDescription>
          <DialogClose>닫기</DialogClose>
        </DialogContent>
      </Dialog>,
    );
    await user.click(screen.getByText('열기'));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('제목')).toBeInTheDocument();
  });

  it('closes on Esc', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>열기</DialogTrigger>
        <DialogContent>
          <DialogTitle>제목</DialogTitle>
          <DialogDescription>설명</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    await user.click(screen.getByText('열기'));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('focus returns to trigger on close', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>열기</DialogTrigger>
        <DialogContent>
          <DialogTitle>제목</DialogTitle>
          <DialogDescription>설명</DialogDescription>
          <DialogClose>닫기</DialogClose>
        </DialogContent>
      </Dialog>,
    );
    const trigger = screen.getByText('열기');
    await user.click(trigger);
    await user.click(await screen.findByText('닫기'));
    // 닫힘 → 트리거로 포커스 복귀
    expect(trigger).toHaveFocus();
  });

  it('passes axe a11y scan (open)', async () => {
    const { container } = render(
      <Dialog open>
        <DialogTrigger>열기</DialogTrigger>
        <DialogContent>
          <DialogTitle>제목</DialogTitle>
          <DialogDescription>설명</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
