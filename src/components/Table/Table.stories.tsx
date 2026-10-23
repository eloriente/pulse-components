import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect } from 'storybook/test';
import { Table } from './Table';
import type { TableColumn, SortDirection } from './Table';
import { Badge } from '../Badge';

interface Person {
  id: number;
  name: string;
  role: string;
  status: 'active' | 'inactive';
}

const PEOPLE: Person[] = [
  { id: 1, name: 'Ada Lovelace', role: 'Engineer', status: 'active' },
  { id: 2, name: 'Grace Hopper', role: 'Engineer', status: 'active' },
  { id: 3, name: 'Alan Turing', role: 'Researcher', status: 'inactive' },
];

const meta = {
  title: 'Components/Layout/Table',
  component: Table,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof Table<Person>>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicColumns: TableColumn<Person>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role', sortable: true },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (row) => (
      <Badge variant="subtle" color={row.status === 'active' ? 'success' : 'default'}>
        {row.status}
      </Badge>
    ),
  },
];

export const Basic: Story = {
  args: {
    columns: basicColumns,
    data: PEOPLE,
    getRowKey: (row) => row.id,
  },
};

export const WithCaption: Story = {
  args: {
    columns: basicColumns,
    data: PEOPLE,
    getRowKey: (row) => row.id,
    caption: 'Team members',
  },
};

function sortPeople(data: Person[], key: string, direction: SortDirection): Person[] {
  const sorted = [...data].sort((a, b) => {
    const aValue = String(a[key as keyof Person]);
    const bValue = String(b[key as keyof Person]);
    return aValue.localeCompare(bValue);
  });
  return direction === 'asc' ? sorted : sorted.reverse();
}

export const ControlledSorting: Story = {
  render: function Render() {
    const [sortKey, setSortKey] = useState<string | undefined>(undefined);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [rows, setRows] = useState(PEOPLE);

    return (
      <Table
        columns={basicColumns}
        data={rows}
        getRowKey={(row) => row.id}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={(key, direction) => {
          setSortKey(key);
          setSortDirection(direction);
          setRows(sortPeople(PEOPLE, key, direction));
        }}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameHeader = canvas.getByRole('columnheader', { name: /Name/i });
    expect(nameHeader).toHaveAttribute('aria-sort', 'none');

    await userEvent.click(canvas.getByRole('button', { name: /Name/i }));
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

    const cells = canvas.getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('Ada Lovelace');

    await userEvent.click(canvas.getByRole('button', { name: /Name/i }));
    expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
  },
};

export const UncontrolledSorting: Story = {
  args: {
    columns: basicColumns,
    data: PEOPLE,
    getRowKey: (row) => row.id,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const roleHeader = canvas.getByRole('columnheader', { name: /Role/i });
    await userEvent.click(canvas.getByRole('button', { name: /Role/i }));
    expect(roleHeader).toHaveAttribute('aria-sort', 'ascending');
  },
};

const emptyColumns: TableColumn<Person>[] = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role' },
];

export const Empty: Story = {
  args: {
    columns: emptyColumns,
    data: [],
  },
};
