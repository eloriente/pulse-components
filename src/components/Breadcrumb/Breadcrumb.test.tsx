import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Breadcrumb } from './Breadcrumb';

const ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Settings', href: '/settings' },
  { label: 'Billing' },
];

describe('Breadcrumb', () => {
  describe('Rendering', () => {
    it('renders a nav landmark labelled "Breadcrumb"', () => {
      render(<Breadcrumb items={ITEMS} />);
      expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    });

    it('renders non-last items with an href as links', () => {
      render(<Breadcrumb items={ITEMS} />);
      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('href', '/settings');
    });

    it('renders the last item as the current page, never as a link', () => {
      render(<Breadcrumb items={ITEMS} />);
      const current = screen.getByText('Billing');
      expect(current).toHaveAttribute('aria-current', 'page');
      expect(current.tagName).not.toBe('A');
    });

    it('renders the last item as current even if it has an href', () => {
      render(<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Billing', href: '/billing' }]} />);
      const current = screen.getByText('Billing');
      expect(current).toHaveAttribute('aria-current', 'page');
      expect(current.tagName).not.toBe('A');
    });

    it('renders a non-last item without an href as plain text, not a link', () => {
      render(<Breadcrumb items={[{ label: 'Ellipsis' }, { label: 'Billing' }]} />);
      expect(screen.queryByRole('link', { name: 'Ellipsis' })).not.toBeInTheDocument();
      expect(screen.getByText('Ellipsis')).toBeInTheDocument();
    });

    it('renders only one item as current with a single-item list', () => {
      render(<Breadcrumb items={[{ label: 'Home' }]} />);
      expect(screen.getByText('Home')).toHaveAttribute('aria-current', 'page');
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('renders a separator between items but not after the last one', () => {
      const { container } = render(<Breadcrumb items={ITEMS} separator="/" />);
      expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(ITEMS.length - 1);
    });
  });

  describe('Styling', () => {
    it('applies a custom className', () => {
      render(<Breadcrumb items={ITEMS} className="my-breadcrumb" />);
      expect(screen.getByRole('navigation').className).toContain('my-breadcrumb');
    });

    it('does not set an inline gap by default', () => {
      render(<Breadcrumb items={ITEMS} />);
      expect(screen.getByRole('navigation').style.getPropertyValue('--pulse-breadcrumb-gap')).toBe(
        '',
      );
    });

    it('sets the --pulse-breadcrumb-gap custom property when gap is provided', () => {
      render(<Breadcrumb items={ITEMS} gap={20} />);
      expect(screen.getByRole('navigation').style.getPropertyValue('--pulse-breadcrumb-gap')).toBe(
        '20px',
      );
    });
  });
});
