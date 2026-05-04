import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { InputGroup } from './input-group';
import { checkA11y } from '../../test-utils/axe';
import { Button } from '../button';
import { Input } from '../input';

describe('InputGroup', () => {
  it('renders role="group"', () => {
    render(
      <InputGroup aria-label="search">
        <Input placeholder="검색어" />
        <Button variant="outline">검색</Button>
      </InputGroup>,
    );
    expect(screen.getByRole('group', { name: 'search' })).toBeInTheDocument();
  });

  it('keeps both Input and Button focusable', () => {
    render(
      <InputGroup aria-label="g">
        <Input data-testid="inp" />
        <Button>Go</Button>
      </InputGroup>,
    );
    expect(screen.getByTestId('inp')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go' })).toBeInTheDocument();
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(
      <label>
        검색
        <InputGroup aria-label="search">
          <Input placeholder="검색어" />
          <Button variant="outline">검색</Button>
        </InputGroup>
      </label>,
    );
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
