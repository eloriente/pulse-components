import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { FieldGroup } from './FieldGroup';
import { Input } from '../Input';

describe('FieldGroup', () => {
  describe('Rendering', () => {
    it('renders the label text', () => {
      render(
        <FieldGroup label="Email">
          <Input />
        </FieldGroup>,
      );
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('associates the label with the control via a generated id', () => {
      render(
        <FieldGroup label="Email">
          <Input />
        </FieldGroup>,
      );
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('uses an explicit id over the generated one', () => {
      render(
        <FieldGroup label="Email" id="email-field">
          <Input />
        </FieldGroup>,
      );
      expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'email-field');
    });

    it("prefers the control's own id over FieldGroup's generated/explicit id", () => {
      render(
        <FieldGroup label="Email" id="field-id">
          <Input id="control-id" />
        </FieldGroup>,
      );
      expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'control-id');
    });
  });

  describe('Required', () => {
    it('shows the required indicator on the label', () => {
      render(
        <FieldGroup label="Name" required>
          <Input />
        </FieldGroup>,
      );
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('sets required on the control', () => {
      render(
        <FieldGroup label="Name" required>
          <Input />
        </FieldGroup>,
      );
      expect(screen.getByLabelText(/Name/)).toBeRequired();
    });

    it("does not override the control's own explicit required value", () => {
      render(
        <FieldGroup label="Name" required>
          <Input required={false} />
        </FieldGroup>,
      );
      expect(screen.getByLabelText(/Name/)).not.toBeRequired();
    });
  });

  describe('Helper text', () => {
    it('renders helper text and wires it via aria-describedby', () => {
      render(
        <FieldGroup label="Username" helperText="Visible to others.">
          <Input />
        </FieldGroup>,
      );
      const input = screen.getByLabelText('Username');
      const helper = screen.getByText('Visible to others.');
      expect(input).toHaveAttribute('aria-describedby', helper.id);
    });
  });

  describe('Error message', () => {
    it('renders the error message instead of helper text', () => {
      render(
        <FieldGroup label="Email" helperText="Helper" errorMessage="Required">
          <Input />
        </FieldGroup>,
      );
      expect(screen.getByText('Required')).toBeInTheDocument();
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });

    it('sets aria-invalid and aria-describedby on the control', () => {
      render(
        <FieldGroup label="Email" errorMessage="Required">
          <Input />
        </FieldGroup>,
      );
      const input = screen.getByLabelText('Email');
      const error = screen.getByRole('alert');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', error.id);
    });

    it('does not set aria-invalid when there is no error', () => {
      render(
        <FieldGroup label="Email">
          <Input />
        </FieldGroup>,
      );
      expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-invalid');
    });

    it('merges a pre-existing aria-describedby on the control with the generated one', () => {
      render(
        <FieldGroup label="Email" errorMessage="Required">
          <Input aria-describedby="external-hint" />
        </FieldGroup>,
      );
      const input = screen.getByLabelText('Email');
      const describedBy = input.getAttribute('aria-describedby');
      expect(describedBy).toContain('external-hint');
      expect(describedBy).toContain(screen.getByRole('alert').id);
    });
  });

  describe('Interactions', () => {
    it('lets the user type into the wrapped control', async () => {
      const user = userEvent.setup();
      render(
        <FieldGroup label="Email">
          <Input />
        </FieldGroup>,
      );
      const input = screen.getByLabelText('Email');
      await user.type(input, 'hello');
      expect(input).toHaveValue('hello');
    });
  });

  describe('Styling', () => {
    it('applies a custom className to the wrapper', () => {
      const { container } = render(
        <FieldGroup label="Email" className="my-field">
          <Input />
        </FieldGroup>,
      );
      expect(container.firstChild).toHaveClass('my-field');
    });
  });
});
