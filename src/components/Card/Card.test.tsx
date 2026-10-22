import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  describe('Rendering', () => {
    it('renders children content', () => {
      render(<Card>Body content</Card>);
      expect(screen.getByText('Body content')).toBeInTheDocument();
    });

    it('renders header when provided', () => {
      render(<Card header="Header content">Body</Card>);
      expect(screen.getByText('Header content')).toBeInTheDocument();
    });

    it('renders footer when provided', () => {
      render(<Card footer="Footer content">Body</Card>);
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('does not render header/footer wrappers when not provided', () => {
      const { container } = render(<Card>Body</Card>);
      expect(container.querySelectorAll('div').length).toBe(2);
    });
  });

  describe('Variants', () => {
    it.each(['elevated', 'outlined', 'filled'] as const)(
      'applies %s variant class',
      (variant) => {
        const { container } = render(<Card variant={variant}>Body</Card>);
        expect((container.firstChild as HTMLElement).className).toContain(variant);
      },
    );

    it('defaults to elevated variant', () => {
      const { container } = render(<Card>Body</Card>);
      expect((container.firstChild as HTMLElement).className).toContain('elevated');
    });
  });

  describe('Padding', () => {
    it.each(['none', 'sm', 'md', 'lg'] as const)(
      'applies %s padding class to body',
      (padding) => {
        render(<Card padding={padding}>Body text</Card>);
        const bodyEl = screen.getByText('Body text');
        expect(bodyEl.className).toContain(`padding-${padding}`);
      },
    );

    it('defaults to md padding', () => {
      render(<Card>Body text</Card>);
      const bodyEl = screen.getByText('Body text');
      expect(bodyEl.className).toContain('padding-md');
    });
  });

  describe('Interactive/Interactions', () => {
    it('is a plain div without role when not interactive', () => {
      render(<Card>Body</Card>);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders role="button" and tabIndex=0 when interactive', () => {
      render(<Card interactive>Body</Card>);
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('calls onClick when clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Card interactive onClick={handleClick}>
          Body
        </Card>,
      );
      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when Enter is pressed', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Card interactive onClick={handleClick}>
          Body
        </Card>,
      );
      screen.getByRole('button').focus();
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when Space is pressed', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Card interactive onClick={handleClick}>
          Body
        </Card>,
      );
      screen.getByRole('button').focus();
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick for other keys when interactive', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Card interactive onClick={handleClick}>
          Body
        </Card>,
      );
      screen.getByRole('button').focus();
      await user.keyboard('a');
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('still calls custom onKeyDown when not interactive', async () => {
      const handleKeyDown = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <Card onKeyDown={handleKeyDown} tabIndex={0}>
          Body
        </Card>,
      );
      (container.firstChild as HTMLElement).focus();
      await user.keyboard('{Enter}');
      expect(handleKeyDown).toHaveBeenCalled();
    });
  });

  describe('Styling', () => {
    it('applies custom className', () => {
      const { container } = render(<Card className="my-class">Body</Card>);
      expect(container.firstChild).toHaveClass('my-class');
    });
  });
});
