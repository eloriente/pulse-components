import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect } from 'storybook/test';
import { TagInput } from './TagInput';

const meta = {
  title: 'Components/Form/TagInput',
  component: TagInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    'aria-label': 'Skills',
    placeholder: 'Add a skill…',
  },
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: '280px' }}>
      <TagInput {...args} />
    </div>
  ),
};

export const WithInitialTags: Story = {
  args: { defaultValue: ['React', 'TypeScript'] },
  render: (args) => (
    <div style={{ width: '280px' }}>
      <TagInput {...args} />
    </div>
  ),
};

export const AddAndRemoveTags: Story = {
  render: (args) => (
    <div style={{ width: '280px' }}>
      <TagInput {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');

    await userEvent.type(input, 'React{Enter}');
    expect(canvas.getByText('React')).toBeInTheDocument();

    await userEvent.type(input, 'Vue,');
    expect(canvas.getByText('Vue')).toBeInTheDocument();

    // Backspace on an empty input removes the last tag.
    await userEvent.keyboard('{Backspace}');
    expect(canvas.queryByText('Vue')).not.toBeInTheDocument();
    expect(canvas.getByText('React')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Remove React' }));
    expect(canvas.queryByText('React')).not.toBeInTheDocument();
  },
};

export const PreventsDuplicates: Story = {
  args: { defaultValue: ['React'] },
  render: (args) => (
    <div style={{ width: '280px' }}>
      <TagInput {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox'), 'react{Enter}');
    expect(canvas.getAllByText(/react/i)).toHaveLength(1);
  },
};

export const MaxTags: Story = {
  args: { defaultValue: ['React', 'Vue'], maxTags: 2 },
  render: (args) => (
    <div style={{ width: '280px' }}>
      <TagInput {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('textbox')).toBeDisabled();
  },
};

export const WithError: Story = {
  args: { errorMessage: 'At least one skill is required.', error: true },
  render: (args) => (
    <div style={{ width: '280px' }}>
      <TagInput {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { defaultValue: ['React', 'TypeScript'], disabled: true },
  render: (args) => (
    <div style={{ width: '280px' }}>
      <TagInput {...args} />
    </div>
  ),
};

export const ControlledTags: Story = {
  render: function Render(args) {
    const [tags, setTags] = useState<string[]>(['React']);
    return (
      <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <TagInput {...args} value={tags} onChange={setTags} />
        <span>Count: {tags.length}</span>
      </div>
    );
  },
};
