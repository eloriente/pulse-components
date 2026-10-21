import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Tabs } from './Tabs';

const ITEMS = [
  { value: 'account', label: 'Account', content: 'Account content' },
  { value: 'billing', label: 'Billing', content: 'Billing content' },
  { value: 'team', label: 'Team', content: 'Team content' },
];

describe('Tabs', () => {
  describe('Rendering', () => {
    it('selects the first tab by default', () => {
      render(<Tabs items={ITEMS} />);
      expect(screen.getByRole('tab', { name: 'Account', selected: true })).toBeInTheDocument();
      expect(screen.getByText('Account content')).toBeVisible();
    });

    it('hides the content of non-selected tabs', () => {
      render(<Tabs items={ITEMS} />);
      expect(screen.getByText('Billing content')).not.toBeVisible();
    });

    it('links each tab to its panel via aria-controls/aria-labelledby', () => {
      render(<Tabs items={ITEMS} />);
      const tab = screen.getByRole('tab', { name: 'Account' });
      const panel = screen.getByText('Account content').closest('[role="tabpanel"]');
      expect(panel).toHaveAttribute('aria-labelledby', tab.id);
      expect(tab).toHaveAttribute('aria-controls', panel?.id);
    });

    it('respects defaultValue when uncontrolled', () => {
      render(<Tabs items={ITEMS} defaultValue="billing" />);
      expect(screen.getByRole('tab', { name: 'Billing', selected: true })).toBeInTheDocument();
    });

    it('skips disabled tabs when choosing the default selection', () => {
      const items = [
        { value: 'account', label: 'Account', content: 'A', disabled: true },
        { value: 'billing', label: 'Billing', content: 'B' },
      ];
      render(<Tabs items={items} />);
      expect(screen.getByRole('tab', { name: 'Billing', selected: true })).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('switches tabs on click', async () => {
      const user = userEvent.setup();
      render(<Tabs items={ITEMS} />);
      await user.click(screen.getByRole('tab', { name: 'Billing' }));
      expect(screen.getByRole('tab', { name: 'Billing', selected: true })).toBeInTheDocument();
      expect(screen.getByText('Billing content')).toBeVisible();
    });

    it('navigates with ArrowRight/ArrowLeft, looping at the ends', async () => {
      const user = userEvent.setup();
      render(<Tabs items={ITEMS} />);
      screen.getByRole('tab', { name: 'Account' }).focus();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'Billing' })).toHaveFocus();
      expect(screen.getByRole('tab', { name: 'Billing', selected: true })).toBeInTheDocument();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'Team' })).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'Account' })).toHaveFocus();
      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('tab', { name: 'Team' })).toHaveFocus();
    });

    it('jumps to the first/last tab with Home/End', async () => {
      const user = userEvent.setup();
      render(<Tabs items={ITEMS} />);
      screen.getByRole('tab', { name: 'Account' }).focus();
      await user.keyboard('{End}');
      expect(screen.getByRole('tab', { name: 'Team' })).toHaveFocus();
      await user.keyboard('{Home}');
      expect(screen.getByRole('tab', { name: 'Account' })).toHaveFocus();
    });

    it('skips disabled tabs when navigating with arrow keys', async () => {
      const user = userEvent.setup();
      const items = [
        { value: 'account', label: 'Account', content: 'A' },
        { value: 'billing', label: 'Billing', content: 'B', disabled: true },
        { value: 'team', label: 'Team', content: 'T' },
      ];
      render(<Tabs items={items} />);
      screen.getByRole('tab', { name: 'Account' }).focus();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'Team' })).toHaveFocus();
    });

    it('uses vertical arrow keys when orientation is vertical', async () => {
      const user = userEvent.setup();
      render(<Tabs items={ITEMS} orientation="vertical" />);
      screen.getByRole('tab', { name: 'Account' }).focus();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('tab', { name: 'Billing' })).toHaveFocus();
      await user.keyboard('{ArrowUp}');
      expect(screen.getByRole('tab', { name: 'Account' })).toHaveFocus();
    });

    it('calls onChange when the selection changes', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Tabs items={ITEMS} onChange={onChange} />);
      await user.click(screen.getByRole('tab', { name: 'Team' }));
      expect(onChange).toHaveBeenCalledWith('team');
    });
  });

  describe('Controlled mode', () => {
    it('does not change the selection itself when controlled', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Tabs items={ITEMS} value="billing" onChange={onChange} />);
      await user.click(screen.getByRole('tab', { name: 'Team' }));
      expect(onChange).toHaveBeenCalledWith('team');
      expect(screen.getByRole('tab', { name: 'Billing', selected: true })).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies a custom className', () => {
      const { container } = render(<Tabs items={ITEMS} className="my-tabs" />);
      expect(container.firstElementChild?.className).toContain('my-tabs');
    });
  });
});
