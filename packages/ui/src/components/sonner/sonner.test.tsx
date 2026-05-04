import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Sonner, toast } from './sonner';
import { checkA11y } from '../../test-utils/axe';

describe('Sonner', () => {
  it('renders Toaster region', () => {
    render(<Sonner />);
    // sonner는 section role과 aria-label="Notifications"를 사용
    expect(screen.getByLabelText(/Notifications/i)).toBeInTheDocument();
  });

  it('exposes toast function', () => {
    expect(typeof toast).toBe('function');
    expect(typeof toast.success).toBe('function');
    expect(typeof toast.error).toBe('function');
  });

  it('passes axe a11y scan (empty)', async () => {
    const { container } = render(<Sonner />);
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});
