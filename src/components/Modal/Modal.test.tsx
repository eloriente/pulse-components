import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  describe('Rendering', () => {
    it('renders nothing when closed', () => {
      render(
        <Modal open={false} onClose={() => {}} title="Title">
          Content
        </Modal>,
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders the dialog with its title when open', () => {
      render(
        <Modal open onClose={() => {}} title="Delete item?">
          Content
        </Modal>,
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Delete item?' })).toBeInTheDocument();
    });

    it('uses aria-label as the accessible name when there is no title', () => {
      render(
        <Modal open onClose={() => {}} aria-label="Loading">
          Content
        </Modal>,
      );
      expect(screen.getByRole('dialog', { name: 'Loading' })).toBeInTheDocument();
    });

    it('sets aria-modal="true" on the dialog', () => {
      render(
        <Modal open onClose={() => {}} title="Title">
          Content
        </Modal>,
      );
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });
  });

  describe('Interactions', () => {
    it('calls onClose on Escape', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <Modal open onClose={onClose} title="Title">
          Content
        </Modal>,
      );
      await user.keyboard('{Escape}');
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('does not call onClose on Escape when closeOnEscape is false', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <Modal open onClose={onClose} title="Title" closeOnEscape={false}>
          Content
        </Modal>,
      );
      await user.keyboard('{Escape}');
      expect(onClose).not.toHaveBeenCalled();
    });

    it('calls onClose when the close button is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <Modal open onClose={onClose} title="Title">
          Content
        </Modal>,
      );
      await user.click(screen.getByRole('button', { name: 'Close' }));
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('calls onClose when the backdrop is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <Modal open onClose={onClose} title="Title">
          Content
        </Modal>,
      );
      const backdrop = screen.getByRole('dialog').parentElement as HTMLElement;
      await user.click(backdrop);
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('does not call onClose on backdrop click when closeOnBackdropClick is false', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <Modal open onClose={onClose} title="Title" closeOnBackdropClick={false}>
          Content
        </Modal>,
      );
      const backdrop = screen.getByRole('dialog').parentElement as HTMLElement;
      await user.click(backdrop);
      expect(onClose).not.toHaveBeenCalled();
    });

    it('does not call onClose when clicking inside the panel', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <Modal open onClose={onClose} title="Title">
          <p>Content</p>
        </Modal>,
      );
      await user.click(screen.getByText('Content'));
      expect(onClose).not.toHaveBeenCalled();
    });

    it('moves focus into the panel when it opens', async () => {
      render(
        <Modal open onClose={() => {}} title="Title">
          Content
        </Modal>,
      );
      await waitFor(() => expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus());
    });
  });

  describe('Scroll lock', () => {
    it('locks body scroll while open and restores it on close', () => {
      const { rerender } = render(
        <Modal open={false} onClose={() => {}} title="Title">
          Content
        </Modal>,
      );
      expect(document.body.style.overflow).not.toBe('hidden');

      rerender(
        <Modal open onClose={() => {}} title="Title">
          Content
        </Modal>,
      );
      expect(document.body.style.overflow).toBe('hidden');

      rerender(
        <Modal open={false} onClose={() => {}} title="Title">
          Content
        </Modal>,
      );
      expect(document.body.style.overflow).not.toBe('hidden');
    });
  });

  describe('Styling', () => {
    it('applies a custom className to the panel', () => {
      render(
        <Modal open onClose={() => {}} title="Title" className="my-modal">
          Content
        </Modal>,
      );
      expect(screen.getByRole('dialog').className).toContain('my-modal');
    });
  });
});
