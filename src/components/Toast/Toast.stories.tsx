import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor } from 'storybook/test';
import { ToastProvider } from './ToastProvider';
import { useToast } from './useToast';
import { Button } from '../Button';

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button
        label="Show info"
        onClick={() => toast({ variant: 'info', title: 'Heads up', description: 'New version available.' })}
      />
      <Button
        label="Show success"
        onClick={() => toast({ variant: 'success', title: 'Saved', duration: 0 })}
      />
      <Button
        label="Show warning"
        onClick={() => toast({ variant: 'warning', title: 'Low disk space', duration: 0 })}
      />
      <Button
        label="Show error"
        onClick={() => toast({ variant: 'error', title: 'Something went wrong', duration: 0 })}
      />
    </div>
  );
}

const meta = {
  title: 'Components/Toast',
  component: ToastProvider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Show info' }));
    await waitFor(() => expect(body.getByText('Heads up')).toBeInTheDocument());
    expect(body.getByText('New version available.')).toBeInTheDocument();
    await userEvent.click(body.getByRole('button', { name: 'Dismiss' }));
    await waitFor(() => expect(body.queryByText('Heads up')).not.toBeInTheDocument());
  },
};

export const Variants: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Show success' }));
    await waitFor(() => expect(body.getByText('Saved')).toBeInTheDocument());
    await userEvent.click(canvas.getByRole('button', { name: 'Show warning' }));
    await waitFor(() => expect(body.getByText('Low disk space')).toBeInTheDocument());
    await userEvent.click(canvas.getByRole('button', { name: 'Show error' }));
    await waitFor(() => expect(body.getByText('Something went wrong')).toBeInTheDocument());
    // Clean up: dismiss everything this story opened.
    for (const button of body.getAllByRole('button', { name: 'Dismiss' })) {
      await userEvent.click(button);
    }
    await waitFor(() => expect(body.queryByText('Saved')).not.toBeInTheDocument());
  },
};

export const StacksMultipleToasts: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Show success' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Show warning' }));
    await waitFor(() => expect(body.getAllByRole('button', { name: 'Dismiss' })).toHaveLength(2));
    for (const button of body.getAllByRole('button', { name: 'Dismiss' })) {
      await userEvent.click(button);
    }
    await waitFor(() => expect(body.queryAllByRole('button', { name: 'Dismiss' })).toHaveLength(0));
  },
};

export const AutoDismisses: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Show info' }));
    await waitFor(() => expect(body.getByText('Heads up')).toBeInTheDocument());
    await waitFor(() => expect(body.queryByText('Heads up')).not.toBeInTheDocument(), {
      timeout: 6000,
    });
  },
};
