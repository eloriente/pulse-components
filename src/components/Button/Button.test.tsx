import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Search, ChevronRight, Plus } from 'lucide-react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  describe('Rendering', () => {
    it('renders with a label', () => {
      render(<Button label="Click me" />);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('renders as enabled by default', () => {
      render(<Button label="Click me" />);
      expect(screen.getByRole('button')).toBeEnabled();
    });

    it('renders with type="button" by default', () => {
      render(<Button label="Submit" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('renders with type="submit" when specified', () => {
      render(<Button label="Submit" type="submit" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });
  });

  describe('Variants', () => {
    it('applies primary class when primary=true', () => {
      const { container } = render(<Button label="Primary" primary />);
      expect(container.querySelector('button')?.className).toContain('primary');
    });

    it('applies secondary class when primary=false', () => {
      const { container } = render(<Button label="Secondary" primary={false} />);
      expect(container.querySelector('button')?.className).toContain('secondary');
    });
  });

  describe('Sizes', () => {
    it('applies medium size by default', () => {
      const { container } = render(<Button label="Button" />);
      expect(container.querySelector('button')?.className).toContain('medium');
    });

    it.each(['small', 'medium', 'large'] as const)('applies %s size class', (size) => {
      const { container } = render(<Button label="Button" size={size} />);
      expect(container.querySelector('button')?.className).toContain(size);
    });
  });

  describe('Icons', () => {
    it('renders iconLeft', () => {
      const { container } = render(<Button label="Search" iconLeft={Search} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders iconRight', () => {
      const { container } = render(<Button label="Next" iconRight={ChevronRight} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders iconOnly without label text', () => {
      render(<Button iconOnly={Plus} aria-label="Add" />);
      const button = screen.getByRole('button', { name: 'Add' });
      expect(button).toBeInTheDocument();
      expect(button.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Disabled state', () => {
    it('is disabled when disabled=true', () => {
      render(<Button label="Button" disabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('does not fire onClick when disabled', async () => {
      const onClick = vi.fn();
      render(<Button label="Button" disabled onClick={onClick} />);
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Loading state', () => {
    it('disables button when loading=true', () => {
      render(<Button label="Saving" loading />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('sets aria-busy when loading', () => {
      render(<Button label="Saving" loading />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('renders spinner element when loading', () => {
      const { container } = render(<Button label="Saving" loading />);
      expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    });

    it('hides label when loading', () => {
      render(<Button label="Saving" loading />);
      expect(screen.queryByText('Saving')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClick when clicked', async () => {
      const onClick = vi.fn();
      render(<Button label="Click me" onClick={onClick} />);
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledOnce();
    });
  });

  describe('Styling', () => {
    it('applies custom className', () => {
      const { container } = render(<Button label="Button" className="my-class" />);
      expect(container.querySelector('button')?.className).toContain('my-class');
    });

    it('applies inline backgroundColor style', () => {
      const { container } = render(<Button label="Button" backgroundColor="rgb(255, 0, 0)" />);
      expect(container.querySelector('button')).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' });
    });
  });
});
