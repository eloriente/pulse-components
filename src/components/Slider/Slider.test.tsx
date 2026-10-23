import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Slider } from './Slider';

describe('Slider', () => {
  describe('Rendering', () => {
    it('renders a native range input', () => {
      render(<Slider aria-label="Volume" />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('type', 'range');
    });

    it('defaults min/max/step to 0/100/1', () => {
      render(<Slider aria-label="Volume" />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('min', '0');
      expect(slider).toHaveAttribute('max', '100');
      expect(slider).toHaveAttribute('step', '1');
    });

    it('defaults the value to min when uncontrolled with no defaultValue', () => {
      render(<Slider aria-label="Volume" min={10} />);
      expect(screen.getByRole('slider')).toHaveValue('10');
    });

    it('respects custom min/max/step', () => {
      render(<Slider aria-label="Volume" min={-50} max={50} step={5} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('min', '-50');
      expect(slider).toHaveAttribute('max', '50');
      expect(slider).toHaveAttribute('step', '5');
    });

    it('does not show the value by default', () => {
      render(<Slider aria-label="Volume" defaultValue={40} />);
      expect(screen.queryByText('40')).not.toBeInTheDocument();
    });

    it('shows the current value when showValue is set', () => {
      render(<Slider aria-label="Volume" defaultValue={40} showValue />);
      expect(screen.getByText('40')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    // jsdom doesn't implement keyboard-driven stepping for `type="range"`
    // (userEvent.keyboard('{ArrowRight}') is a no-op on it), so interactions
    // are exercised via a native `change` event instead, same as the browser
    // dispatches once the user finishes dragging/stepping the thumb.
    it('updates its own value when uncontrolled', () => {
      render(<Slider aria-label="Volume" defaultValue={10} showValue />);
      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '11' } });
      expect(slider).toHaveValue('11');
      expect(screen.getByText('11')).toBeInTheDocument();
    });

    it('calls onChange with a number on every change', () => {
      const onChange = vi.fn();
      render(<Slider aria-label="Volume" defaultValue={10} onChange={onChange} />);
      fireEvent.change(screen.getByRole('slider'), { target: { value: '11' } });
      expect(onChange).toHaveBeenCalledWith(11);
    });

    it('reflects a controlled value instead of managing its own state', () => {
      const onChange = vi.fn();
      render(<Slider aria-label="Volume" value={10} onChange={onChange} />);
      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '11' } });
      expect(onChange).toHaveBeenCalledWith(11);
      // Parent hasn't re-rendered with the new value, so it stays controlled at 10.
      expect(slider).toHaveValue('10');
    });
  });

  describe('Sizes', () => {
    it.each(['sm', 'md', 'lg'] as const)('applies %s size class', (size) => {
      render(<Slider aria-label="Volume" size={size} />);
      expect(screen.getByRole('slider').className).toContain(size);
    });

    it('defaults to md size', () => {
      render(<Slider aria-label="Volume" />);
      expect(screen.getByRole('slider').className).toContain('md');
    });
  });

  describe('Disabled', () => {
    it('disables the input', () => {
      render(<Slider aria-label="Volume" disabled />);
      expect(screen.getByRole('slider')).toBeDisabled();
    });
  });

  describe('Styling', () => {
    it('applies a custom className to the wrapper', () => {
      const { container } = render(<Slider aria-label="Volume" className="my-slider" />);
      expect(container.firstChild).toHaveClass('my-slider');
    });
  });
});
