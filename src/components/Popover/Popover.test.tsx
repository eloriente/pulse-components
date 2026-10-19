import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Popover } from './Popover';

describe('Popover', () => {
  describe('Rendering', () => {
    it('renders the trigger without showing the panel initially', () => {
      render(
        <Popover content={<div>Panel content</div>} aria-label="Panel">
          <button type="button">Open</button>
        </Popover>,
      );
      expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
      expect(screen.queryByText('Panel content')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('opens the panel on trigger click', async () => {
      const user = userEvent.setup();
      render(
        <Popover content={<div>Panel content</div>} aria-label="Panel">
          <button type="button">Open</button>
        </Popover>,
      );
      await user.click(screen.getByRole('button', { name: 'Open' }));
      await waitFor(() => expect(screen.getByText('Panel content')).toBeInTheDocument());
    });

    it('toggles closed on a second trigger click', async () => {
      const user = userEvent.setup();
      render(
        <Popover content={<div>Panel content</div>} aria-label="Panel">
          <button type="button">Open</button>
        </Popover>,
      );
      const trigger = screen.getByRole('button', { name: 'Open' });
      await user.click(trigger);
      await waitFor(() => expect(screen.getByText('Panel content')).toBeInTheDocument());
      await user.click(trigger);
      await waitFor(() => expect(screen.queryByText('Panel content')).not.toBeInTheDocument());
    });

    it('moves focus into the panel when it opens', async () => {
      const user = userEvent.setup();
      render(
        <Popover content={<button type="button">Focusable action</button>} aria-label="Panel">
          <button type="button">Open</button>
        </Popover>,
      );
      await user.click(screen.getByRole('button', { name: 'Open' }));
      await waitFor(() =>
        expect(screen.getByRole('button', { name: 'Focusable action' })).toHaveFocus(),
      );
    });

    it('closes on Escape and returns focus to the trigger', async () => {
      const user = userEvent.setup();
      render(
        <Popover content={<div>Panel content</div>} aria-label="Panel">
          <button type="button">Open</button>
        </Popover>,
      );
      const trigger = screen.getByRole('button', { name: 'Open' });
      await user.click(trigger);
      await waitFor(() => expect(screen.getByText('Panel content')).toBeInTheDocument());
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByText('Panel content')).not.toBeInTheDocument());
      await waitFor(() => expect(trigger).toHaveFocus());
    });

    it('closes on outside click', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Popover content={<div>Panel content</div>} aria-label="Panel">
            <button type="button">Open</button>
          </Popover>
          <button type="button">Outside</button>
        </div>,
      );
      await user.click(screen.getByRole('button', { name: 'Open' }));
      await waitFor(() => expect(screen.getByText('Panel content')).toBeInTheDocument());
      await user.click(screen.getByRole('button', { name: 'Outside' }));
      await waitFor(() => expect(screen.queryByText('Panel content')).not.toBeInTheDocument());
    });
  });

  describe('Controlled mode', () => {
    it('calls onOpenChange instead of opening itself when controlled', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <Popover
          content={<div>Panel content</div>}
          aria-label="Panel"
          open={false}
          onOpenChange={onOpenChange}
        >
          <button type="button">Open</button>
        </Popover>,
      );
      await user.click(screen.getByRole('button', { name: 'Open' }));
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(screen.queryByText('Panel content')).not.toBeInTheDocument();
    });

    it('renders the panel when the controlled open prop is true', () => {
      render(
        <Popover content={<div>Panel content</div>} aria-label="Panel" open onOpenChange={() => {}}>
          <button type="button">Open</button>
        </Popover>,
      );
      expect(screen.getByText('Panel content')).toBeInTheDocument();
    });
  });

  describe('Disabled', () => {
    it('never opens the panel when disabled', async () => {
      const user = userEvent.setup();
      render(
        <Popover content={<div>Panel content</div>} aria-label="Panel" disabled>
          <button type="button">Open</button>
        </Popover>,
      );
      await user.click(screen.getByRole('button', { name: 'Open' }));
      expect(screen.queryByText('Panel content')).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies a custom className to the panel', async () => {
      const user = userEvent.setup();
      render(
        <Popover content={<div>Panel content</div>} aria-label="Panel" className="my-popover">
          <button type="button">Open</button>
        </Popover>,
      );
      await user.click(screen.getByRole('button', { name: 'Open' }));
      await waitFor(() => expect(screen.getByText('Panel content')).toBeInTheDocument());
      expect(screen.getByText('Panel content').closest('[role]')?.className).toContain(
        'my-popover',
      );
    });
  });
});
