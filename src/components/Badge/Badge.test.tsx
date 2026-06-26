import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    const { container } = render(<Badge variant="solid">Badge</Badge>);
    expect(container.querySelector('span')?.className).toContain('solid');
  });

  it('applies color class', () => {
    const { container } = render(<Badge color="success">Badge</Badge>);
    expect(container.querySelector('span')?.className).toContain('color-success');
  });

  it('applies size class', () => {
    const { container } = render(<Badge size="lg">Badge</Badge>);
    expect(container.querySelector('span')?.className).toContain('lg');
  });

  it('renders dot indicator when dot=true', () => {
    const { container } = render(<Badge dot>Online</Badge>);
    // dot span is the first child inside badge
    const spans = container.querySelectorAll('span > span');
    expect(spans.length).toBeGreaterThan(0);
  });

  it('does not render dot by default', () => {
    render(<Badge>Online</Badge>);
    // only the outer span, no inner dot span
    expect(screen.queryByText('Online')?.querySelectorAll('span').length ?? 0).toBe(0);
  });

  it('applies custom className', () => {
    const { container } = render(<Badge className="my-class">Badge</Badge>);
    expect(container.querySelector('span')?.className).toContain('my-class');
  });
});
