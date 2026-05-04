import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { NativeSelect } from './native-select';
import { checkA11y } from '../../test-utils/axe';
import { Field, FieldLabel } from '../field';

describe('NativeSelect', () => {
  it('renders <select> with options', () => {
    render(
      <NativeSelect aria-label="도시">
        <option value="seoul">서울</option>
        <option value="busan">부산</option>
      </NativeSelect>,
    );
    const sel = screen.getByRole('combobox', { name: '도시' });
    expect(sel.tagName).toBe('SELECT');
  });

  it('changes value via user selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <NativeSelect aria-label="도시" defaultValue="seoul" onChange={onChange}>
        <option value="seoul">서울</option>
        <option value="busan">부산</option>
      </NativeSelect>,
    );
    await user.selectOptions(screen.getByRole('combobox'), 'busan');
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByRole('combobox')).toHaveValue('busan');
  });

  it('respects Field context (id + aria-required + disabled)', () => {
    render(
      <Field required disabled>
        <FieldLabel>도시</FieldLabel>
        <NativeSelect>
          <option value="seoul">서울</option>
        </NativeSelect>
      </Field>,
    );
    const sel = screen.getByRole('combobox', { name: /도시/ });
    expect(sel).toBeDisabled();
    expect(sel).toHaveAttribute('aria-required', 'true');
  });

  it('passes axe a11y scan with Field', async () => {
    const { container } = render(
      <Field>
        <FieldLabel>도시</FieldLabel>
        <NativeSelect>
          <option value="seoul">서울</option>
          <option value="busan">부산</option>
        </NativeSelect>
      </Field>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
