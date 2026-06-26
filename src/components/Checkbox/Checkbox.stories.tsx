import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect } from 'storybook/test';
import { fn } from 'storybook/test';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { onChange: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { id: 'cb-default', label: 'Accept terms and conditions' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox');
    await expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const Checked: Story = {
  args: { id: 'cb-checked', label: 'Checked state', checked: true, readOnly: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('checkbox')).toBeChecked();
  },
};

export const Indeterminate: Story = {
  args: { id: 'cb-indeterminate', label: 'Indeterminate state', indeterminate: true, readOnly: true },
};

export const Disabled: Story = {
  args: { id: 'cb-disabled', label: 'Disabled checkbox', disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('checkbox')).toBeDisabled();
  },
};

export const WithError: Story = {
  args: { id: 'cb-error', label: 'I agree to the terms', error: true },
};
