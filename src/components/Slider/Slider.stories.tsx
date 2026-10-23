import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { Slider } from './Slider';
import { Label } from '../Label';
import { FieldGroup } from '../FieldGroup';

const meta = {
  title: 'Components/Form/Slider',
  component: Slider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    'aria-label': 'Value',
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: '240px' }}>
      <Slider {...args} />
    </div>
  ),
};

export const WithValue: Story = {
  args: { showValue: true, defaultValue: 40 },
  render: (args) => (
    <div style={{ width: '240px' }}>
      <Slider {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('40')).toBeInTheDocument();
    // Native range inputs don't set aria-valuenow as a literal DOM attribute —
    // it's implicit from `value` in the accessibility tree — so assert that instead.
    expect(canvas.getByRole('slider')).toHaveValue('40');
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Slider {...args} size="sm" defaultValue={30} />
      <Slider {...args} size="md" defaultValue={50} />
      <Slider {...args} size="lg" defaultValue={70} />
    </div>
  ),
};

export const CustomRange: Story = {
  args: { min: -50, max: 50, defaultValue: 0, showValue: true },
  render: (args) => (
    <div style={{ width: '240px' }}>
      <Slider {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 50, showValue: true },
  render: (args) => (
    <div style={{ width: '240px' }}>
      <Slider {...args} />
    </div>
  ),
};

export const ControlledValue: Story = {
  render: function Render() {
    const [value, setValue] = useState(20);
    return (
      <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Slider aria-label="Brightness" value={value} onChange={setValue} />
        <span>Brightness: {value}</span>
      </div>
    );
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Label htmlFor="volume-slider">Volume</Label>
      <Slider id="volume-slider" {...args} aria-label={undefined} defaultValue={60} showValue />
    </div>
  ),
};

export const WithFieldGroup: Story = {
  render: (args) => (
    <div style={{ width: '240px' }}>
      <FieldGroup label="Opacity" helperText="0 is fully transparent.">
        <Slider {...args} aria-label={undefined} defaultValue={80} showValue />
      </FieldGroup>
    </div>
  ),
};
