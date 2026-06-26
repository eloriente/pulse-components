import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect } from 'storybook/test';
import { Select } from './Select';

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ width: '280px' }}><Story /></div>],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = (
  <>
    <option value="free">Free</option>
    <option value="pro">Pro</option>
    <option value="enterprise">Enterprise</option>
  </>
);

export const Default: Story = {
  args: { placeholder: 'Select a plan', id: 'plan' },
  render: (args) => <Select {...args}>{options}</Select>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole('combobox');
    await expect(select).toBeInTheDocument();
    await userEvent.selectOptions(select, 'pro');
    await expect((select as HTMLSelectElement).value).toBe('pro');
  },
};

export const WithError: Story = {
  args: { id: 'plan-err', error: true, errorMessage: 'Please select a plan' },
  render: (args) => <Select {...args}>{options}</Select>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('alert')).toHaveTextContent('Please select a plan');
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <Select {...args}>{options}</Select>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('combobox')).toBeDisabled();
  },
};

export const Filled: Story = {
  args: { variant: 'filled' },
  render: (args) => <Select {...args}>{options}</Select>,
};
