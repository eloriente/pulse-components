import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect } from 'storybook/test';
import { Search, Eye } from 'lucide-react';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ width: '320px' }}><Story /></div>],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Enter text...' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    await expect(input).toBeInTheDocument();
    await expect(input).toBeEnabled();
  },
};

export const WithIconLeft: Story = {
  args: { placeholder: 'Search...', iconLeft: Search },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    await userEvent.type(input, 'hello');
    await expect(input).toHaveValue('hello');
  },
};

export const WithIconRight: Story = {
  args: { placeholder: 'Password', type: 'password', iconRight: Eye },
};

export const Filled: Story = {
  args: { variant: 'filled', placeholder: 'Filled variant' },
};

export const Underline: Story = {
  args: { variant: 'underline', placeholder: 'Underline variant' },
};

export const WithError: Story = {
  args: {
    id: 'email',
    'aria-label': 'Email',
    placeholder: 'you@example.com',
    error: true,
    errorMessage: 'This email is already in use',
    defaultValue: 'test@test',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getByRole('alert')).toHaveTextContent('This email is already in use');
  },
};

export const Disabled: Story = {
  args: { placeholder: 'Disabled input', disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox')).toBeDisabled();
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '320px' }}>
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
    </div>
  ),
};
