import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { ToastProvider } from './ToastProvider';
import { useToast } from './useToast';

function Demo() {
  const { toast } = useToast();
  return (
    <button
      type="button"
      onClick={() => toast({ title: 'Saved', description: 'Your changes were saved.' })}
    >
      Trigger
    </button>
  );
}

describe('Toast', () => {
  describe('useToast', () => {
    it('throws when used outside a ToastProvider', () => {
      // Suppress the expected React error-boundary console.error noise for this assertion.
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => render(<Demo />)).toThrow('useToast must be used within a <ToastProvider>');
      spy.mockRestore();
    });
  });

  describe('Rendering', () => {
    it('renders nothing in the viewport before any toast is queued', () => {
      render(
        <ToastProvider>
          <Demo />
        </ToastProvider>,
      );
      expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument();
    });

    it('renders a toast with its title and description when queued', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <Demo />
        </ToastProvider>,
      );
      await user.click(screen.getByRole('button', { name: 'Trigger' }));
      expect(await screen.findByText('Saved')).toBeInTheDocument();
      expect(screen.getByText('Your changes were saved.')).toBeInTheDocument();
    });

    it('renders the notifications region with a polite live region', () => {
      render(
        <ToastProvider>
          <Demo />
        </ToastProvider>,
      );
      const region = screen.getByRole('region', { name: 'Notifications' });
      expect(region).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Interactions', () => {
    it('dismisses a toast when its close button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <Demo />
        </ToastProvider>,
      );
      await user.click(screen.getByRole('button', { name: 'Trigger' }));
      await screen.findByText('Saved');
      await user.click(screen.getByRole('button', { name: 'Dismiss' }));
      await waitFor(() => expect(screen.queryByText('Saved')).not.toBeInTheDocument());
    });

    it('stacks multiple toasts', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <Demo />
        </ToastProvider>,
      );
      await user.click(screen.getByRole('button', { name: 'Trigger' }));
      await user.click(screen.getByRole('button', { name: 'Trigger' }));
      await waitFor(() =>
        expect(screen.getAllByRole('button', { name: 'Dismiss' })).toHaveLength(2),
      );
    });
  });

  describe('Auto-dismiss', () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('auto-dismisses after the given duration', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      function DurationDemo() {
        const { toast } = useToast();
        return (
          <button type="button" onClick={() => toast({ title: 'Quick', duration: 1000 })}>
            Trigger
          </button>
        );
      }
      render(
        <ToastProvider>
          <DurationDemo />
        </ToastProvider>,
      );
      await user.click(screen.getByRole('button', { name: 'Trigger' }));
      expect(screen.getByText('Quick')).toBeInTheDocument();
      vi.advanceTimersByTime(1000);
      await waitFor(() => expect(screen.queryByText('Quick')).not.toBeInTheDocument());
    });

    it('does not auto-dismiss when duration is 0', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      function PersistentDemo() {
        const { toast } = useToast();
        return (
          <button type="button" onClick={() => toast({ title: 'Sticky', duration: 0 })}>
            Trigger
          </button>
        );
      }
      render(
        <ToastProvider>
          <PersistentDemo />
        </ToastProvider>,
      );
      await user.click(screen.getByRole('button', { name: 'Trigger' }));
      vi.advanceTimersByTime(60000);
      expect(screen.getByText('Sticky')).toBeInTheDocument();
    });
  });

  describe('Positioning', () => {
    it('applies the position class to the viewport', () => {
      render(
        <ToastProvider position="top-left">
          <Demo />
        </ToastProvider>,
      );
      expect(screen.getByRole('region', { name: 'Notifications' }).className).toContain(
        'top-left',
      );
    });
  });
});
