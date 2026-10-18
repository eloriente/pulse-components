import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  describe('Rendering', () => {
    it('renders the trigger without showing the tooltip initially', () => {
      render(
        <Tooltip content="Hello" delay={0}>
          <button type="button">Trigger</button>
        </Tooltip>,
      );
      expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('shows the tooltip on hover', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Helpful text" delay={0}>
          <button type="button">Trigger</button>
        </Tooltip>,
      );
      await user.hover(screen.getByRole('button', { name: 'Trigger' }));
      await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
      expect(screen.getByRole('tooltip')).toHaveTextContent('Helpful text');
    });

    it('hides the tooltip on unhover', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Helpful text" delay={0}>
          <button type="button">Trigger</button>
        </Tooltip>,
      );
      const trigger = screen.getByRole('button', { name: 'Trigger' });
      await user.hover(trigger);
      await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
      await user.unhover(trigger);
      await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
    });

    it('shows the tooltip on keyboard focus', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Helpful text" delay={0}>
          <button type="button">Trigger</button>
        </Tooltip>,
      );
      await user.tab();
      expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus();
      await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
    });

    it('hides the tooltip on Escape', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Helpful text" delay={0}>
          <button type="button">Trigger</button>
        </Tooltip>,
      );
      await user.hover(screen.getByRole('button', { name: 'Trigger' }));
      await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
    });
  });

  describe('Disabled', () => {
    it('never shows the tooltip when disabled', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Helpful text" disabled delay={0}>
          <button type="button">Trigger</button>
        </Tooltip>,
      );
      await user.hover(screen.getByRole('button', { name: 'Trigger' }));
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('renders children unmodified when disabled', () => {
      render(
        <Tooltip content="Helpful text" disabled delay={0}>
          <button type="button">Trigger</button>
        </Tooltip>,
      );
      expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies a custom className to the tooltip bubble', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Helpful text" delay={0} className="my-tooltip">
          <button type="button">Trigger</button>
        </Tooltip>,
      );
      await user.hover(screen.getByRole('button', { name: 'Trigger' }));
      await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
      expect(screen.getByRole('tooltip').className).toContain('my-tooltip');
    });
  });
});
