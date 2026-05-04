import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Textarea } from './textarea';
import { useComposition } from '../../lib/use-composition';
import { checkA11y } from '../../test-utils/axe';

describe('Textarea', () => {
  it('renders <textarea>', () => {
    render(<Textarea data-testid="t" />);
    expect(screen.getByTestId('t').tagName).toBe('TEXTAREA');
  });

  it('fires onChange on typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'hi');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('disabled prevents input', async () => {
    const user = userEvent.setup();
    render(<Textarea disabled />);
    const el = screen.getByRole('textbox');
    await user.type(el, 'x');
    expect(el).toHaveValue('');
  });

  it('IME composition: Enter during composition is suppressed via useComposition', () => {
    const onSubmit = vi.fn();
    function Form(): React.ReactElement {
      const { isComposing, handlers } = useComposition<HTMLTextAreaElement>();
      return (
        <Textarea
          {...handlers}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isComposing) onSubmit();
          }}
        />
      );
    }
    render(<Form />);
    const ta = screen.getByRole('textbox');

    fireEvent.compositionStart(ta);
    fireEvent.keyDown(ta, { key: 'Enter' });
    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.compositionEnd(ta);
    fireEvent.keyDown(ta, { key: 'Enter' });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('autoResize=true applies resize-none class', () => {
    render(<Textarea autoResize data-testid="t" />);
    expect(screen.getByTestId('t').className).toMatch(/resize-none/);
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(
      <label>
        설명
        <Textarea placeholder="자세히 입력하세요" />
      </label>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
