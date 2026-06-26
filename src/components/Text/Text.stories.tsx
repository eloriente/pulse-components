import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { Heading, Text } from './Text';

// ─── Heading stories ─────────────────────────────────────────────────────────

const headingMeta = {
  title: 'Components/Heading',
  component: Heading,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof Heading>;

export default headingMeta;
type HeadingStory = StoryObj<typeof headingMeta>;

export const AllLevels: HeadingStory = {
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

export const IndependentSize: HeadingStory = {
  name: 'Semantic h2, visual xl',
  args: { level: 2, size: 'xl', children: 'Big but semantically h2' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const el = canvas.getByRole('heading', { level: 2 });
    await expect(el).toBeInTheDocument();
  },
};

// ─── Text stories ─────────────────────────────────────────────────────────────

export const TextVariants: HeadingStory = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Text variant="body">Body text — the quick brown fox jumps over the lazy dog</Text>
      <Text variant="caption" size="sm" color="muted">Caption — supporting information</Text>
      <Text variant="overline" size="xs" weight="medium">Overline label</Text>
      <Text variant="code" as="span">const value = 42</Text>
    </div>
  ),
};

export const TextColors: HeadingStory = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Text color="default">Default color</Text>
      <Text color="muted">Muted color</Text>
      <Text color="subtle">Subtle color</Text>
      <Text color="error">Error color</Text>
      <Text color="success">Success color</Text>
      <Text color="warning">Warning color</Text>
    </div>
  ),
};

export const TextTruncate: HeadingStory = {
  render: () => (
    <div style={{ maxWidth: '200px' }}>
      <Text truncate>This is a very long text that should be truncated with an ellipsis</Text>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const el = canvas.getByText(/This is a very long/);
    await expect(el).toBeInTheDocument();
  },
};
