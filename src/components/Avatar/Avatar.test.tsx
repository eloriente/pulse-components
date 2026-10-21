import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  describe('Initials fallback', () => {
    it('renders with role="img" and aria-label', () => {
      render(<Avatar alt="Ana García" />);
      expect(screen.getByRole('img', { name: 'Ana García' })).toBeInTheDocument();
    });

    it('renders two-letter initials', () => {
      render(<Avatar alt="John Doe" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('renders one-letter initial for single word', () => {
      render(<Avatar alt="Madonna" />);
      expect(screen.getByText('M')).toBeInTheDocument();
    });

    it('handles extra whitespace in name', () => {
      render(<Avatar alt="  Alice  Bob  " />);
      expect(screen.getByText('AB')).toBeInTheDocument();
    });
  });

  describe('Image rendering', () => {
    it('renders an img element when src is provided', () => {
      render(<Avatar src="/photo.jpg" alt="Profile photo" />);
      const img = screen.getByRole('img', { name: 'Profile photo' });
      expect(img).toHaveAttribute('src', '/photo.jpg');
    });

    it('falls back to initials when the image fails to load', () => {
      render(<Avatar src="/broken.jpg" alt="John Doe" />);
      fireEvent.error(screen.getByRole('img', { name: 'John Doe' }));
      expect(screen.getByText('JD')).toBeInTheDocument();
      expect(screen.queryByRole('img', { name: 'John Doe' })?.tagName).not.toBe('IMG');
    });

    it('retries the image when src changes after a previous failure', () => {
      const { rerender } = render(<Avatar src="/broken.jpg" alt="John Doe" />);
      fireEvent.error(screen.getByRole('img', { name: 'John Doe' }));
      expect(screen.getByText('JD')).toBeInTheDocument();

      rerender(<Avatar src="/new-photo.jpg" alt="John Doe" />);
      const img = screen.getByRole('img', { name: 'John Doe' });
      expect(img.tagName).toBe('IMG');
      expect(img).toHaveAttribute('src', '/new-photo.jpg');
    });
  });

  describe('Sizes', () => {
    it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)('applies %s size class', (size) => {
      const { container } = render(<Avatar alt="User" size={size} />);
      // CSS Modules hash class names in jsdom — check the rendered class list contains the size token
      const el = container.firstChild as Element;
      const classList = el.getAttribute('class') ?? '';
      expect(classList).toContain(size);
    });
  });

  describe('Shapes', () => {
    it('applies circle class by default', () => {
      const { container } = render(<Avatar alt="User" />);
      const el = container.firstChild as Element;
      expect(el.getAttribute('class')).toContain('circle');
    });

    it('applies square class when shape=square', () => {
      const { container } = render(<Avatar alt="User" shape="square" />);
      const el = container.firstChild as Element;
      expect(el.getAttribute('class')).toContain('square');
    });
  });

  describe('Custom color', () => {
    it('applies inline background color', () => {
      render(<Avatar alt="User" color="#ff0000" />);
      expect(screen.getByRole('img')).toHaveStyle({ backgroundColor: '#ff0000' });
    });
  });
});
