import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ToggleGroup } from './ToggleGroup';
import type { ToggleGroupItem } from './ToggleGroup';

const ITEMS: ToggleGroupItem[] = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

describe('ToggleGroup', () => {
  describe('Rendering', () => {
    it('renders a radiogroup by default (type="single")', () => {
      render(<ToggleGroup items={ITEMS} aria-label="Align" />);
      expect(screen.getByRole('radiogroup', { name: 'Align' })).toBeInTheDocument();
      expect(screen.getAllByRole('radio')).toHaveLength(3);
    });

    it('renders a group for type="multiple"', () => {
      render(<ToggleGroup items={ITEMS} type="multiple" aria-label="Align" />);
      expect(screen.getByRole('group', { name: 'Align' })).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(3);
    });

    it('starts with nothing selected when no defaultValue is given', () => {
      render(<ToggleGroup items={ITEMS} aria-label="Align" />);
      for (const radio of screen.getAllByRole('radio')) {
        expect(radio).toHaveAttribute('aria-checked', 'false');
      }
    });

    it('respects defaultValue', () => {
      render(<ToggleGroup items={ITEMS} aria-label="Align" defaultValue={['center']} />);
      expect(screen.getByRole('radio', { name: 'Center' })).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Single select', () => {
    it('selects an item on click', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ToggleGroup items={ITEMS} aria-label="Align" onChange={onChange} />);
      await user.click(screen.getByRole('radio', { name: 'Left' }));
      expect(onChange).toHaveBeenCalledWith(['left']);
    });

    it('replaces the previous selection instead of adding to it', async () => {
      const user = userEvent.setup();
      render(<ToggleGroup items={ITEMS} aria-label="Align" defaultValue={['left']} />);
      await user.click(screen.getByRole('radio', { name: 'Right' }));
      expect(screen.getByRole('radio', { name: 'Right' })).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByRole('radio', { name: 'Left' })).toHaveAttribute('aria-checked', 'false');
    });

    it('does not deselect when clicking the already-selected item', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <ToggleGroup items={ITEMS} aria-label="Align" defaultValue={['left']} onChange={onChange} />,
      );
      await user.click(screen.getByRole('radio', { name: 'Left' }));
      expect(onChange).not.toHaveBeenCalled();
      expect(screen.getByRole('radio', { name: 'Left' })).toHaveAttribute('aria-checked', 'true');
    });

    it('only the selected item (or the first enabled one) is in the tab order', () => {
      render(<ToggleGroup items={ITEMS} aria-label="Align" defaultValue={['center']} />);
      expect(screen.getByRole('radio', { name: 'Left' })).toHaveAttribute('tabIndex', '-1');
      expect(screen.getByRole('radio', { name: 'Center' })).toHaveAttribute('tabIndex', '0');
      expect(screen.getByRole('radio', { name: 'Right' })).toHaveAttribute('tabIndex', '-1');
    });

    it('moves focus and selection with ArrowRight/ArrowLeft', async () => {
      const user = userEvent.setup();
      render(<ToggleGroup items={ITEMS} aria-label="Align" defaultValue={['left']} />);
      screen.getByRole('radio', { name: 'Left' }).focus();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('radio', { name: 'Center' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Center' })).toHaveAttribute('aria-checked', 'true');
      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('radio', { name: 'Left' })).toHaveFocus();
    });

    it('wraps around with ArrowRight past the last item', async () => {
      const user = userEvent.setup();
      render(<ToggleGroup items={ITEMS} aria-label="Align" defaultValue={['right']} />);
      screen.getByRole('radio', { name: 'Right' }).focus();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('radio', { name: 'Left' })).toHaveFocus();
    });

    it('Home/End jump to the first/last item', async () => {
      const user = userEvent.setup();
      render(<ToggleGroup items={ITEMS} aria-label="Align" defaultValue={['center']} />);
      screen.getByRole('radio', { name: 'Center' }).focus();
      await user.keyboard('{End}');
      expect(screen.getByRole('radio', { name: 'Right' })).toHaveFocus();
      await user.keyboard('{Home}');
      expect(screen.getByRole('radio', { name: 'Left' })).toHaveFocus();
    });

    it('skips disabled items during arrow-key navigation', async () => {
      const user = userEvent.setup();
      const items: ToggleGroupItem[] = [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center', disabled: true },
        { value: 'right', label: 'Right' },
      ];
      render(<ToggleGroup items={items} aria-label="Align" defaultValue={['left']} />);
      screen.getByRole('radio', { name: 'Left' }).focus();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('radio', { name: 'Right' })).toHaveFocus();
    });
  });

  describe('Multiple select', () => {
    it('toggles an item on and off independently', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <ToggleGroup items={ITEMS} type="multiple" aria-label="Align" onChange={onChange} />,
      );
      await user.click(screen.getByRole('button', { name: 'Left' }));
      expect(onChange).toHaveBeenNthCalledWith(1, ['left']);
      await user.click(screen.getByRole('button', { name: 'Right' }));
      expect(onChange).toHaveBeenNthCalledWith(2, ['left', 'right']);
      await user.click(screen.getByRole('button', { name: 'Left' }));
      expect(onChange).toHaveBeenNthCalledWith(3, ['right']);
    });

    it('every enabled item is independently tabbable', () => {
      render(<ToggleGroup items={ITEMS} type="multiple" aria-label="Align" />);
      for (const button of screen.getAllByRole('button')) {
        expect(button).toHaveAttribute('tabIndex', '0');
      }
    });
  });

  describe('Controlled', () => {
    it('reflects an externally controlled value', () => {
      render(<ToggleGroup items={ITEMS} aria-label="Align" value={['right']} onChange={() => {}} />);
      expect(screen.getByRole('radio', { name: 'Right' })).toHaveAttribute('aria-checked', 'true');
    });

    it('does not manage its own state when controlled', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ToggleGroup items={ITEMS} aria-label="Align" value={['left']} onChange={onChange} />);
      await user.click(screen.getByRole('radio', { name: 'Right' }));
      expect(onChange).toHaveBeenCalledWith(['right']);
      expect(screen.getByRole('radio', { name: 'Left' })).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Disabled', () => {
    it('disables every item when the group is disabled', () => {
      render(<ToggleGroup items={ITEMS} aria-label="Align" disabled />);
      for (const radio of screen.getAllByRole('radio')) {
        expect(radio).toBeDisabled();
      }
    });

    it('disables an individual item', () => {
      const items: ToggleGroupItem[] = [
        { value: 'left', label: 'Left', disabled: true },
        { value: 'right', label: 'Right' },
      ];
      render(<ToggleGroup items={items} aria-label="Align" />);
      expect(screen.getByRole('radio', { name: 'Left' })).toBeDisabled();
      expect(screen.getByRole('radio', { name: 'Right' })).not.toBeDisabled();
    });
  });

  describe('Styling', () => {
    it('applies a custom className to the root', () => {
      const { container } = render(
        <ToggleGroup items={ITEMS} aria-label="Align" className="my-toggle-group" />,
      );
      expect(container.firstChild).toHaveClass('my-toggle-group');
    });
  });
});
