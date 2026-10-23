import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor } from 'storybook/test';
import { Combobox } from './Combobox';

const COUNTRIES = [
  { value: 'es', label: 'Spain' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'it', label: 'Italy' },
  { value: 'pt', label: 'Portugal' },
];

const meta = {
  title: 'Components/Form/Combobox',
  component: Combobox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    options: COUNTRIES,
    'aria-label': 'Country',
    placeholder: 'Search a country…',
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: '240px' }}>
      <Combobox {...args} />
    </div>
  ),
};

export const FiltersAsYouType: Story = {
  render: (args) => (
    <div style={{ width: '240px' }}>
      <Combobox {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole('combobox');
    await userEvent.type(input, 'fr');
    await waitFor(() => expect(body.getByRole('option', { name: 'France' })).toBeInTheDocument());
    expect(body.queryByRole('option', { name: 'Spain' })).not.toBeInTheDocument();
  },
};

export const SelectWithKeyboard: Story = {
  render: (args) => (
    <div style={{ width: '240px' }}>
      <Combobox {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole('combobox');
    await userEvent.click(input);
    await waitFor(() => expect(body.getByRole('listbox')).toBeInTheDocument());
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    await waitFor(() => expect(input).toHaveValue('France'));
    expect(body.queryByRole('listbox')).not.toBeInTheDocument();
  },
};

export const SelectWithClick: Story = {
  render: (args) => (
    <div style={{ width: '240px' }}>
      <Combobox {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole('combobox');
    await userEvent.click(input);
    const option = await body.findByRole('option', { name: 'Germany' });
    await userEvent.click(option);
    expect(input).toHaveValue('Germany');
  },
};

export const NoResults: Story = {
  render: (args) => (
    <div style={{ width: '240px' }}>
      <Combobox {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole('combobox');
    await userEvent.type(input, 'xyz');
    await waitFor(() => expect(body.getByText('No results')).toBeInTheDocument());
  },
};

export const WithError: Story = {
  args: {
    error: true,
    errorMessage: 'Please select a country.',
  },
  render: (args) => (
    <div style={{ width: '240px' }}>
      <Combobox {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'es' },
  render: (args) => (
    <div style={{ width: '240px' }}>
      <Combobox {...args} />
    </div>
  ),
};

export const ControlledSelection: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | undefined>('es');
    return (
      <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Combobox {...args} value={value} onChange={setValue} />
        <span>Selected: {value ?? 'none'}</span>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole('combobox');
    expect(input).toHaveValue('Spain');
    await userEvent.click(input);
    const option = await body.findByRole('option', { name: 'Italy' });
    await userEvent.click(option);
    expect(canvas.getByText('Selected: it')).toBeInTheDocument();
  },
};
