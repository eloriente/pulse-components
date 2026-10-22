import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Search } from 'lucide-react';
import { describe, it, expect } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  describe('Rendering', () => {
    it('renders a text input', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders placeholder text', () => {
      render(<Input placeholder="Enter email" />);
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    });

    it('renders icon left', () => {
      const { container } = render(<Input iconLeft={Search} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('applies variant class', () => {
      const { container } = render(<Input variant="filled" />);
      expect(container.querySelector('input')?.className).toContain('filled');
    });
  });

  describe('Sizes', () => {
    it('applies size class', () => {
      const { container } = render(<Input size="lg" />);
      expect(container.querySelector('input')?.className).toContain('lg');
    });
  });

  describe('Disabled/Loading', () => {
    it('is disabled when disabled=true', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('accepts user input', async () => {
      render(<Input />);
      await userEvent.type(screen.getByRole('textbox'), 'hello');
      expect(screen.getByRole('textbox')).toHaveValue('hello');
    });
  });

  describe('Styling', () => {
    it('sets aria-invalid when error=true', () => {
      render(<Input error />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('shows error message with role="alert"', () => {
      render(<Input id="email" error errorMessage="Invalid email" />);
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
    });

    it('links input to error message via aria-describedby', () => {
      render(<Input id="email" error errorMessage="Required" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'email-error');
    });

    it('applies fullWidth class', () => {
      const { container } = render(<Input fullWidth />);
      expect(container.querySelector('div')?.className).toContain('fullWidth');
    });
  });
});
