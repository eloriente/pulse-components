import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TagInput } from './TagInput';

describe('TagInput', () => {
  describe('Rendering', () => {
    it('renders a text input', () => {
      render(<TagInput aria-label="Skills" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders initial tags from defaultValue', () => {
      render(<TagInput aria-label="Skills" defaultValue={['React', 'Vue']} />);
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Vue')).toBeInTheDocument();
    });

    it('shows the placeholder when there are no tags', () => {
      render(<TagInput aria-label="Skills" placeholder="Add a skill" />);
      expect(screen.getByPlaceholderText('Add a skill')).toBeInTheDocument();
    });

    it('hides the placeholder once there is at least one tag', () => {
      render(
        <TagInput aria-label="Skills" placeholder="Add a skill" defaultValue={['React']} />,
      );
      expect(screen.queryByPlaceholderText('Add a skill')).not.toBeInTheDocument();
    });
  });

  describe('Adding tags', () => {
    it('adds a tag on Enter and clears the input', async () => {
      const user = userEvent.setup();
      render(<TagInput aria-label="Skills" />);
      const input = screen.getByRole('textbox');
      await user.type(input, 'React{Enter}');
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(input).toHaveValue('');
    });

    it('adds a tag on a delimiter key (comma by default)', async () => {
      const user = userEvent.setup();
      render(<TagInput aria-label="Skills" />);
      await user.type(screen.getByRole('textbox'), 'React,');
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('trims whitespace and ignores empty input', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TagInput aria-label="Skills" onChange={onChange} />);
      await user.type(screen.getByRole('textbox'), '  React  {Enter}');
      expect(onChange).toHaveBeenCalledWith(['React']);
      await user.type(screen.getByRole('textbox'), '   {Enter}');
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('prevents duplicate tags case-insensitively by default', async () => {
      const user = userEvent.setup();
      render(<TagInput aria-label="Skills" defaultValue={['React']} />);
      await user.type(screen.getByRole('textbox'), 'react{Enter}');
      expect(screen.getAllByText(/react/i)).toHaveLength(1);
    });

    it('allows duplicates when preventDuplicates is false', async () => {
      const user = userEvent.setup();
      render(<TagInput aria-label="Skills" defaultValue={['React']} preventDuplicates={false} />);
      await user.type(screen.getByRole('textbox'), 'React{Enter}');
      expect(screen.getAllByText('React')).toHaveLength(2);
    });

    it('calls onChange with the full tag list', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TagInput aria-label="Skills" defaultValue={['React']} onChange={onChange} />);
      await user.type(screen.getByRole('textbox'), 'Vue{Enter}');
      expect(onChange).toHaveBeenCalledWith(['React', 'Vue']);
    });
  });

  describe('Removing tags', () => {
    it('removes a tag when its remove button is clicked', async () => {
      const user = userEvent.setup();
      render(<TagInput aria-label="Skills" defaultValue={['React', 'Vue']} />);
      await user.click(screen.getByRole('button', { name: 'Remove React' }));
      expect(screen.queryByText('React')).not.toBeInTheDocument();
      expect(screen.getByText('Vue')).toBeInTheDocument();
    });

    it('removes the last tag on Backspace when the input is empty', async () => {
      const user = userEvent.setup();
      render(<TagInput aria-label="Skills" defaultValue={['React', 'Vue']} />);
      screen.getByRole('textbox').focus();
      await user.keyboard('{Backspace}');
      expect(screen.queryByText('Vue')).not.toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('does not remove a tag on Backspace when the input has text', async () => {
      const user = userEvent.setup();
      render(<TagInput aria-label="Skills" defaultValue={['React']} />);
      const input = screen.getByRole('textbox');
      await user.type(input, 'a');
      await user.keyboard('{Backspace}');
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('does not render remove buttons when disabled', () => {
      render(<TagInput aria-label="Skills" defaultValue={['React']} disabled />);
      expect(screen.queryByRole('button', { name: 'Remove React' })).not.toBeInTheDocument();
    });
  });

  describe('maxTags', () => {
    it('disables the input once the limit is reached', () => {
      render(<TagInput aria-label="Skills" defaultValue={['React', 'Vue']} maxTags={2} />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('does not add a tag beyond the limit', () => {
      const onChange = vi.fn();
      render(
        <TagInput aria-label="Skills" defaultValue={['React']} maxTags={1} onChange={onChange} />,
      );
      expect(screen.getByRole('textbox')).toBeDisabled();
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Controlled', () => {
    it('reflects an externally controlled value', () => {
      render(<TagInput aria-label="Skills" value={['React']} onChange={() => {}} />);
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('calls onChange without mutating its own state when controlled', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TagInput aria-label="Skills" value={['React']} onChange={onChange} />);
      await user.type(screen.getByRole('textbox'), 'Vue{Enter}');
      expect(onChange).toHaveBeenCalledWith(['React', 'Vue']);
      // Parent hasn't re-rendered with the new value yet.
      expect(screen.queryByText('Vue')).not.toBeInTheDocument();
    });
  });

  describe('Error', () => {
    it('sets aria-invalid and renders the error message', () => {
      render(<TagInput aria-label="Skills" error errorMessage="Required" />);
      const input = screen.getByRole('textbox');
      const alert = screen.getByRole('alert');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', alert.id);
    });
  });

  describe('Styling', () => {
    it('applies a custom className to the wrapper', () => {
      const { container } = render(<TagInput aria-label="Skills" className="my-tag-input" />);
      expect(container.firstChild).toHaveClass('my-tag-input');
    });
  });
});
