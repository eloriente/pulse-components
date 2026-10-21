import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { Heading } from './Text';

const meta = {
  title: 'Components/Primitives/Heading',
  component: Heading,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllLevels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Heading level={1}>Heading 1</Heading>
      <Heading level={2}>Heading 2</Heading>
      <Heading level={3}>Heading 3</Heading>
      <Heading level={4}>Heading 4</Heading>
      <Heading level={5}>Heading 5</Heading>
      <Heading level={6}>Heading 6</Heading>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Heading 1' })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { level: 6, name: 'Heading 6' })).toBeInTheDocument();
  },
};

export const IndependentSize: Story = {
  name: 'Semantic h2, visual xl',
  args: { level: 2, size: 'xl', children: 'Big but semantically h2' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const el = canvas.getByRole('heading', { level: 2 });
    await expect(el).toBeInTheDocument();
  },
};
