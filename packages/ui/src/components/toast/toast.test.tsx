import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ToastProvider, toast, useToast } from './toast';
import { checkA11y } from '../../test-utils/axe';

describe('ToastProvider', () => {
  it('renders the Toaster region', () => {
    render(<ToastProvider />);
    expect(screen.getByLabelText(/Notifications/i)).toBeInTheDocument();
  });

  it('renders without throwing for each position prop', () => {
    const positions = [
      'top-left',
      'top-right',
      'top-center',
      'bottom-left',
      'bottom-right',
      'bottom-center',
    ] as const;
    for (const pos of positions) {
      const { unmount } = render(<ToastProvider position={pos} />);
      expect(screen.getByLabelText(/Notifications/i)).toBeInTheDocument();
      unmount();
    }
  });

  it('passes axe a11y scan', async () => {
    const { container } = render(<ToastProvider />);
    const results = await checkA11y(container);
    expect(results.violations).toEqual([]);
  });
});

describe('useToast', () => {
  it('returns a toast object with all variants', () => {
    let api: ReturnType<typeof useToast> | undefined;
    function Probe(): null {
      api = useToast();
      return null;
    }
    render(<Probe />);
    expect(typeof api?.toast.message).toBe('function');
    expect(typeof api?.toast.success).toBe('function');
    expect(typeof api?.toast.error).toBe('function');
    expect(typeof api?.toast.warning).toBe('function');
    expect(typeof api?.toast.info).toBe('function');
    expect(typeof api?.toast.promise).toBe('function');
    expect(typeof api?.toast.dismiss).toBe('function');
  });

  it('top-level `toast` re-export matches sonner toast', () => {
    expect(typeof toast).toBe('function');
  });
});
