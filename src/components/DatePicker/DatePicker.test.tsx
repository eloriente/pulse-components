import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DatePicker } from './DatePicker';

describe('DatePicker', () => {
  describe('Rendering', () => {
    it('renders a read-only text input', () => {
      render(<DatePicker aria-label="Date" />);
      const input = screen.getByRole('textbox', { name: 'Date' });
      expect(input).toHaveAttribute('readonly');
    });

    it('shows the placeholder when no date is selected', () => {
      render(<DatePicker aria-label="Date" placeholder="Pick a date" />);
      expect(screen.getByPlaceholderText('Pick a date')).toBeInTheDocument();
    });

    it('formats the selected date using the default formatter', () => {
      const date = new Date(2026, 0, 15);
      render(<DatePicker aria-label="Date" defaultValue={date} />);
      expect(screen.getByRole('textbox', { name: 'Date' })).toHaveValue(date.toLocaleDateString());
    });

    it('formats the selected date using a custom formatter', () => {
      render(
        <DatePicker
          aria-label="Date"
          defaultValue={new Date(2026, 0, 15)}
          formatDate={() => 'custom-format'}
        />,
      );
      expect(screen.getByRole('textbox', { name: 'Date' })).toHaveValue('custom-format');
    });

    it('does not render the calendar until opened', () => {
      render(<DatePicker aria-label="Date" />);
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });
  });

  describe('Opening the calendar', () => {
    it('opens on click', async () => {
      const user = userEvent.setup();
      render(<DatePicker aria-label="Date" />);
      await user.click(screen.getByRole('textbox', { name: 'Date' }));
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('opens on Enter when focused', async () => {
      const user = userEvent.setup();
      render(<DatePicker aria-label="Date" />);
      screen.getByRole('textbox', { name: 'Date' }).focus();
      await user.keyboard('{Enter}');
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('opens on ArrowDown when focused', async () => {
      const user = userEvent.setup();
      render(<DatePicker aria-label="Date" />);
      screen.getByRole('textbox', { name: 'Date' }).focus();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('opens on Space when focused', async () => {
      const user = userEvent.setup();
      render(<DatePicker aria-label="Date" />);
      screen.getByRole('textbox', { name: 'Date' }).focus();
      await user.keyboard(' ');
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('does not open when disabled', async () => {
      const user = userEvent.setup();
      render(<DatePicker aria-label="Date" disabled />);
      await user.click(screen.getByRole('textbox', { name: 'Date' }));
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });
  });

  describe('Selecting a date', () => {
    it('calls onChange, updates the input, and closes the calendar', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<DatePicker aria-label="Date" defaultValue={new Date(2026, 0, 15)} onChange={onChange} />);

      await user.click(screen.getByRole('textbox', { name: 'Date' }));
      const cell = screen.getByRole('gridcell', { name: '20' });
      await user.click(within(cell).getByRole('button'));

      expect(onChange).toHaveBeenCalledWith(new Date(2026, 0, 20));
      await waitFor(() =>
        expect(screen.getByRole('textbox', { name: 'Date' })).toHaveValue(
          new Date(2026, 0, 20).toLocaleDateString(),
        ),
      );
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });

    it('reflects a controlled value instead of managing its own state', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <DatePicker
          aria-label="Date"
          value={new Date(2026, 0, 15)}
          onChange={onChange}
        />,
      );
      await user.click(screen.getByRole('textbox', { name: 'Date' }));
      const cell = screen.getByRole('gridcell', { name: '20' });
      await user.click(within(cell).getByRole('button'));

      expect(onChange).toHaveBeenCalledWith(new Date(2026, 0, 20));
      // Parent hasn't re-rendered with the new value yet.
      expect(screen.getByRole('textbox', { name: 'Date' })).toHaveValue(
        new Date(2026, 0, 15).toLocaleDateString(),
      );
    });
  });

  describe('minDate/maxDate', () => {
    it('disables dates outside the allowed range', async () => {
      const user = userEvent.setup();
      render(
        <DatePicker
          aria-label="Date"
          defaultValue={new Date(2026, 0, 15)}
          minDate={new Date(2026, 0, 10)}
          maxDate={new Date(2026, 0, 20)}
        />,
      );
      await user.click(screen.getByRole('textbox', { name: 'Date' }));
      const cell = screen.getByRole('gridcell', { name: '5' });
      expect(within(cell).getByRole('button')).toBeDisabled();
    });

    it('disables dates before minDate alone', async () => {
      const user = userEvent.setup();
      render(
        <DatePicker
          aria-label="Date"
          defaultValue={new Date(2026, 0, 15)}
          minDate={new Date(2026, 0, 10)}
        />,
      );
      await user.click(screen.getByRole('textbox', { name: 'Date' }));
      expect(within(screen.getByRole('gridcell', { name: '5' })).getByRole('button')).toBeDisabled();
      expect(
        within(screen.getByRole('gridcell', { name: '25' })).getByRole('button'),
      ).not.toBeDisabled();
    });

    it('disables dates after maxDate alone', async () => {
      const user = userEvent.setup();
      render(
        <DatePicker
          aria-label="Date"
          defaultValue={new Date(2026, 0, 15)}
          maxDate={new Date(2026, 0, 20)}
        />,
      );
      await user.click(screen.getByRole('textbox', { name: 'Date' }));
      expect(within(screen.getByRole('gridcell', { name: '25' })).getByRole('button')).toBeDisabled();
      expect(within(screen.getByRole('gridcell', { name: '5' })).getByRole('button')).not.toBeDisabled();
    });
  });

  describe('Error', () => {
    it('shows the error message and marks the input invalid', () => {
      render(<DatePicker aria-label="Date" error errorMessage="Required" />);
      expect(screen.getByRole('alert')).toHaveTextContent('Required');
      expect(screen.getByRole('textbox', { name: 'Date' })).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Styling', () => {
    it('applies a custom className to the wrapper', () => {
      const { container } = render(<DatePicker aria-label="Date" className="my-date-picker" />);
      expect(container.firstChild).toHaveClass('my-date-picker');
    });
  });
});

