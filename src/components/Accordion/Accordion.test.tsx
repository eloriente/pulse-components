import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Accordion } from './Accordion';

const ITEMS = [
  { value: 'shipping', trigger: 'Shipping', content: 'Shipping content' },
  { value: 'returns', trigger: 'Returns', content: 'Returns content' },
  { value: 'warranty', trigger: 'Warranty', content: 'Warranty content' },
];

describe('Accordion', () => {
  describe('Rendering', () => {
    it('renders all triggers collapsed by default', () => {
      render(<Accordion items={ITEMS} />);
      for (const item of ITEMS) {
        expect(screen.getByRole('button', { name: item.trigger })).toHaveAttribute(
          'aria-expanded',
          'false',
        );
      }
    });

    it('respects defaultValue when uncontrolled', () => {
      render(<Accordion items={ITEMS} defaultValue={['returns']} />);
      expect(screen.getByRole('button', { name: 'Returns' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      expect(screen.getByText('Returns content')).toBeVisible();
    });

    it('renders the chevron after the label by default (iconPosition="right")', () => {
      render(<Accordion items={ITEMS} />);
      const trigger = screen.getByRole('button', { name: 'Shipping' });
      expect(trigger.lastElementChild?.tagName).toBe('svg');
    });

    it('renders the chevron before the label when iconPosition is "left"', () => {
      render(<Accordion items={ITEMS} iconPosition="left" />);
      const trigger = screen.getByRole('button', { name: 'Shipping' });
      expect(trigger.firstElementChild?.tagName).toBe('svg');
    });

    it('links each trigger to its panel via aria-controls/aria-labelledby', () => {
      render(<Accordion items={ITEMS} defaultValue={['shipping']} />);
      const trigger = screen.getByRole('button', { name: 'Shipping' });
      const panel = screen.getByText('Shipping content').closest('[role="region"]');
      expect(panel).toHaveAttribute('aria-labelledby', trigger.id);
      expect(trigger).toHaveAttribute('aria-controls', panel?.id);
    });
  });

  describe('Single mode (default)', () => {
    it('opens an item on click', async () => {
      const user = userEvent.setup();
      render(<Accordion items={ITEMS} />);
      await user.click(screen.getByRole('button', { name: 'Shipping' }));
      expect(screen.getByRole('button', { name: 'Shipping' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });

    it('closes the previously open item when another one opens', async () => {
      const user = userEvent.setup();
      render(<Accordion items={ITEMS} defaultValue={['shipping']} />);
      await user.click(screen.getByRole('button', { name: 'Returns' }));
      expect(screen.getByRole('button', { name: 'Shipping' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
      expect(screen.getByRole('button', { name: 'Returns' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });

    it('collapses the open item when clicked again (collapsible=true by default)', async () => {
      const user = userEvent.setup();
      render(<Accordion items={ITEMS} defaultValue={['shipping']} />);
      await user.click(screen.getByRole('button', { name: 'Shipping' }));
      expect(screen.getByRole('button', { name: 'Shipping' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });

    it('keeps the item open when collapsible is false', async () => {
      const user = userEvent.setup();
      render(<Accordion items={ITEMS} defaultValue={['shipping']} collapsible={false} />);
      await user.click(screen.getByRole('button', { name: 'Shipping' }));
      expect(screen.getByRole('button', { name: 'Shipping' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });
  });

  describe('Multiple mode', () => {
    it('allows more than one item open at a time', async () => {
      const user = userEvent.setup();
      render(<Accordion items={ITEMS} type="multiple" />);
      await user.click(screen.getByRole('button', { name: 'Shipping' }));
      await user.click(screen.getByRole('button', { name: 'Returns' }));
      expect(screen.getByRole('button', { name: 'Shipping' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      expect(screen.getByRole('button', { name: 'Returns' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });

    it('closes only the clicked item', async () => {
      const user = userEvent.setup();
      render(
        <Accordion items={ITEMS} type="multiple" defaultValue={['shipping', 'returns']} />,
      );
      await user.click(screen.getByRole('button', { name: 'Shipping' }));
      expect(screen.getByRole('button', { name: 'Shipping' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
      expect(screen.getByRole('button', { name: 'Returns' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });
  });

  describe('Keyboard navigation', () => {
    it('moves focus with ArrowDown/ArrowUp, looping at the ends', async () => {
      const user = userEvent.setup();
      render(<Accordion items={ITEMS} />);
      screen.getByRole('button', { name: 'Shipping' }).focus();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('button', { name: 'Returns' })).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('button', { name: 'Warranty' })).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('button', { name: 'Shipping' })).toHaveFocus();
      await user.keyboard('{ArrowUp}');
      expect(screen.getByRole('button', { name: 'Warranty' })).toHaveFocus();
    });

    it('jumps to the first/last trigger with Home/End', async () => {
      const user = userEvent.setup();
      render(<Accordion items={ITEMS} />);
      screen.getByRole('button', { name: 'Shipping' }).focus();
      await user.keyboard('{End}');
      expect(screen.getByRole('button', { name: 'Warranty' })).toHaveFocus();
      await user.keyboard('{Home}');
      expect(screen.getByRole('button', { name: 'Shipping' })).toHaveFocus();
    });

    it('skips disabled triggers when navigating', async () => {
      const user = userEvent.setup();
      const items = [
        { value: 'shipping', trigger: 'Shipping', content: 'A' },
        { value: 'returns', trigger: 'Returns', content: 'B', disabled: true },
        { value: 'warranty', trigger: 'Warranty', content: 'C' },
      ];
      render(<Accordion items={items} />);
      screen.getByRole('button', { name: 'Shipping' }).focus();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('button', { name: 'Warranty' })).toHaveFocus();
    });
  });

  describe('Controlled mode', () => {
    it('calls onChange but does not change state itself when controlled', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Accordion items={ITEMS} value={['returns']} onChange={onChange} />);
      await user.click(screen.getByRole('button', { name: 'Shipping' }));
      expect(onChange).toHaveBeenCalledWith(['shipping']);
      expect(screen.getByRole('button', { name: 'Returns' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });
  });

  describe('Styling', () => {
    it('applies a custom className', () => {
      const { container } = render(<Accordion items={ITEMS} className="my-accordion" />);
      expect(container.firstElementChild?.className).toContain('my-accordion');
    });
  });
});
