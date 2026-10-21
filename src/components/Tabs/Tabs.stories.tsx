import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor, fn } from 'storybook/test';
import { Tabs } from './Tabs';

const meta = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const BASIC_ITEMS = [
  { value: 'account', label: 'Account', content: 'Manage your account settings.' },
  { value: 'billing', label: 'Billing', content: 'View invoices and payment methods.' },
  { value: 'team', label: 'Team', content: 'Invite and manage teammates.' },
];

export const Default: Story = {
  args: { items: BASIC_ITEMS },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('tab', { name: 'Account', selected: true })).toBeInTheDocument();
    expect(canvas.getByText('Manage your account settings.')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('tab', { name: 'Billing' }));
    expect(canvas.getByRole('tab', { name: 'Billing', selected: true })).toBeInTheDocument();
    expect(canvas.getByText('View invoices and payment methods.')).toBeInTheDocument();
  },
};

export const Vertical: Story = {
  args: { items: BASIC_ITEMS, orientation: 'vertical' },
};

export const WithDisabledTab: Story = {
  args: {
    items: [
      { value: 'account', label: 'Account', content: 'Manage your account settings.' },
      { value: 'billing', label: 'Billing', content: 'Disabled', disabled: true },
      { value: 'team', label: 'Team', content: 'Invite and manage teammates.' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('tab', { name: 'Billing' })).toBeDisabled();
  },
};

export const ArrowKeyNavigation: Story = {
  args: { items: BASIC_ITEMS },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('tab', { name: 'Account' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() =>
      expect(canvas.getByRole('tab', { name: 'Billing' })).toHaveFocus(),
    );
    expect(canvas.getByRole('tab', { name: 'Billing', selected: true })).toBeInTheDocument();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(canvas.getByRole('tab', { name: 'Team' })).toHaveFocus());
    // Loops back to the first tab.
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(canvas.getByRole('tab', { name: 'Account' })).toHaveFocus());
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(canvas.getByRole('tab', { name: 'Team' })).toHaveFocus());
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(canvas.getByRole('tab', { name: 'Account' })).toHaveFocus());
  },
};

export const SkipsDisabledTabOnNavigation: Story = {
  args: {
    items: [
      { value: 'account', label: 'Account', content: 'Account content' },
      { value: 'billing', label: 'Billing', content: 'Billing content', disabled: true },
      { value: 'team', label: 'Team', content: 'Team content' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('tab', { name: 'Account' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(canvas.getByRole('tab', { name: 'Team' })).toHaveFocus());
  },
};

export const Controlled: Story = {
  args: { items: BASIC_ITEMS, value: 'billing', onChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('tab', { name: 'Billing', selected: true })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('tab', { name: 'Team' }));
    await expect(args.onChange).toHaveBeenCalledWith('team');
    // Controlled: stays on "Billing" since the consumer didn't update `value`.
    expect(canvas.getByRole('tab', { name: 'Billing', selected: true })).toBeInTheDocument();
  },
};
