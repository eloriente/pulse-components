import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor } from 'storybook/test';
import { Trash2 } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { Button } from '../Button';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    placement: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
  },
  args: { delay: 0 },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Top: Story = {
  args: {
    content: 'Saved to your library',
    placement: 'top',
    children: <button type="button">Hover me</button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The tooltip bubble renders in a FloatingPortal outside canvasElement, so it's
    // queried from the document body instead of the scoped canvas.
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Hover me' });
    await userEvent.hover(trigger);
    await waitFor(() => expect(body.getByRole('tooltip')).toBeInTheDocument());
    expect(body.getByRole('tooltip')).toHaveTextContent('Saved to your library');
  },
};

export const Bottom: Story = {
  args: {
    content: 'Appears below the trigger',
    placement: 'bottom',
    children: <button type="button">Hover me</button>,
  },
};

export const Left: Story = {
  args: {
    content: 'Appears to the left',
    placement: 'left',
    children: <button type="button">Hover me</button>,
  },
};

export const Right: Story = {
  args: {
    content: 'Appears to the right',
    placement: 'right',
    children: <button type="button">Hover me</button>,
  },
};

export const WithIconButton: Story = {
  args: {
    content: 'Delete item',
    children: <Button iconOnly={Trash2} aria-label="Delete" />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Delete' });
    await userEvent.hover(trigger);
    await waitFor(() => expect(body.getByRole('tooltip')).toBeInTheDocument());
  },
};

export const OnKeyboardFocus: Story = {
  args: {
    content: 'Keyboard accessible',
    children: <button type="button">Tab to me</button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.tab();
    await waitFor(() =>
      expect(canvas.getByRole('button', { name: 'Tab to me' })).toHaveFocus(),
    );
    await waitFor(() => expect(body.getByRole('tooltip')).toBeInTheDocument());
  },
};

export const Disabled: Story = {
  args: {
    content: 'You should never see this',
    disabled: true,
    children: <button type="button">Hover me</button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Hover me' });
    await userEvent.hover(trigger);
    expect(body.queryByRole('tooltip')).not.toBeInTheDocument();
  },
};
