import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { within, userEvent, expect } from 'storybook/test';
import { Search, ChevronRight, Plus } from 'lucide-react';
import { Button } from './Button';

const meta = {
  title: 'Components/Primitives/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary', label: 'Button' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Button' });
    await expect(button).toBeInTheDocument();
    await expect(button).toBeEnabled();
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Secondary: Story = {
  args: { variant: 'secondary', label: 'Button' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Button' })).toBeInTheDocument();
  },
};

export const Large: Story = {
  args: { size: 'large', label: 'Button' },
};

export const Small: Story = {
  args: { size: 'small', label: 'Button' },
};

export const WithIconLeft: Story = {
  args: { variant: 'primary', label: 'Search', iconLeft: Search },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Search' });
    await expect(button).toBeInTheDocument();
    const svg = button.querySelector('svg');
    await expect(svg).toBeInTheDocument();
  },
};

export const WithIconRight: Story = {
  args: { label: 'Next', iconRight: ChevronRight },
};

export const IconOnly: Story = {
  args: {
    variant: 'primary',
    iconOnly: Plus,
    'aria-label': 'Add item',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Add item' })).toBeInTheDocument();
  },
};

export const Disabled: Story = {
  args: { variant: 'primary', label: 'Disabled', disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Disabled' });
    await expect(button).toBeDisabled();
  },
};

export const Loading: Story = {
  args: { variant: 'primary', label: 'Saving...', loading: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute('aria-busy', 'true');
  },
};
