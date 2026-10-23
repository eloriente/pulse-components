import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect } from 'storybook/test';
import { FieldGroup } from './FieldGroup';
import { Input } from '../Input';
import { Textarea } from '../Textarea';
import { Select } from '../Select';

const meta = {
  title: 'Components/Form/FieldGroup',
  component: FieldGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { label: 'Label', children: <Input /> },
} satisfies Meta<typeof FieldGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: '280px' }}>
      <FieldGroup label="Email address">
        <Input type="email" placeholder="you@example.com" />
      </FieldGroup>
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div style={{ width: '280px' }}>
      <FieldGroup label="Full name" required>
        <Input placeholder="Jane Doe" />
      </FieldGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Jane Doe');
    expect(input).toHaveAttribute('required');
    expect(canvas.getByText('Full name')).toBeInTheDocument();
  },
};

export const WithHelperText: Story = {
  render: () => (
    <div style={{ width: '280px' }}>
      <FieldGroup label="Username" helperText="This will be visible to other users.">
        <Input placeholder="janedoe" />
      </FieldGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('janedoe');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(canvas.getByText('This will be visible to other users.').id).toBe(describedBy);
  },
};

export const WithErrorMessage: Story = {
  render: () => (
    <div style={{ width: '280px' }}>
      <FieldGroup label="Email address" errorMessage="Please enter a valid email address.">
        <Input type="email" defaultValue="not-an-email" />
      </FieldGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByDisplayValue('not-an-email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(canvas.getByRole('alert')).toHaveTextContent('Please enter a valid email address.');
  },
};

export const InteractiveValidation: Story = {
  render: function Render() {
    const [value, setValue] = useState('');
    const error = value.length > 0 && !value.includes('@') ? 'Must contain an "@" symbol.' : undefined;
    return (
      <div style={{ width: '280px' }}>
        <FieldGroup label="Email address" required errorMessage={error}>
          <Input
            type="email"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </FieldGroup>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    expect(input).not.toHaveAttribute('aria-invalid', 'true');

    await userEvent.type(input, 'invalid');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(canvas.getByRole('alert')).toBeInTheDocument();

    await userEvent.type(input, '@example.com');
    expect(input).not.toHaveAttribute('aria-invalid', 'true');
  },
};

export const WithTextarea: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <FieldGroup label="Bio" helperText="Max 200 characters.">
        <Textarea placeholder="Tell us about yourself" />
      </FieldGroup>
    </div>
  ),
};

export const WithSelect: Story = {
  render: () => (
    <div style={{ width: '280px' }}>
      <FieldGroup label="Country" required>
        <Select placeholder="Select a country">
          <option value="es">Spain</option>
          <option value="fr">France</option>
        </Select>
      </FieldGroup>
    </div>
  ),
};
