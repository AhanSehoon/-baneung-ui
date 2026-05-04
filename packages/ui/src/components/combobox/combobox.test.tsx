import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Combobox } from './combobox';
import { checkA11y } from '../../test-utils/axe';

const fruits = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

describe('Combobox', () => {
  it('renders trigger with placeholder', () => {
    render(<Combobox options={fruits} aria-label="과일" placeholder="과일" />);
    expect(screen.getByRole('combobox', { name: '과일' })).toHaveTextContent('과일');
  });

  it('opens, types to filter, picks option', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Combobox options={fruits} aria-label="과일" placeholder="과일" onValueChange={onChange} />,
    );
    await user.click(screen.getByRole('combobox'));
    const input = await screen.findByPlaceholderText('검색…');
    await user.type(input, 'Ban');
    await user.click(await screen.findByText('Banana'));
    expect(onChange).toHaveBeenLastCalledWith('banana');
  });

  it('allowFreeText accepts non-listed value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Combobox
        options={fruits}
        allowFreeText
        aria-label="과일"
        placeholder="과일"
        onValueChange={onChange}
      />,
    );
    await user.click(screen.getByRole('combobox'));
    const input = await screen.findByPlaceholderText('검색…');
    await user.type(input, 'Durian');
    const addBtn = await screen.findByText(/Durian/);
    await user.click(addBtn);
    expect(onChange).toHaveBeenLastCalledWith('Durian');
  });

  it('passes axe a11y scan (closed)', async () => {
    const { container } = render(
      <Combobox options={fruits} aria-label="과일" placeholder="과일" />,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
