import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Alert, AlertDescription, AlertTitle } from './alert';
import { checkA11y } from '../../test-utils/axe';

describe('Alert', () => {
  it('default variant=info uses role="status" + aria-live=polite', () => {
    render(
      <Alert>
        <AlertTitle>알림</AlertTitle>
      </Alert>,
    );
    const el = screen.getByRole('status');
    expect(el).toHaveAttribute('aria-live', 'polite');
  });

  it('variant=danger uses role="alert" + aria-live=assertive', () => {
    render(
      <Alert variant="danger">
        <AlertTitle>오류</AlertTitle>
      </Alert>,
    );
    const el = screen.getByRole('alert');
    expect(el).toHaveAttribute('aria-live', 'assertive');
  });

  it.each(['info', 'success', 'warning', 'danger'] as const)(
    'variant %s applies tone classes',
    (v) => {
      render(
        <Alert variant={v} data-testid="a">
          <AlertTitle>알림</AlertTitle>
        </Alert>,
      );
      expect(screen.getByTestId('a').className).toMatch(
        new RegExp(`text-${v === 'danger' ? 'danger' : v}`),
      );
    },
  );

  it('onDismiss renders close button + fires callback', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <Alert onDismiss={onDismiss}>
        <AlertTitle>알림</AlertTitle>
      </Alert>,
    );
    await user.click(screen.getByRole('button', { name: '닫기' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('passes axe a11y scan with title + description', async () => {
    const { container } = render(
      <Alert variant="warning">
        <AlertTitle>주의</AlertTitle>
        <AlertDescription>저장되지 않은 변경 사항이 있습니다.</AlertDescription>
      </Alert>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
