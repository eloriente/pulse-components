import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect } from 'storybook/test';
import { ToggleGroup } from './ToggleGroup';

const ALIGN_ITEMS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

const meta = {
  title: 'Components/Form/ToggleGroup',
  component: ToggleGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    items: ALIGN_ITEMS,
    'aria-label': 'Text alignment',
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleSelect: Story = {
  args: { defaultValue: ['left'] },
};

export const MultipleSelect: Story = {
  args: {
    type: 'multiple',
    'aria-label': 'Text formatting',
    items: [
      { value: 'bold', label: 'Bold' },
      { value: 'italic', label: 'Italic' },
      { value: 'underline', label: 'Underline' },
    ],
    defaultValue: ['bold'],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const italic = canvas.getByRole('button', { name: 'Italic' });
    expect(italic).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(italic);
    expect(italic).toHaveAttribute('aria-pressed', 'true');
    // Bold stays pressed — several items can be active at once.
    expect(canvas.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
  },
};

export const KeyboardNavigation: Story = {
  args: { defaultValue: ['left'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const left = canvas.getByRole('radio', { name: 'Left' });
    left.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(canvas.getByRole('radio', { name: 'Center' })).toHaveFocus();
    expect(canvas.getByRole('radio', { name: 'Center' })).toHaveAttribute('aria-checked', 'true');
    expect(left).toHaveAttribute('aria-checked', 'false');
  },
};

export const CannotDeselectInSingleMode: Story = {
  args: { defaultValue: ['center'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const center = canvas.getByRole('radio', { name: 'Center' });
    expect(center).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(center);
    expect(center).toHaveAttribute('aria-checked', 'true');
  },
};

export const NoneSelectedInitially: Story = {};

export const WithDisabledItem: Story = {
  args: {
    items: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center', disabled: true },
      { value: 'right', label: 'Right' },
    ],
    defaultValue: ['left'],
  },
};

export const Vertical: Story = {
  args: { orientation: 'vertical', defaultValue: ['left'] },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ToggleGroup {...args} size="sm" defaultValue={['left']} />
      <ToggleGroup {...args} size="md" defaultValue={['left']} />
      <ToggleGroup {...args} size="lg" defaultValue={['left']} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: ['left'] },
};

export const ControlledSelection: Story = {
  render: function Render() {
    const [value, setValue] = useState<string[]>(['left']);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <ToggleGroup
          aria-label="Text alignment"
          items={ALIGN_ITEMS}
          value={value}
          onChange={setValue}
        />
        <span>Selected: {value[0] ?? 'none'}</span>
      </div>
    );
  },
};
