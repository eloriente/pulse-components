import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect } from 'storybook/test';
import { fn } from 'storybook/test';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { onChange: fn() },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { id: 'sw-default', label: 'Enable notifications' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const sw = canvas.getByRole('switch');
    await expect(sw).not.toBeChecked();
    await userEvent.click(sw);
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const Checked: Story = {
  args: { id: 'sw-checked', label: 'Dark mode', checked: true, readOnly: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('switch')).toBeChecked();
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Switch id="sw-sm" size="sm" label="Small" />
      <Switch id="sw-md" size="md" label="Medium" />
      <Switch id="sw-lg" size="lg" label="Large" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { id: 'sw-disabled', label: 'Disabled switch', disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('switch')).toBeDisabled();
  },
};
