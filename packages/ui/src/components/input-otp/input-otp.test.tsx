import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { InputOTP } from './input-otp';
import { checkA11y } from '../../test-utils/axe';

describe('InputOTP', () => {
  it('renders N slots (default 6)', () => {
    render(<InputOTP aria-label="OTP" />);
    expect(screen.getAllByRole('textbox')).toHaveLength(6);
  });

  it('typing a digit advances focus to the next slot', async () => {
    const user = userEvent.setup();
    render(<InputOTP aria-label="OTP" length={4} />);
    const slots = screen.getAllByRole('textbox');
    slots[0].focus();
    await user.keyboard('1');
    expect(slots[1]).toHaveFocus();
  });

  it('non-numeric character is rejected (default pattern)', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<InputOTP aria-label="OTP" length={4} onValueChange={onChange} />);
    const slots = screen.getAllByRole('textbox');
    slots[0].focus();
    await user.keyboard('a');
    expect(onChange).not.toHaveBeenCalled();
    expect(slots[0]).toHaveValue('');
  });

  it('paste distributes digits across slots and triggers onComplete', () => {
    const onComplete = vi.fn();
    const onChange = vi.fn();
    render(
      <InputOTP aria-label="OTP" length={4} onValueChange={onChange} onComplete={onComplete} />,
    );
    const slots = screen.getAllByRole('textbox');
    fireEvent.paste(slots[0], {
      clipboardData: { getData: (): string => '1234' },
    });
    expect(onChange).toHaveBeenCalledWith('1234');
    expect(onComplete).toHaveBeenCalledWith('1234');
  });

  it('Backspace on empty slot moves focus to previous slot', async () => {
    const user = userEvent.setup();
    render(<InputOTP aria-label="OTP" length={4} defaultValue="12" />);
    const slots = screen.getAllByRole('textbox');
    slots[2].focus();
    await user.keyboard('{Backspace}');
    expect(slots[1]).toHaveFocus();
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(
      <label htmlFor="code">
        2단계 인증 코드
        <InputOTP id="code" aria-label="인증 코드" length={6} />
      </label>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
