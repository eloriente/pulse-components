import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor } from 'storybook/test';
import { Drawer } from './Drawer';
import type { DrawerPlacement } from './Drawer';
import { Button } from '../Button';

const meta = {
  title: 'Components/Layout/Drawer',
  component: Drawer,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Every story below closes the drawer again at the end of its `play` function.
// Its backdrop covers the whole viewport (`position: fixed; inset: 0`), so a
// story left open would block the rest of the Docs page in Storybook's inline
// autodocs rendering — there's no iframe isolating one story from the next.
function DrawerHarness(props: Omit<React.ComponentProps<typeof Drawer>, 'open' | 'onClose'>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button label="Open drawer" onClick={() => setOpen(true)} />
      <Drawer {...props} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export const Right: Story = {
  render: () => (
    <DrawerHarness title="Filters" placement="right">
      <p>Drawer content.</p>
    </DrawerHarness>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Open drawer' }));
    await waitFor(() => expect(body.getByRole('dialog')).toBeInTheDocument());
    expect(body.getByRole('heading', { name: 'Filters' })).toBeInTheDocument();
    await userEvent.click(body.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

export const AllPlacements: Story = {
  render: function Render() {
    const [placement, setPlacement] = useState<DrawerPlacement | null>(null);
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        {(['left', 'right', 'top', 'bottom'] as const).map((p) => (
          <Button key={p} label={p} onClick={() => setPlacement(p)} />
        ))}
        <Drawer
          open={placement !== null}
          onClose={() => setPlacement(null)}
          placement={placement ?? 'right'}
          title="Drawer"
        >
          <p>Placement: {placement}</p>
        </Drawer>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    for (const p of ['left', 'right', 'top', 'bottom']) {
      await userEvent.click(canvas.getByRole('button', { name: p }));
      await waitFor(() => expect(body.getByRole('dialog')).toBeInTheDocument());
      await userEvent.click(body.getByRole('button', { name: 'Close' }));
      await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    }
  },
};

export const Sizes: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button label="Open large drawer" onClick={() => setOpen(true)} />
        <Drawer open={open} onClose={() => setOpen(false)} title="Large drawer" size="lg">
          <p>Drawer content.</p>
        </Drawer>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Open large drawer' }));
    await waitFor(() => expect(body.getByRole('dialog')).toBeInTheDocument());
    await userEvent.click(body.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

export const ClosesOnEscapeAndReturnsFocus: Story = {
  render: () => (
    <DrawerHarness title="Confirm">
      <p>Content</p>
    </DrawerHarness>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Open drawer' });
    await userEvent.click(trigger);
    await waitFor(() => expect(body.getByRole('dialog')).toBeInTheDocument());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const ClosesOnBackdropClick: Story = {
  render: () => (
    <DrawerHarness title="Confirm">
      <p>Content</p>
    </DrawerHarness>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Open drawer' }));
    await waitFor(() => expect(body.getByRole('dialog')).toBeInTheDocument());
    await userEvent.click(body.getByRole('dialog').parentElement as HTMLElement);
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

export const WithoutTitleRequiresAriaLabel: Story = {
  render: () => (
    <DrawerHarness aria-label="Loading progress">
      <p>Content with no visible heading</p>
    </DrawerHarness>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Open drawer' }));
    await waitFor(() =>
      expect(body.getByRole('dialog', { name: 'Loading progress' })).toBeInTheDocument(),
    );
    await userEvent.click(body.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  },
};
