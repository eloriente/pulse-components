import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Label } from './Label';

describe('Label', () => {
  it('renders label text', () => {
    render(<Label>Email</Label>);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders as a <label> element', () => {
    const { container } = render(<Label>Name</Label>);
    expect(container.querySelector('label')).toBeInTheDocument();
  });

  it('forwards htmlFor prop', () => {
    render(<Label htmlFor="email">Email</Label>);
    expect(screen.getByText('Email').closest('label')).toHaveAttribute('for', 'email');
  });

  it('renders required indicator when required=true', () => {
    const { container } = render(<Label required>Name</Label>);
    const requiredSpan = container.querySelector('span');
    expect(requiredSpan).toBeInTheDocument();
    expect(requiredSpan?.textContent).toBe(' *');
  });

  it('does not render required indicator by default', () => {
    const { container } = render(<Label>Name</Label>);
    expect(container.querySelector('span')).not.toBeInTheDocument();
  });

  it('applies disabled class when disabled=true', () => {
    const { container } = render(<Label disabled>Name</Label>);
    expect(container.querySelector('label')?.className).toContain('disabled');
  });

  it('applies custom className', () => {
    const { container } = render(<Label className="my-class">Name</Label>);
    expect(container.querySelector('label')?.className).toContain('my-class');
  });
});
