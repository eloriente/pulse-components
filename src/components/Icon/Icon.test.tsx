import { render, screen } from '@testing-library/react';
import { Search, Star } from 'lucide-react';
import { describe, it, expect } from 'vitest';
import { Icon } from './Icon';

describe('Icon', () => {
  describe('Lucide icon rendering', () => {
    it('renders a Lucide icon', () => {
      render(<Icon as={Search} label="Search" />);
      expect(screen.getByRole('img', { name: 'Search' })).toBeInTheDocument();
    });

    it('applies aria-hidden when no label is provided', () => {
      const { container } = render(<Icon as={Search} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('applies role="img" and aria-label when label is provided', () => {
      render(<Icon as={Star} label="Favorite" />);
      const icon = screen.getByRole('img', { name: 'Favorite' });
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Size resolution', () => {
    it('defaults to md size (20px)', () => {
      const { container } = render(<Icon as={Search} label="Search" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '20');
      expect(svg).toHaveAttribute('height', '20');
    });

    it('renders xs size (12px)', () => {
      const { container } = render(<Icon as={Search} size="xs" label="Search" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '12');
    });

    it('renders xl size (32px)', () => {
      const { container } = render(<Icon as={Search} size="xl" label="Search" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '32');
    });

    it('respects explicit pixelSize over size token', () => {
      const { container } = render(<Icon as={Search} pixelSize={48} label="Search" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '48');
    });
  });

  describe('Custom SVG children', () => {
    it('renders custom SVG wrapped in a span', () => {
      render(
        <Icon size="md" label="Custom icon">
          <svg data-testid="custom-svg" viewBox="0 0 24 24" />
        </Icon>
      );
      expect(screen.getByRole('img', { name: 'Custom icon' })).toBeInTheDocument();
      expect(screen.getByTestId('custom-svg')).toBeInTheDocument();
    });

    it('wrapper span has correct dimensions', () => {
      render(
        <Icon size="lg" label="Custom">
          <svg viewBox="0 0 24 24" />
        </Icon>
      );
      const wrapper = screen.getByRole('img', { name: 'Custom' });
      expect(wrapper).toHaveStyle({ width: '24px', height: '24px' });
    });
  });

  describe('Custom className', () => {
    it('applies custom className to Lucide icon', () => {
      const { container } = render(<Icon as={Search} className="my-class" label="Search" />);
      const svg = container.querySelector('svg');
      // In jsdom, SVGElement.className is an SVGAnimatedString — use getAttribute
      expect(svg?.getAttribute('class')).toContain('my-class');
    });
  });

  describe('Returns null when empty', () => {
    it('renders nothing when neither as nor children are provided', () => {
      const { container } = render(<Icon />);
      expect(container.firstChild).toBeNull();
    });
  });
});
