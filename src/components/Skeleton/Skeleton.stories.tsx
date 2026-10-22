import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Components/Layout/Skeleton',
  component: Skeleton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circular', 'rectangular'],
    },
    animation: {
      control: 'select',
      options: ['pulse', 'wave', 'none'],
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextLines: Story = {
  render: () => (
    <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Skeleton variant="text" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const skeletons = canvasElement.querySelectorAll('[aria-hidden="true"]');
    expect(skeletons.length).toBe(3);
  },
};

export const Circular: Story = {
  args: { variant: 'circular', width: 48, height: 48 },
};

export const Rectangular: Story = {
  args: { variant: 'rectangular', width: 240, height: 120 },
};

export const WaveAnimation: Story = {
  args: { variant: 'rectangular', width: 240, height: 120, animation: 'wave' },
};

export const NoAnimation: Story = {
  args: { variant: 'rectangular', width: 240, height: 120, animation: 'none' },
};

export const CardPlaceholder: Story = {
  render: () => (
    <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Skeleton variant="rectangular" height={140} />
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Skeleton variant="circular" width={40} height={40} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="50%" />
        </div>
      </div>
    </div>
  ),
};
