import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect, fn } from 'storybook/test';
import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { currentPage: 1, totalPages: 5, onPageChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Page 3' }));
    await expect(args.onPageChange).toHaveBeenCalledWith(3);
  },
};

export const LastPage: Story = {
  args: { currentPage: 5, totalPages: 5, onPageChange: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('button', { name: 'Next page' })).toBeDisabled();
  },
};

export const ManyPagesWithEllipsis: Story = {
  args: { currentPage: 10, totalPages: 20, onPageChange: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'Page 20' })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'Page 10', current: 'page' })).toBeInTheDocument();
    expect(canvas.getAllByText('…')).toHaveLength(2);
  },
};

function PaginationHarness(props: { showFirstLast?: boolean }) {
  const [page, setPage] = useState(5);
  return (
    <Pagination
      currentPage={page}
      totalPages={20}
      onPageChange={setPage}
      showFirstLast={props.showFirstLast}
    />
  );
}

export const Interactive: Story = {
  render: () => <PaginationHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }));
    expect(canvas.getByRole('button', { name: 'Page 6', current: 'page' })).toBeInTheDocument();
  },
};

export const WithFirstLastButtons: Story = {
  render: () => <PaginationHarness showFirstLast />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Last page' }));
    expect(canvas.getByRole('button', { name: 'Page 20', current: 'page' })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'Last page' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'First page' }));
    expect(canvas.getByRole('button', { name: 'Page 1', current: 'page' })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'First page' })).toBeDisabled();
  },
};
