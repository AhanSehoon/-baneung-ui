import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Input } from './input';
import { useComposition } from '../../lib/use-composition';
import { checkA11y } from '../../test-utils/axe';

describe('Input — rendering', () => {
  it('renders <input type="text"> by default', () => {
    render(<Input data-testid="i" />);
    const el = screen.getByTestId('i');
    expect(el.tagName).toBe('INPUT');
    expect(el).toHaveAttribute('type', 'text');
  });

  it('honors size variant via class', () => {
    render(<Input size="lg" data-testid="i" />);
    expect(screen.getByTestId('i').className).toMatch(/h-12/);
  });

  it('renders adornments and adjusts padding', () => {
    render(
      <Input
        leftAdornment={<span data-testid="left">$</span>}
        rightAdornment={<span data-testid="right">USD</span>}
        data-testid="i"
      />,
    );
    expect(screen.getByTestId('left')).toBeInTheDocument();
    expect(screen.getByTestId('right')).toBeInTheDocument();
    expect(screen.getByTestId('i').className).toMatch(/pl-10/);
    expect(screen.getByTestId('i').className).toMatch(/pr-10/);
  });
});

describe('Input — interaction', () => {
  it('fires onChange on typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'abc');
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it('disabled prevents typing', async () => {
    const user = userEvent.setup();
    render(<Input disabled defaultValue="" />);
    const el = screen.getByRole('textbox');
    await user.type(el, 'x');
    expect(el).toHaveValue('');
  });
});

describe('Input — IME composition safety', () => {
  it('Enter during composition is suppressed via useComposition', () => {
    const onSubmit = vi.fn();
    function Form(): React.ReactElement {
      const { isComposing, handlers } = useComposition<HTMLInputElement>();
      return (
        <Input
          {...handlers}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isComposing) onSubmit();
          }}
        />
      );
    }
    render(<Form />);
    const input = screen.getByRole('textbox');

    // 한글 IME 조합 시작
    fireEvent.compositionStart(input);
    // 조합 중 Enter — submit 무시되어야 함
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSubmit).not.toHaveBeenCalled();

    // 조합 종료
    fireEvent.compositionEnd(input);
    // 이제 Enter는 submit
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});

describe('Input — a11y', () => {
  it('passes axe scan with adornments', async () => {
    const { container } = render(
      <label>
        가격
        <Input leftAdornment={<span aria-hidden="true">$</span>} placeholder="0.00" />
      </label>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
