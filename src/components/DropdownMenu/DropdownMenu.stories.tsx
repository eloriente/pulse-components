import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor, fn } from 'storybook/test';
import { Pencil, Copy, Trash2 } from 'lucide-react';
import { DropdownMenu } from './DropdownMenu';
import type { DropdownMenuAction } from './DropdownMenu';
import { Button } from '../Button';

const meta = {
  title: 'Components/Overlay/DropdownMenu',
  component: DropdownMenu,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
    },
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Rename', icon: Pencil, onSelect: fn() },
      { label: 'Duplicate', icon: Copy, onSelect: fn() },
      { type: 'separator' },
      { label: 'Delete', icon: Trash2, danger: true, onSelect: fn() },
    ],
    children: <Button label="Options" />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Options' }));
    await waitFor(() => expect(body.getByRole('menu')).toBeInTheDocument());
    expect(body.getByRole('menuitem', { name: 'Rename' })).toBeInTheDocument();
    expect(body.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
    expect(body.getByRole('separator')).toBeInTheDocument();
  },
};

export const SelectingAnItemClosesTheMenu: Story = {
  args: {
    items: [
      { label: 'Rename', onSelect: fn() },
      { label: 'Delete', danger: true, onSelect: fn() },
    ],
    children: <Button label="Options" />,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Options' }));
    await waitFor(() => expect(body.getByRole('menu')).toBeInTheDocument());
    await userEvent.click(body.getByRole('menuitem', { name: 'Rename' }));
    await expect((args.items[0] as DropdownMenuAction).onSelect).toHaveBeenCalledOnce();
    await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
  },
};

export const ArrowKeyNavigation: Story = {
  args: {
    items: [
      { label: 'First', onSelect: fn() },
      { label: 'Second', onSelect: fn() },
      { label: 'Third', onSelect: fn() },
    ],
    children: <Button label="Options" />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Options' });
    await userEvent.click(trigger);
    await waitFor(() => expect(body.getByRole('menuitem', { name: 'First' })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(body.getByRole('menuitem', { name: 'Second' })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(body.getByRole('menuitem', { name: 'Third' })).toHaveFocus());
    // Loops back to the first item.
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(body.getByRole('menuitem', { name: 'First' })).toHaveFocus());
  },
};

export const SkipsDisabledItemsOnNavigation: Story = {
  args: {
    items: [
      { label: 'First', onSelect: fn() },
      { label: 'Second (disabled)', disabled: true, onSelect: fn() },
      { label: 'Third', onSelect: fn() },
    ],
    children: <Button label="Options" />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Options' }));
    await waitFor(() => expect(body.getByRole('menuitem', { name: 'First' })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(body.getByRole('menuitem', { name: 'Third' })).toHaveFocus());
  },
};

export const ClosesOnEscapeAndReturnsFocus: Story = {
  args: {
    items: [{ label: 'Rename', onSelect: fn() }],
    children: <Button label="Options" />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Options' });
    await userEvent.click(trigger);
    await waitFor(() => expect(body.getByRole('menu')).toBeInTheDocument());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Disabled: Story = {
  args: {
    items: [{ label: 'Rename', onSelect: fn() }],
    disabled: true,
    children: <Button label="Options" />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Options' }));
    expect(body.queryByRole('menu')).not.toBeInTheDocument();
  },
};
