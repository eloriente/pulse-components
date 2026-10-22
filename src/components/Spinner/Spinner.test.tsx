import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  describe('Rendering', () => {
    it('renders with role="status"', () => {
      render(<Spinner />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('has default aria-label', () => {
      render(<Spinner />);
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading...');
    });

    it('accepts custom label', () => {
      render(<Spinner label="Fetching data..." />);
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Fetching data...');
    });

    it('renders dot children for dots variant', () => {
      const { container } = render(<Spinner variant="dots" />);
      const dots = container.querySelectorAll('[role="status"] span');
      expect(dots.length).toBe(3);
    });
  });

  describe('Variants', () => {
    it('applies ring variant class by default', () => {
      const { container } = render(<Spinner />);
      expect(container.querySelector('[role="status"]')?.className).toContain('ring');
    });

    it('applies dots variant class', () => {
      const { container } = render(<Spinner variant="dots" />);
      expect(container.querySelector('[role="status"]')?.className).toContain('dots');
    });
  });

  describe('Sizes', () => {
    it('applies size class', () => {
      const { container } = render(<Spinner size="xl" />);
      expect(container.querySelector('[role="status"]')?.className).toContain('xl');
    });
  });

  describe('Styling', () => {
    it('applies custom color via CSS variable', () => {
      render(<Spinner color="red" />);
      expect(screen.getByRole('status')).toHaveStyle({ '--spinner-color': 'red' });
    });
  });
});
