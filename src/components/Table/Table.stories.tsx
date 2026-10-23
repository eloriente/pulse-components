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
  email: string;
  bio: string;
}

const PEOPLE: Person[] = [
  {
    id: 1,
    name: 'Ada Lovelace',
    role: 'Engineer',
    status: 'active',
    email: 'ada@example.com',
    bio: 'Wrote the first published algorithm intended for a machine.',
  },
  {
    id: 2,
    name: 'Grace Hopper',
    role: 'Engineer',
    status: 'active',
    email: 'grace@example.com',
    bio: 'Pioneered machine-independent programming languages.',
  },
  {
    id: 3,
    name: 'Alan Turing',
    role: 'Researcher',
    status: 'inactive',
    email: 'alan@example.com',
    bio: 'Laid the theoretical foundations of computer science.',
  },
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

export const ExpandableRows: Story = {
  args: {
    columns: basicColumns,
    data: PEOPLE,
    getRowKey: (row) => row.id,
    renderExpandedRow: (row) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span>
          <strong>Email:</strong> {row.email}
        </span>
        <span>{row.bio}</span>
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggles = canvas.getAllByRole('button', { name: 'Expand row' });
    expect(toggles).toHaveLength(3);

    // Several rows can be expanded at once.
    await userEvent.click(toggles[0]);
    await userEvent.click(toggles[1]);
    expect(canvas.getByText('ada@example.com')).toBeInTheDocument();
    expect(canvas.getByText('grace@example.com')).toBeInTheDocument();
    expect(canvas.queryByText('alan@example.com')).not.toBeInTheDocument();

    expect(toggles[0]).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(toggles[0]);
    expect(toggles[0]).toHaveAttribute('aria-expanded', 'false');
  },
};

export const ControlledExpandedRows: Story = {
  render: function Render() {
    const [expandedRowKeys, setExpandedRowKeys] = useState<Array<string | number>>([1]);
    return (
      <Table
        columns={basicColumns}
        data={PEOPLE}
        getRowKey={(row) => row.id}
        expandedRowKeys={expandedRowKeys}
        onExpandedRowsChange={setExpandedRowKeys}
        renderExpandedRow={(row) => <span>{row.bio}</span>}
      />
    );
  },
};
