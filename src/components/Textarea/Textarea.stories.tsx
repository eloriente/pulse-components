import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect } from 'storybook/test';
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ width: '320px' }}><Story /></div>],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Write something...' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole('textbox');
    await userEvent.type(textarea, 'Hello world');
    await expect(textarea).toHaveValue('Hello world');
  },
};

export const Filled: Story = {
  args: { variant: 'filled', placeholder: 'Filled variant' },
};

export const WithError: Story = {
  args: {
    id: 'bio',
    'aria-label': 'Biography',
    placeholder: 'Your bio',
    error: true,
    errorMessage: 'Bio cannot exceed 500 characters',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('alert')).toHaveTextContent('Bio cannot exceed 500 characters');
  },
};

export const Disabled: Story = {
  args: { placeholder: 'Disabled textarea', disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox')).toBeDisabled();
  },
};

export const NoResize: Story = {
  args: { placeholder: 'Cannot resize', resize: 'none' },
};
