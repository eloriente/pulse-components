import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, fn, waitFor } from 'storybook/test';
import { Alert } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Heads up',
    children: 'A new version of this app is available.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('alert')).toBeInTheDocument();
    expect(canvas.getByText('Heads up')).toBeInTheDocument();
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Payment successful',
    children: 'Your subscription has been renewed.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Trial ending soon',
    children: 'Your trial ends in 3 days.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Something went wrong',
    children: 'We could not save your changes. Please try again.',
  },
};

export const WithoutTitle: Story = {
  args: {
    variant: 'info',
    children: 'A simple one-line message with no heading.',
  },
};

export const Dismissible: Story = {
  args: {
    variant: 'warning',
    title: 'Trial ending soon',
    children: 'Your trial ends in 3 days.',
    dismissible: true,
    onDismiss: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss' }));
    await expect(args.onDismiss).toHaveBeenCalledOnce();
  },
};

export const AutoDismiss: Story = {
  args: {
    variant: 'info',
    title: 'Saved',
    children: 'This will dismiss itself shortly.',
    autoDismiss: true,
    autoDismissDelay: 1500,
    onDismiss: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('alert')).toBeInTheDocument();
    await waitFor(() => expect(args.onDismiss).toHaveBeenCalledOnce(), { timeout: 3000 });
  },
};
