import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, fn } from 'storybook/test';
import { Card } from './Card';
import { Text } from '../Text';
import { Button } from '../Button';

const meta = {
  title: 'Components/Layout/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'outlined', 'filled'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    interactive: { control: 'boolean' },
  },
  args: {
    children: <Text>Card body content</Text>,
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Elevated: Story = {
  args: { variant: 'elevated' },
};

export const Outlined: Story = {
  args: { variant: 'outlined' },
};

export const Filled: Story = {
  args: { variant: 'filled' },
};

export const WithHeaderAndFooter: Story = {
  args: {
    header: <Text weight="bold">Card title</Text>,
    footer: <Button label="Confirm" />,
  },
};

export const Interactive: Story = {
  args: {
    interactive: true,
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole('button');
    await userEvent.click(card);
    await expect(args.onClick).toHaveBeenCalledTimes(1);

    card.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

export const PaddingVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {(['none', 'sm', 'md', 'lg'] as const).map((padding) => (
        <Card key={padding} variant="outlined" padding={padding}>
          <Text>Padding: {padding}</Text>
        </Card>
      ))}
    </div>
  ),
};
