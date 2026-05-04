import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';
import { checkA11y } from '../../test-utils/axe';

describe('AlertDialog', () => {
  it('opens with role="alertdialog"', async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger>삭제</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>정말?</AlertDialogTitle>
          <AlertDialogDescription>되돌릴 수 없음</AlertDialogDescription>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction>확인</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );
    await user.click(screen.getByText('삭제'));
    expect(await screen.findByRole('alertdialog')).toBeInTheDocument();
  });

  it('Cancel button closes the dialog', async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger>삭제</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>정말?</AlertDialogTitle>
          <AlertDialogDescription>되돌릴 수 없음</AlertDialogDescription>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction>확인</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );
    await user.click(screen.getByText('삭제'));
    expect(await screen.findByRole('alertdialog')).toBeInTheDocument();
    await user.click(screen.getByText('취소'));
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('Action button fires onClick and closes', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <AlertDialog>
        <AlertDialogTrigger>삭제</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>정말?</AlertDialogTitle>
          <AlertDialogDescription>되돌릴 수 없음</AlertDialogDescription>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>확인</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );
    await user.click(screen.getByText('삭제'));
    await user.click(await screen.findByText('확인'));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('passes axe a11y scan (open)', async () => {
    const { container } = render(
      <AlertDialog open>
        <AlertDialogTrigger>삭제</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>정말?</AlertDialogTitle>
          <AlertDialogDescription>되돌릴 수 없음</AlertDialogDescription>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction>확인</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
