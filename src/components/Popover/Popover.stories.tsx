import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor, fn } from 'storybook/test';
import { Popover } from './Popover';
import { Button } from '../Button';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    placement: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
  },
  args: { 'aria-label': 'Popover' },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: (
      <div>
        <p>Interactive content goes here.</p>
        <button type="button">Focusable action</button>
      </div>
    ),
    children: <Button label="Open popover" />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Open popover' });
    await userEvent.click(trigger);
    await waitFor(() => expect(body.getByText('Interactive content goes here.')).toBeInTheDocument());
  },
};

export const MovesFocusIntoPanel: Story = {
  args: {
    content: (
      <div>
        <button type="button">Focusable action</button>
      </div>
    ),
    children: <Button label="Open popover" />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Open popover' }));
    await waitFor(() =>
      expect(body.getByRole('button', { name: 'Focusable action' })).toHaveFocus(),
    );
  },
};

export const ClosesOnEscapeAndReturnsFocus: Story = {
  args: {
    content: <div>Content</div>,
    children: <Button label="Open popover" />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Open popover' });
    await userEvent.click(trigger);
    await waitFor(() => expect(body.getByText('Content')).toBeInTheDocument());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByText('Content')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const ClosesOnOutsideClick: Story = {
  args: {
    content: <div>Content</div>,
    children: <Button label="Open popover" />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Open popover' }));
    await waitFor(() => expect(body.getByText('Content')).toBeInTheDocument());
    await userEvent.click(canvasElement.ownerDocument.body);
    await waitFor(() => expect(body.queryByText('Content')).not.toBeInTheDocument());
  },
};

export const Controlled: Story = {
  args: {
    content: <div>Controlled content</div>,
    children: <Button label="Open popover" />,
    open: false,
    onOpenChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open popover' }));
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);
  },
};

export const Disabled: Story = {
  args: {
    content: <div>You should never see this</div>,
    disabled: true,
    children: <Button label="Open popover" />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Open popover' }));
    expect(body.queryByText('You should never see this')).not.toBeInTheDocument();
  },
};
