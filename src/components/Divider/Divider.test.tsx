import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Divider } from './Divider';

describe('Divider', () => {
  it('renders a horizontal separator by default', () => {
    render(<Divider />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('renders as <hr> for horizontal orientation', () => {
    const { container } = render(<Divider />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('renders a vertical separator as <span>', () => {
    const { container } = render(<Divider orientation="vertical" />);
    expect(container.querySelector('span[role="separator"]')).toBeInTheDocument();
  });

  it('vertical separator has aria-orientation="vertical"', () => {
    render(<Divider orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('renders label text when label prop is provided', () => {
    render(<Divider label="OR" />);
    expect(screen.getByText('OR')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    const { container } = render(<Divider variant="dashed" />);
    expect(container.querySelector('hr')?.className).toContain('dashed');
  });

  it('applies custom className', () => {
    const { container } = render(<Divider className="my-class" />);
    expect(container.querySelector('hr')?.className).toContain('my-class');
  });
});
