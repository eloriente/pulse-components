import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Radio } from './Radio';

describe('Radio', () => {
  it('renders a radio button', () => {
    render(<Radio />);
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('renders label text', () => {
    render(<Radio label="Free plan" />);
    expect(screen.getByText('Free plan')).toBeInTheDocument();
  });

  it('fires onChange when clicked', async () => {
    const onChange = vi.fn();
    render(<Radio onChange={onChange} />);
    await userEvent.click(screen.getByRole('radio'));
    expect(onChange).toHaveBeenCalled();
  });

  it('is disabled when disabled=true', () => {
    render(<Radio disabled />);
    expect(screen.getByRole('radio')).toBeDisabled();
  });

  it('sets aria-invalid when error=true', () => {
    render(<Radio error />);
    expect(screen.getByRole('radio')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders checked state', () => {
    render(<Radio checked readOnly />);
    expect(screen.getByRole('radio')).toBeChecked();
  });
});
