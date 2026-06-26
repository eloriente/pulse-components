import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect } from 'storybook/test';
import { fn } from 'storybook/test';
import { Radio } from './Radio';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { onChange: fn() },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { id: 'radio-default', name: 'plan', value: 'free', label: 'Free plan' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const radio = canvas.getByRole('radio');
    await userEvent.click(radio);
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const Checked: Story = {
  args: { id: 'radio-checked', name: 'plan', value: 'pro', label: 'Pro plan', checked: true, readOnly: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('radio')).toBeChecked();
  },
};

export const Group: Story = {
  render: () => (
    <fieldset style={{ border: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <legend style={{ fontWeight: 600, marginBottom: '8px' }}>Select a plan</legend>
      <Radio id="g-free" name="group-plan" value="free" label="Free" defaultChecked />
      <Radio id="g-pro" name="group-plan" value="pro" label="Pro" />
      <Radio id="g-enterprise" name="group-plan" value="enterprise" label="Enterprise" />
    </fieldset>
  ),
};

export const Disabled: Story = {
  args: { id: 'radio-disabled', name: 'plan', label: 'Disabled option', disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('radio')).toBeDisabled();
  },
};
