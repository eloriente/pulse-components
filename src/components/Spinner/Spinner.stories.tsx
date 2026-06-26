import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { Spinner } from './Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Loading...' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toBeInTheDocument();
    await expect(canvas.getByRole('status')).toHaveAttribute('aria-label', 'Loading...');
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Spinner size="xs" label="Loading xs" />
      <Spinner size="sm" label="Loading sm" />
      <Spinner size="md" label="Loading md" />
      <Spinner size="lg" label="Loading lg" />
      <Spinner size="xl" label="Loading xl" />
    </div>
  ),
};

export const Dots: Story = {
  args: { variant: 'dots', label: 'Loading dots' },
};

export const CustomColor: Story = {
  args: { color: 'var(--pulse-color-error, #e53e3e)', label: 'Loading...' },
};
