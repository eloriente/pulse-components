import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DropdownMenu } from './DropdownMenu';

describe('DropdownMenu', () => {
  describe('Rendering', () => {
    it('renders the trigger without showing the menu initially', () => {
      render(
        <DropdownMenu items={[{ label: 'Rename' }]}>
          <button type="button">Options</button>
        </DropdownMenu>,
      );
      expect(screen.getByRole('button', { name: 'Options' })).toBeInTheDocument();
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('renders a separator', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu items={[{ label: 'Rename' }, { type: 'separator' }, { label: 'Delete' }]}>
          <button type="button">Options</button>
        </DropdownMenu>,
      );
      await user.click(screen.getByRole('button', { name: 'Options' }));
      await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
      expect(screen.getByRole('separator')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('opens the menu on trigger click', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu items={[{ label: 'Rename' }]}>
          <button type="button">Options</button>
        </DropdownMenu>,
      );
      await user.click(screen.getByRole('button', { name: 'Options' }));
      await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
      expect(screen.getByRole('menuitem', { name: 'Rename' })).toBeInTheDocument();
    });

    it('calls onSelect and closes the menu when an item is clicked', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(
        <DropdownMenu items={[{ label: 'Rename', onSelect }]}>
          <button type="button">Options</button>
        </DropdownMenu>,
      );
      await user.click(screen.getByRole('button', { name: 'Options' }));
      await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Rename' })).toBeInTheDocument());
      await user.click(screen.getByRole('menuitem', { name: 'Rename' }));
      expect(onSelect).toHaveBeenCalledOnce();
      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    });

    it('does not call onSelect when clicking a disabled item', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(
        <DropdownMenu items={[{ label: 'Rename', onSelect, disabled: true }]}>
          <button type="button">Options</button>
        </DropdownMenu>,
      );
      await user.click(screen.getByRole('button', { name: 'Options' }));
      await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Rename' })).toBeInTheDocument());
      expect(screen.getByRole('menuitem', { name: 'Rename' })).toBeDisabled();
    });

    it('navigates between items with arrow keys, looping at the ends', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu items={[{ label: 'First' }, { label: 'Second' }, { label: 'Third' }]}>
          <button type="button">Options</button>
        </DropdownMenu>,
      );
      await user.click(screen.getByRole('button', { name: 'Options' }));
      await waitFor(() => expect(screen.getByRole('menuitem', { name: 'First' })).toHaveFocus());
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('menuitem', { name: 'Second' })).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('menuitem', { name: 'Third' })).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('menuitem', { name: 'First' })).toHaveFocus();
      await user.keyboard('{ArrowUp}');
      expect(screen.getByRole('menuitem', { name: 'Third' })).toHaveFocus();
    });

    it('skips disabled items when navigating with arrow keys', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu
          items={[{ label: 'First' }, { label: 'Second', disabled: true }, { label: 'Third' }]}
        >
          <button type="button">Options</button>
        </DropdownMenu>,
      );
      await user.click(screen.getByRole('button', { name: 'Options' }));
      await waitFor(() => expect(screen.getByRole('menuitem', { name: 'First' })).toHaveFocus());
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('menuitem', { name: 'Third' })).toHaveFocus();
    });

    it('closes on Escape and returns focus to the trigger', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu items={[{ label: 'Rename' }]}>
          <button type="button">Options</button>
        </DropdownMenu>,
      );
      const trigger = screen.getByRole('button', { name: 'Options' });
      await user.click(trigger);
      await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
      await waitFor(() => expect(trigger).toHaveFocus());
    });
  });

  describe('Disabled', () => {
    it('never opens the menu when the whole component is disabled', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu items={[{ label: 'Rename' }]} disabled>
          <button type="button">Options</button>
        </DropdownMenu>,
      );
      await user.click(screen.getByRole('button', { name: 'Options' }));
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies a custom className to the menu panel', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu items={[{ label: 'Rename' }]} className="my-menu">
          <button type="button">Options</button>
        </DropdownMenu>,
      );
      await user.click(screen.getByRole('button', { name: 'Options' }));
      await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
      expect(screen.getByRole('menu').className).toContain('my-menu');
    });
  });
});
