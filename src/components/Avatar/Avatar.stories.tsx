import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { Avatar } from './Avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithInitials: Story = {
  args: { alt: 'Ana García' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('img', { name: 'Ana García' })).toBeInTheDocument();
    await expect(canvas.getByText('AG')).toBeInTheDocument();
  },
};

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/80',
    alt: 'User profile picture',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Avatar size="xs" alt="User XS" />
      <Avatar size="sm" alt="User SM" />
      <Avatar size="md" alt="User MD" />
      <Avatar size="lg" alt="User LG" />
      <Avatar size="xl" alt="User XL" />
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Avatar alt="John Doe" shape="circle" size="lg" />
      <Avatar alt="John Doe" shape="square" size="lg" />
    </div>
  ),
};

export const CustomColor: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px' }}>
      <Avatar alt="Alice B" color="#7c3aed" />
      <Avatar alt="Carlos M" color="#065f46" />
      <Avatar alt="Diana P" color="#dc2626" />
    </div>
  ),
};
