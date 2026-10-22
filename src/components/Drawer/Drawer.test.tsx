import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Drawer } from './Drawer';

describe('Drawer', () => {
  describe('Rendering', () => {
    it('renders nothing when closed', () => {
      render(
        <Drawer open={false} onClose={() => {}} title="Title">
          Content
        </Drawer>,
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders the dialog with its title when open', () => {
      render(
        <Drawer open onClose={() => {}} title="Filters">
          Content
        </Drawer>,
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Filters' })).toBeInTheDocument();
    });

    it('uses aria-label as the accessible name when there is no title', () => {
      render(
        <Drawer open onClose={() => {}} aria-label="Loading">
          Content
        </Drawer>,
      );
      expect(screen.getByRole('dialog', { name: 'Loading' })).toBeInTheDocument();
    });

    it('sets aria-modal="true" on the dialog', () => {
      render(
        <Drawer open onClose={() => {}} title="Title">
          Content
        </Drawer>,
      );
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });
  });

  describe('Placement', () => {
    it.each(['left', 'right', 'top', 'bottom'] as const)(
      'applies %s placement class',
      (placement) => {
        render(
          <Drawer open onClose={() => {}} title="Title" placement={placement}>
            Content
          </Drawer>,
        );
        expect(screen.getByRole('dialog').className).toContain(placement);
      },
    );

    it('defaults to right placement', () => {
      render(
        <Drawer open onClose={() => {}} title="Title">
          Content
        </Drawer>,
      );
      expect(screen.getByRole('dialog').className).toContain('right');
    });
  });

  describe('Size', () => {
    it.each(['sm', 'md', 'lg'] as const)('sets the --pulse-drawer-size custom property for %s', (size) => {
      render(
        <Drawer open onClose={() => {}} title="Title" size={size}>
          Content
        </Drawer>,
      );
      expect(screen.getByRole('dialog').style.getPropertyValue('--pulse-drawer-size')).not.toBe('');
    });

    it('defaults to md size', () => {
      render(
        <Drawer open onClose={() => {}} title="Title">
          Content
        </Drawer>,
      );
      expect(screen.getByRole('dialog').style.getPropertyValue('--pulse-drawer-size')).toBe('360px');
    });
  });

  describe('Interactions', () => {
    it('calls onClose on Escape', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <Drawer open onClose={onClose} title="Title">
          Content
        </Drawer>,
      );
      await user.keyboard('{Escape}');
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('does not call onClose on Escape when closeOnEscape is false', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <Drawer open onClose={onClose} title="Title" closeOnEscape={false}>
          Content
        </Drawer>,
      );
      await user.keyboard('{Escape}');
      expect(onClose).not.toHaveBeenCalled();
    });

    it('calls onClose when the close button is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <Drawer open onClose={onClose} title="Title">
          Content
        </Drawer>,
      );
      await user.click(screen.getByRole('button', { name: 'Close' }));
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('calls onClose when the backdrop is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <Drawer open onClose={onClose} title="Title">
          Content
        </Drawer>,
      );
      const backdrop = screen.getByRole('dialog').parentElement as HTMLElement;
      await user.click(backdrop);
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('does not call onClose on backdrop click when closeOnBackdropClick is false', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <Drawer open onClose={onClose} title="Title" closeOnBackdropClick={false}>
          Content
        </Drawer>,
      );
      const backdrop = screen.getByRole('dialog').parentElement as HTMLElement;
      await user.click(backdrop);
      expect(onClose).not.toHaveBeenCalled();
    });

    it('does not call onClose when clicking inside the panel', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <Drawer open onClose={onClose} title="Title">
          <p>Content</p>
        </Drawer>,
      );
      await user.click(screen.getByText('Content'));
      expect(onClose).not.toHaveBeenCalled();
    });

    it('moves focus into the panel when it opens', async () => {
      render(
        <Drawer open onClose={() => {}} title="Title">
          Content
        </Drawer>,
      );
      await waitFor(() => expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus());
    });
  });

  describe('Scroll lock', () => {
    it('locks body scroll while open and restores it on close', () => {
      const { rerender } = render(
        <Drawer open={false} onClose={() => {}} title="Title">
          Content
        </Drawer>,
      );
      expect(document.body.style.overflow).not.toBe('hidden');

      rerender(
        <Drawer open onClose={() => {}} title="Title">
          Content
        </Drawer>,
      );
      expect(document.body.style.overflow).toBe('hidden');

      rerender(
        <Drawer open={false} onClose={() => {}} title="Title">
          Content
        </Drawer>,
      );
      expect(document.body.style.overflow).not.toBe('hidden');
    });
  });

  describe('Styling', () => {
    it('applies a custom className to the panel', () => {
      render(
        <Drawer open onClose={() => {}} title="Title" className="my-drawer">
          Content
        </Drawer>,
      );
      expect(screen.getByRole('dialog').className).toContain('my-drawer');
    });
  });
});
