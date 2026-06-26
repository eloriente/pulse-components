import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Heading, Text } from './Text';

describe('Heading', () => {
  it('renders as h1 by default', () => {
    render(<Heading>Title</Heading>);
    expect(screen.getByRole('heading', { level: 1, name: 'Title' })).toBeInTheDocument();
  });

  it.each([1, 2, 3, 4, 5, 6] as const)('renders as h%i when level=%i', (level) => {
    render(<Heading level={level}>Heading {level}</Heading>);
    expect(screen.getByRole('heading', { level })).toBeInTheDocument();
  });

  it('applies a custom size class independently from level', () => {
    const { container } = render(<Heading level={3} size="xl">Title</Heading>);
    expect(container.querySelector('h3')?.className).toContain('heading-xl');
  });

  it('applies custom className', () => {
    const { container } = render(<Heading className="custom">Title</Heading>);
    expect(container.querySelector('h1')?.className).toContain('custom');
  });

  it('forwards id prop', () => {
    render(<Heading id="section-title">Title</Heading>);
    expect(screen.getByRole('heading')).toHaveAttribute('id', 'section-title');
  });
});

describe('Text', () => {
  it('renders as <p> by default', () => {
    const { container } = render(<Text>Hello</Text>);
    expect(container.querySelector('p')).toBeInTheDocument();
  });

  it.each(['p', 'span', 'div', 'strong', 'em', 'small'] as const)(
    'renders as <%s> when as="%s"',
    (tag) => {
      const { container } = render(<Text as={tag}>Content</Text>);
      expect(container.querySelector(tag)).toBeInTheDocument();
    }
  );

  it('renders text content', () => {
    render(<Text>Hello world</Text>);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    const { container } = render(<Text variant="caption">Caption</Text>);
    expect(container.querySelector('p')?.className).toContain('text-caption');
  });

  it('applies size class', () => {
    const { container } = render(<Text size="sm">Small</Text>);
    expect(container.querySelector('p')?.className).toContain('text-size-sm');
  });

  it('applies weight class', () => {
    const { container } = render(<Text weight="bold">Bold</Text>);
    expect(container.querySelector('p')?.className).toContain('text-weight-bold');
  });

  it('applies color class', () => {
    const { container } = render(<Text color="muted">Muted</Text>);
    expect(container.querySelector('p')?.className).toContain('text-color-muted');
  });

  it('applies truncate class when truncate=true', () => {
    const { container } = render(<Text truncate>Long text</Text>);
    expect(container.querySelector('p')?.className).toContain('text-truncate');
  });

  it('does not apply truncate class by default', () => {
    const { container } = render(<Text>Normal text</Text>);
    expect(container.querySelector('p')?.className).not.toContain('text-truncate');
  });

  it('forwards htmlFor when as="label"', () => {
    render(<Text as="label" htmlFor="my-input">Label</Text>);
    expect(screen.getByText('Label')).toHaveAttribute('for', 'my-input');
  });
});
