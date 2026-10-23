import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Combobox } from './Combobox';

const OPTIONS = [
  { value: 'es', label: 'Spain' },
  { value: 'fr', label: 'France' },
  { value: 'it', label: 'Italy', disabled: true },
];

describe('Combobox', () => {
  describe('Rendering', () => {
    it('renders a combobox input with no listbox initially', () => {
      render(<Combobox options={OPTIONS} aria-label="Country" />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('shows all options on focus', async () => {
      const user = userEvent.setup();
      render(<Combobox options={OPTIONS} aria-label="Country" />);
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByRole('option', { name: 'Spain' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'France' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Italy' })).toBeInTheDocument();
    });

    it('pre-fills the input with the selected option label (uncontrolled)', () => {
      render(<Combobox options={OPTIONS} aria-label="Country" defaultValue="fr" />);
      expect(screen.getByRole('combobox')).toHaveValue('France');
    });
  });

  describe('Filtering', () => {
    it('filters options by typed text', async () => {
      const user = userEvent.setup();
      render(<Combobox options={OPTIONS} aria-label="Country" />);
      await user.type(screen.getByRole('combobox'), 'fr');
      expect(screen.getByRole('option', { name: 'France' })).toBeInTheDocument();
      expect(screen.queryByRole('option', { name: 'Spain' })).not.toBeInTheDocument();
    });

    it('shows the no-options message when nothing matches', async () => {
      const user = userEvent.setup();
      render(<Combobox options={OPTIONS} aria-label="Country" />);
      await user.type(screen.getByRole('combobox'), 'xyz');
      expect(screen.getByText('No results')).toBeInTheDocument();
    });

    it('uses a custom no-options message', async () => {
      const user = userEvent.setup();
      render(<Combobox options={OPTIONS} aria-label="Country" noOptionsMessage="Nothing found" />);
      await user.type(screen.getByRole('combobox'), 'xyz');
      expect(screen.getByText('Nothing found')).toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('selects an option on click and fills the input', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Combobox options={OPTIONS} aria-label="Country" onChange={onChange} />);
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: 'France' }));
      expect(onChange).toHaveBeenCalledWith('fr');
      expect(screen.getByRole('combobox')).toHaveValue('France');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('selects the active option on Enter via keyboard navigation', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Combobox options={OPTIONS} aria-label="Country" onChange={onChange} />);
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}{Enter}');
      expect(onChange).toHaveBeenCalledWith('es');
      expect(input).toHaveValue('Spain');
    });

    it('does not select a disabled option on click', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Combobox options={OPTIONS} aria-label="Country" onChange={onChange} />);
      await user.click(screen.getByRole('combobox'));
      const italyOption = screen.getByRole('option', { name: 'Italy' });
      expect(italyOption).toHaveAttribute('aria-disabled', 'true');
    });

    it('closes the listbox on Escape', async () => {
      const user = userEvent.setup();
      render(<Combobox options={OPTIONS} aria-label="Country" />);
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    });
  });

  describe('Controlled', () => {
    it('reflects an externally controlled value', () => {
      render(<Combobox options={OPTIONS} aria-label="Country" value="it" onChange={() => {}} />);
      expect(screen.getByRole('combobox')).toHaveValue('Italy');
    });

    it('still calls onChange with the committed value when controlled', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Combobox options={OPTIONS} aria-label="Country" value="es" onChange={onChange} />);
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: 'France' }));
      expect(onChange).toHaveBeenCalledWith('fr');
    });

    it('syncs the input text when the controlled value prop changes', () => {
      const { rerender } = render(
        <Combobox options={OPTIONS} aria-label="Country" value="es" onChange={() => {}} />,
      );
      expect(screen.getByRole('combobox')).toHaveValue('Spain');
      rerender(<Combobox options={OPTIONS} aria-label="Country" value="fr" onChange={() => {}} />);
      expect(screen.getByRole('combobox')).toHaveValue('France');
    });
  });

  describe('Disabled', () => {
    it('disables the input and never opens the listbox', async () => {
      const user = userEvent.setup();
      render(<Combobox options={OPTIONS} aria-label="Country" disabled />);
      const input = screen.getByRole('combobox');
      expect(input).toBeDisabled();
      await user.click(input);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Error', () => {
    it('sets aria-invalid and renders the error message', () => {
      render(
        <Combobox options={OPTIONS} aria-label="Country" error errorMessage="Required" />,
      );
      const input = screen.getByRole('combobox');
      const alert = screen.getByRole('alert');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', alert.id);
      expect(alert).toHaveTextContent('Required');
    });
  });

  describe('Styling', () => {
    it('applies a custom className to the wrapper', () => {
      const { container } = render(
        <Combobox options={OPTIONS} aria-label="Country" className="my-combobox" />,
      );
      expect(container.firstChild).toHaveClass('my-combobox');
    });
  });
});
