import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { Text } from './Text';

const meta = {
  title: 'Components/Primitives/Text',
  component: Text,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  args: { children: 'Text' },
  argTypes: {
    as: { control: 'select', options: ['p', 'span', 'label', 'div', 'strong', 'em', 'small'] },
    variant: { control: 'select', options: ['body', 'caption', 'overline', 'code'] },
    size: { control: 'select', options: ['lg', 'md', 'sm', 'xs'] },
    weight: { control: 'select', options: ['regular', 'medium', 'bold'] },
    align: { control: 'select', options: ['left', 'center', 'right'] },
    color: {
      control: 'select',
      options: ['default', 'muted', 'subtle', 'inverse', 'error', 'success', 'warning'],
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Play with every prop in the Controls panel below. `Text` always renders a
 * `<p>` unless you change `as` to something else (`span`, `label`, `div`...).
 */
export const Default: Story = {
  args: {
    children: 'The quick brown fox jumps over the lazy dog.',
    variant: 'body',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/quick brown fox/)).toBeInTheDocument();
  },
};

/**
 * `variant` picks a predefined combination of styling meant for a specific
 * role — body copy, captions, section overlines, and inline code — rather
 * than a purely visual choice.
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Text variant="body">Body — the default for paragraphs and general copy</Text>
      <Text variant="caption" size="sm" color="muted">Caption — supporting or secondary information</Text>
      <Text variant="overline" size="xs" weight="medium">Overline — small uppercase label above a heading</Text>
      <Text variant="code" as="span">const value = 42;</Text>
    </div>
  ),
};

/**
 * `size` is independent from `variant` — combine them freely (e.g. a `caption`
 * variant at `lg` size is still valid).
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Text size="lg">Large (lg) — the quick brown fox</Text>
      <Text size="md">Medium (md, default) — the quick brown fox</Text>
      <Text size="sm">Small (sm) — the quick brown fox</Text>
      <Text size="xs">Extra small (xs) — the quick brown fox</Text>
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Text weight="regular">Regular (default) weight</Text>
      <Text weight="medium">Medium weight</Text>
      <Text weight="bold">Bold weight</Text>
    </div>
  ),
};

export const Alignment: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '1px dashed #ccc', padding: '12px' }}>
      <Text align="left">Left-aligned (default)</Text>
      <Text align="center">Center-aligned</Text>
      <Text align="right">Right-aligned</Text>
    </div>
  ),
};

/**
 * Every color variant renders at WCAG 2.1 AA contrast (4.5:1+) against a
 * standard light background — verified by Storybook's a11y addon on this
 * story. `inverse` is the one exception: it's white text, meant only for
 * dark surfaces — see the `InverseColor` story for correct usage.
 */
export const Colors: Story = {
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

/**
 * `color="inverse"` is white text — it only reads correctly on a dark
 * surface. Never use it on a light background.
 */
export const InverseColor: Story = {
  render: () => (
    <div style={{ background: '#1a1a1a', padding: '16px', borderRadius: '8px' }}>
      <Text color="inverse">Inverse color, for dark surfaces only</Text>
    </div>
  ),
};

/**
 * `truncate` clips overflowing text with an ellipsis instead of wrapping —
 * the element needs a constrained width for it to take effect.
 */
export const Truncate: Story = {
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
