import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor, fn } from 'storybook/test';
import { Accordion } from './Accordion';

const meta = {
  title: 'Components/Navigation/Accordion',
  component: Accordion,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['single', 'multiple'] },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const BASIC_ITEMS = [
  { value: 'shipping', trigger: 'Shipping', content: 'Ships within 2 business days.' },
  { value: 'returns', trigger: 'Returns', content: 'Free returns within 30 days.' },
  { value: 'warranty', trigger: 'Warranty', content: 'Covered for 1 year.' },
];

export const Single: Story = {
  args: { items: BASIC_ITEMS, type: 'single' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const shipping = canvas.getByRole('button', { name: 'Shipping' });
    expect(shipping).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(shipping);
    expect(shipping).toHaveAttribute('aria-expanded', 'true');
    expect(canvas.getByText('Ships within 2 business days.')).toBeVisible();

    const returns = canvas.getByRole('button', { name: 'Returns' });
    await userEvent.click(returns);
    // Single mode: opening "Returns" closes "Shipping".
    expect(shipping).toHaveAttribute('aria-expanded', 'false');
    expect(returns).toHaveAttribute('aria-expanded', 'true');
  },
};

export const Multiple: Story = {
  args: { items: BASIC_ITEMS, type: 'multiple' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Shipping' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Returns' }));
    expect(canvas.getByRole('button', { name: 'Shipping' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(canvas.getByRole('button', { name: 'Returns' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  },
};

export const NotCollapsible: Story = {
  args: { items: BASIC_ITEMS, type: 'single', collapsible: false, defaultValue: ['shipping'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const shipping = canvas.getByRole('button', { name: 'Shipping' });
    expect(shipping).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(shipping);
    // collapsible=false: clicking the already-open item keeps it open.
    expect(shipping).toHaveAttribute('aria-expanded', 'true');
  },
};

export const IconOnLeft: Story = {
  args: { items: BASIC_ITEMS, iconPosition: 'left' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Shipping' });
    expect(trigger.firstElementChild?.tagName).toBe('svg');
  },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      { value: 'shipping', trigger: 'Shipping', content: 'Content' },
      { value: 'returns', trigger: 'Returns', content: 'Content', disabled: true },
      { value: 'warranty', trigger: 'Warranty', content: 'Content' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('button', { name: 'Returns' })).toBeDisabled();
  },
};

export const ArrowKeyNavigation: Story = {
  args: { items: BASIC_ITEMS },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button', { name: 'Shipping' }).focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Returns' })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Warranty' })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Shipping' })).toHaveFocus());
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Warranty' })).toHaveFocus());
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Shipping' })).toHaveFocus());
  },
};

export const Controlled: Story = {
  args: { items: BASIC_ITEMS, value: ['returns'], onChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('button', { name: 'Returns' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Shipping' }));
    await expect(args.onChange).toHaveBeenCalledWith(['shipping']);
    // Controlled: stays on "Returns" since the consumer didn't update `value`.
    expect(canvas.getByRole('button', { name: 'Returns' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  },
};
