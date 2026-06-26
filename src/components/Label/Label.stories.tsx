import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { Label } from './Label';

const meta = {
  title: 'Components/Label',
  component: Label,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Email address', htmlFor: 'email' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Email address')).toBeInTheDocument();
  },
};

export const Required: Story = {
  args: { children: 'Full name', htmlFor: 'name', required: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Full name/)).toBeInTheDocument();
  },
};

export const Disabled: Story = {
  args: { children: 'Disabled field', disabled: true },
};

export const WithInput: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '320px' }}>
      <Label htmlFor="demo" required>Email address</Label>
      <input id="demo" type="email" placeholder="you@example.com" style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
    </div>
  ),
};
