import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor } from 'storybook/test';
import { Modal } from './Modal';
import { Button } from '../Button';

const meta = {
  title: 'Components/Overlay/Modal',
  component: Modal,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// Every story below closes the modal again at the end of its `play` function.
// Its backdrop covers the whole viewport (`position: fixed; inset: 0`), so a
// story left open would block the rest of the Docs page in Storybook's inline
// autodocs rendering — there's no iframe isolating one story from the next.
function ModalHarness(props: Omit<React.ComponentProps<typeof Modal>, 'open' | 'onClose'>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button label="Open modal" onClick={() => setOpen(true)} />
      <Modal {...props} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export const Default: Story = {
  render: () => (
    <ModalHarness title="Delete item?">
      <p>This can&apos;t be undone.</p>
    </ModalHarness>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }));
    await waitFor(() => expect(body.getByRole('dialog')).toBeInTheDocument());
    expect(body.getByRole('heading', { name: 'Delete item?' })).toBeInTheDocument();
    await userEvent.click(body.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

export const MovesFocusIntoPanel: Story = {
  render: () => (
    <ModalHarness title="Confirm">
      <Button label="Confirm action" />
    </ModalHarness>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }));
    await waitFor(() => expect(body.getByRole('button', { name: 'Close' })).toHaveFocus());
    await userEvent.click(body.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

export const ClosesOnEscapeAndReturnsFocus: Story = {
  render: () => (
    <ModalHarness title="Confirm">
      <p>Content</p>
    </ModalHarness>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Open modal' });
    await userEvent.click(trigger);
    await waitFor(() => expect(body.getByRole('dialog')).toBeInTheDocument());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const ClosesOnCloseButton: Story = {
  render: () => (
    <ModalHarness title="Confirm">
      <p>Content</p>
    </ModalHarness>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }));
    await waitFor(() => expect(body.getByRole('dialog')).toBeInTheDocument());
    await userEvent.click(body.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

export const ClosesOnBackdropClick: Story = {
  render: () => (
    <ModalHarness title="Confirm">
      <p>Content</p>
    </ModalHarness>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }));
    await waitFor(() => expect(body.getByRole('dialog')).toBeInTheDocument());
    await userEvent.click(body.getByRole('dialog').parentElement as HTMLElement);
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

export const WithoutTitleRequiresAriaLabel: Story = {
  render: () => (
    <ModalHarness aria-label="Loading progress">
      <p>Content with no visible heading</p>
    </ModalHarness>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }));
    await waitFor(() =>
      expect(body.getByRole('dialog', { name: 'Loading progress' })).toBeInTheDocument(),
    );
    await userEvent.click(body.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  },
};
