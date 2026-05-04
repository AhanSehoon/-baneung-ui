import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Label } from './label';
import { checkA11y } from '../../test-utils/axe';

describe('Label', () => {
  it('renders as a <label> element', () => {
    render(<Label htmlFor="email">이메일</Label>);
    const label = screen.getByText('이메일');
    expect(label.tagName).toBe('LABEL');
  });

  it('connects to a control via htmlFor (label click focuses input)', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Label htmlFor="name">이름</Label>
        <input id="name" />
      </>,
    );
    await user.click(screen.getByText('이름'));
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(
      <>
        <Label htmlFor="phone">전화번호</Label>
        <input id="phone" type="tel" />
      </>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
