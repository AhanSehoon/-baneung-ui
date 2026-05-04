import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Field, FieldDescription, FieldError, FieldLabel } from './field';
import { checkA11y } from '../../test-utils/axe';
import { Input } from '../input';
import { Textarea } from '../textarea';

describe('Field — auto a11y wiring', () => {
  it('label htmlFor matches Input id (auto-generated)', () => {
    render(
      <Field>
        <FieldLabel>이메일</FieldLabel>
        <Input />
      </Field>,
    );
    const input = screen.getByRole('textbox');
    const label = screen.getByText('이메일');
    expect(label).toHaveAttribute('for', input.id);
    expect(input.id).toBeTruthy();
  });

  it('label click focuses the input', async () => {
    const user = userEvent.setup();
    render(
      <Field>
        <FieldLabel>이름</FieldLabel>
        <Input />
      </Field>,
    );
    await user.click(screen.getByText('이름'));
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('invalid=true sets aria-invalid and links Error via aria-describedby', () => {
    render(
      <Field invalid>
        <FieldLabel>이메일</FieldLabel>
        <Input />
        <FieldError>유효하지 않습니다</FieldError>
      </Field>,
    );
    const input = screen.getByRole('textbox');
    const errorEl = screen.getByRole('alert');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby') ?? '').toContain(errorEl.id);
  });

  it('description gets linked via aria-describedby', () => {
    render(
      <Field>
        <FieldLabel>이메일</FieldLabel>
        <FieldDescription>업무용 이메일을 입력</FieldDescription>
        <Input />
      </Field>,
    );
    const input = screen.getByRole('textbox');
    const desc = screen.getByText('업무용 이메일을 입력');
    expect(input.getAttribute('aria-describedby') ?? '').toContain(desc.id);
  });

  it('required=true shows asterisk and sets aria-required', () => {
    render(
      <Field required>
        <FieldLabel>전화</FieldLabel>
        <Input />
      </Field>,
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'true');
    // 시각 표시 별표
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('disabled cascades to control', () => {
    render(
      <Field disabled>
        <FieldLabel>잠김</FieldLabel>
        <Input />
      </Field>,
    );
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('works with Textarea too (same context)', () => {
    render(
      <Field invalid>
        <FieldLabel>설명</FieldLabel>
        <Textarea />
        <FieldError>너무 짧음</FieldError>
      </Field>,
    );
    const ta = screen.getByRole('textbox');
    expect(ta.tagName).toBe('TEXTAREA');
    expect(ta).toHaveAttribute('aria-invalid', 'true');
  });

  it('passes axe a11y scan for full Field composition', async () => {
    const { container } = render(
      <Field invalid required>
        <FieldLabel>이메일</FieldLabel>
        <FieldDescription>업무용 이메일</FieldDescription>
        <Input type="email" />
        <FieldError>형식이 올바르지 않습니다</FieldError>
      </Field>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
