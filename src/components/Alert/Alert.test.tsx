import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Alert } from './Alert';

describe('Alert', () => {
  describe('Rendering', () => {
    it('renders as an alert role', () => {
      render(<Alert title="Title">Description</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders the title and description', () => {
      render(<Alert title="Trial ending soon">Your trial ends in 3 days.</Alert>);
      expect(screen.getByText('Trial ending soon')).toBeInTheDocument();
      expect(screen.getByText('Your trial ends in 3 days.')).toBeInTheDocument();
    });

    it('renders without a title', () => {
      render(<Alert>Just a message</Alert>);
      expect(screen.getByText('Just a message')).toBeInTheDocument();
    });

    it('does not render a dismiss button by default', () => {
      render(<Alert title="Title">Description</Alert>);
      expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('applies info class by default', () => {
      render(<Alert title="Title">Description</Alert>);
      expect(screen.getByRole('alert').className).toContain('info');
    });

    it.each(['info', 'success', 'warning', 'error'] as const)('applies %s variant class', (variant) => {
      render(
        <Alert variant={variant} title="Title">
          Description
        </Alert>,
      );
      expect(screen.getByRole('alert').className).toContain(variant);
    });
  });

  describe('Dismissible', () => {
    it('renders a dismiss button when dismissible is true', () => {
      render(
        <Alert title="Title" dismissible onDismiss={() => {}}>
          Description
        </Alert>,
      );
      expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
    });

    it('calls onDismiss when the dismiss button is clicked', async () => {
      const user = userEvent.setup();
      const onDismiss = vi.fn();
      render(
        <Alert title="Title" dismissible onDismiss={onDismiss}>
          Description
        </Alert>,
      );
      await user.click(screen.getByRole('button', { name: 'Dismiss' }));
      expect(onDismiss).toHaveBeenCalledOnce();
    });
  });

  describe('Auto-dismiss', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('does not auto-dismiss by default', () => {
      const onDismiss = vi.fn();
      render(
        <Alert title="Title" onDismiss={onDismiss}>
          Description
        </Alert>,
      );
      vi.advanceTimersByTime(60000);
      expect(onDismiss).not.toHaveBeenCalled();
    });

    it('calls onDismiss after the default delay when autoDismiss is true', () => {
      const onDismiss = vi.fn();
      render(
        <Alert title="Title" autoDismiss onDismiss={onDismiss}>
          Description
        </Alert>,
      );
      vi.advanceTimersByTime(7999);
      expect(onDismiss).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(onDismiss).toHaveBeenCalledOnce();
    });

    it('uses a custom autoDismissDelay', () => {
      const onDismiss = vi.fn();
      render(
        <Alert title="Title" autoDismiss autoDismissDelay={2000} onDismiss={onDismiss}>
          Description
        </Alert>,
      );
      vi.advanceTimersByTime(1999);
      expect(onDismiss).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(onDismiss).toHaveBeenCalledOnce();
    });

    it('clears the timer on unmount', () => {
      const onDismiss = vi.fn();
      const { unmount } = render(
        <Alert title="Title" autoDismiss autoDismissDelay={1000} onDismiss={onDismiss}>
          Description
        </Alert>,
      );
      unmount();
      vi.advanceTimersByTime(1000);
      expect(onDismiss).not.toHaveBeenCalled();
    });

    it('does not restart the timer when onDismiss changes reference', () => {
      const firstOnDismiss = vi.fn();
      const secondOnDismiss = vi.fn();
      const { rerender } = render(
        <Alert title="Title" autoDismiss autoDismissDelay={1000} onDismiss={firstOnDismiss}>
          Description
        </Alert>,
      );
      vi.advanceTimersByTime(500);
      rerender(
        <Alert title="Title" autoDismiss autoDismissDelay={1000} onDismiss={secondOnDismiss}>
          Description
        </Alert>,
      );
      vi.advanceTimersByTime(500);
      expect(firstOnDismiss).not.toHaveBeenCalled();
      expect(secondOnDismiss).toHaveBeenCalledOnce();
    });

    it('restarts the timer when autoDismissDelay changes', () => {
      const onDismiss = vi.fn();
      const { rerender } = render(
        <Alert title="Title" autoDismiss autoDismissDelay={1000} onDismiss={onDismiss}>
          Description
        </Alert>,
      );
      vi.advanceTimersByTime(500);
      rerender(
        <Alert title="Title" autoDismiss autoDismissDelay={2000} onDismiss={onDismiss}>
          Description
        </Alert>,
      );
      vi.advanceTimersByTime(500);
      expect(onDismiss).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1500);
      expect(onDismiss).toHaveBeenCalledOnce();
    });
  });

  describe('Styling', () => {
    it('applies a custom className', () => {
      render(
        <Alert title="Title" className="my-alert">
          Description
        </Alert>,
      );
      expect(screen.getByRole('alert').className).toContain('my-alert');
    });
  });
});
