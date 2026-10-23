import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor } from 'storybook/test';
import { DatePicker } from './DatePicker';

const meta = {
  title: 'Components/Form/DatePicker',
  component: DatePicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    'aria-label': 'Date',
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// Every story below closes the calendar again at the end of its `play`
// function — its panel is rendered in a FloatingPortal, so a story left open
// would leave stray floating elements in the DOM for the next story (same
// precaution Popover's own stories take).

export const Default: Story = {};

export const WithInitialValue: Story = {
  args: { defaultValue: new Date(2026, 0, 15) },
};

export const SelectADate: Story = {
  args: { defaultValue: new Date(2026, 0, 15) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole('textbox', { name: 'Date' });

    await userEvent.click(input);
    await waitFor(() => expect(body.getByRole('grid')).toBeInTheDocument());

    // Outside days (from the previous/next month) are hidden by default, so
    // "20" can only refer to January 20th here — no ambiguity to guard against.
    const targetCell = body.getByRole('gridcell', { name: '20' });
    await userEvent.click(within(targetCell).getByRole('button'));

    await waitFor(() => expect(body.queryByRole('grid')).not.toBeInTheDocument());
    expect(input).toHaveValue(new Date(2026, 0, 20).toLocaleDateString());
  },
};

export const MinAndMaxDate: Story = {
  args: {
    minDate: new Date(2026, 0, 10),
    maxDate: new Date(2026, 0, 20),
    defaultValue: new Date(2026, 0, 15),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('textbox', { name: 'Date' }));
    await waitFor(() => expect(body.getByRole('grid')).toBeInTheDocument());
    const outOfRangeCell = body.getByRole('gridcell', { name: '5' });
    expect(within(outOfRangeCell).getByRole('button')).toBeDisabled();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('grid')).not.toBeInTheDocument());
  },
};

export const CustomFormat: Story = {
  args: {
    defaultValue: new Date(2026, 0, 15),
    formatDate: (date) =>
      date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  },
};

export const WithError: Story = {
  args: { error: true, errorMessage: 'A date is required.' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: new Date(2026, 0, 15) },
};

export const ControlledValue: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<Date | undefined>(new Date(2026, 0, 15));
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <DatePicker {...args} value={value} onChange={setValue} />
        <span>Selected: {value ? value.toLocaleDateString() : 'none'}</span>
      </div>
    );
  },
};
