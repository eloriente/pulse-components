import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  describe('Rendering', () => {
    it('renders a div', () => {
      const { container } = render(<Skeleton />);
      expect(container.firstChild?.nodeName).toBe('DIV');
    });

    it('is hidden from assistive tech', () => {
      const { container } = render(<Skeleton />);
      expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Variants', () => {
    it.each(['text', 'circular', 'rectangular'] as const)('applies %s variant class', (variant) => {
      const { container } = render(<Skeleton variant={variant} />);
      expect((container.firstChild as HTMLElement).className).toContain(variant);
    });

    it('defaults to text variant', () => {
      const { container } = render(<Skeleton />);
      expect((container.firstChild as HTMLElement).className).toContain('text');
    });
  });

  describe('Dimensions', () => {
    it('defaults width to 100%', () => {
      const { container } = render(<Skeleton />);
      expect((container.firstChild as HTMLElement).style.width).toBe('100%');
    });

    it.each([
      ['text', '1em'],
      ['circular', '40px'],
      ['rectangular', '100px'],
    ] as const)('defaults height for %s variant to %s', (variant, expectedHeight) => {
      const { container } = render(<Skeleton variant={variant} />);
      expect((container.firstChild as HTMLElement).style.height).toBe(expectedHeight);
    });

    it('accepts numeric width/height as px', () => {
      const { container } = render(<Skeleton width={120} height={48} />);
      const el = container.firstChild as HTMLElement;
      expect(el.style.width).toBe('120px');
      expect(el.style.height).toBe('48px');
    });

    it('accepts string width/height as-is', () => {
      const { container } = render(<Skeleton width="60%" height="2rem" />);
      const el = container.firstChild as HTMLElement;
      expect(el.style.width).toBe('60%');
      expect(el.style.height).toBe('2rem');
    });
  });

  describe('Animation', () => {
    it.each(['pulse', 'wave', 'none'] as const)('applies %s animation class', (animation) => {
      const { container } = render(<Skeleton animation={animation} />);
      expect((container.firstChild as HTMLElement).className).toContain(animation);
    });

    it('defaults to pulse animation', () => {
      const { container } = render(<Skeleton />);
      expect((container.firstChild as HTMLElement).className).toContain('pulse');
    });
  });

  describe('Styling', () => {
    it('applies custom className', () => {
      const { container } = render(<Skeleton className="my-class" />);
      expect(container.firstChild).toHaveClass('my-class');
    });
  });
});
