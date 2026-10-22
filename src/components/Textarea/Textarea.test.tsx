import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  describe('Rendering', () => {
    it('renders a textarea', () => {
      render(<Textarea />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('applies variant class', () => {
      const { container } = render(<Textarea variant="filled" />);
      expect(container.querySelector('textarea')?.className).toContain('filled');
    });
  });

  describe('Disabled/Loading', () => {
    it('is disabled when disabled=true', () => {
      render(<Textarea disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('accepts user input', async () => {
      render(<Textarea />);
      await userEvent.type(screen.getByRole('textbox'), 'Hello');
      expect(screen.getByRole('textbox')).toHaveValue('Hello');
    });
  });

  describe('Styling', () => {
    it('sets aria-invalid when error=true', () => {
      render(<Textarea error />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('shows error message', () => {
      render(<Textarea id="bio" error errorMessage="Too long" />);
      expect(screen.getByRole('alert')).toHaveTextContent('Too long');
    });

    it('applies resize style', () => {
      render(<Textarea resize="none" />);
      expect(screen.getByRole('textbox')).toHaveStyle({ resize: 'none' });
    });
  });
});
