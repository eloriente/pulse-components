import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Table } from './Table';
import type { TableColumn } from './Table';

interface Person {
  id: number;
  name: string;
  role: string;
}

const PEOPLE: Person[] = [
  { id: 1, name: 'Ada', role: 'Engineer' },
  { id: 2, name: 'Grace', role: 'Admiral' },
];

const columns: TableColumn<Person>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role' },
];

describe('Table', () => {
  describe('Rendering', () => {
    it('renders a header cell per column', () => {
      render(<Table columns={columns} data={PEOPLE} />);
      expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Role' })).toBeInTheDocument();
    });

    it('renders a row per data item with the default string rendering', () => {
      render(<Table columns={columns} data={PEOPLE} />);
      expect(screen.getByRole('cell', { name: 'Ada' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: 'Admiral' })).toBeInTheDocument();
    });

    it('renders custom cell content via render()', () => {
      const customColumns: TableColumn<Person>[] = [
        { key: 'name', header: 'Name', render: (row) => <strong>{row.name.toUpperCase()}</strong> },
      ];
      render(<Table columns={customColumns} data={PEOPLE} />);
      expect(screen.getByText('ADA')).toBeInTheDocument();
    });

    it('renders a caption when provided', () => {
      render(<Table columns={columns} data={PEOPLE} caption="People" />);
      expect(screen.getByText('People')).toBeInTheDocument();
    });

    it('renders no rows for empty data', () => {
      render(<Table columns={columns} data={[]} />);
      expect(screen.queryAllByRole('row')).toHaveLength(1); // header row only
    });

    it('uses getRowKey to derive row keys without warnings', () => {
      render(<Table columns={columns} data={PEOPLE} getRowKey={(row) => row.id} />);
      expect(screen.getAllByRole('row')).toHaveLength(3);
    });
  });

  describe('Sorting', () => {
    it('non-sortable columns have no aria-sort attribute', () => {
      render(<Table columns={columns} data={PEOPLE} />);
      expect(screen.getByRole('columnheader', { name: 'Role' })).not.toHaveAttribute('aria-sort');
    });

    it('sortable, unsorted columns have aria-sort="none"', () => {
      render(<Table columns={columns} data={PEOPLE} />);
      expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'none');
    });

    it('non-sortable headers are plain text, not buttons', () => {
      render(<Table columns={columns} data={PEOPLE} />);
      expect(screen.queryByRole('button', { name: 'Role' })).not.toBeInTheDocument();
    });

    it('calls onSort with ascending direction on first click', async () => {
      const user = userEvent.setup();
      const onSort = vi.fn();
      render(<Table columns={columns} data={PEOPLE} onSort={onSort} />);
      await user.click(screen.getByRole('button', { name: /Name/ }));
      expect(onSort).toHaveBeenCalledWith('name', 'asc');
    });

    it('toggles to descending on a second click (uncontrolled)', async () => {
      const user = userEvent.setup();
      const onSort = vi.fn();
      render(<Table columns={columns} data={PEOPLE} onSort={onSort} />);
      const sortButton = screen.getByRole('button', { name: /Name/ });
      await user.click(sortButton);
      await user.click(sortButton);
      expect(onSort).toHaveBeenNthCalledWith(2, 'name', 'desc');
      expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute(
        'aria-sort',
        'descending',
      );
    });

    it('reflects controlled sortKey/sortDirection instead of managing its own state', async () => {
      const user = userEvent.setup();
      const onSort = vi.fn();
      render(
        <Table
          columns={columns}
          data={PEOPLE}
          sortKey="name"
          sortDirection="desc"
          onSort={onSort}
        />,
      );
      expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute(
        'aria-sort',
        'descending',
      );
      await user.click(screen.getByRole('button', { name: /Name/ }));
      // Controlled: clicking still fires onSort, but the indicator doesn't change on its own.
      expect(onSort).toHaveBeenCalledWith('name', 'asc');
      expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute(
        'aria-sort',
        'descending',
      );
    });

    it('respects defaultSortKey/defaultSortDirection', () => {
      render(
        <Table columns={columns} data={PEOPLE} defaultSortKey="name" defaultSortDirection="desc" />,
      );
      expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute(
        'aria-sort',
        'descending',
      );
    });
  });

  describe('Alignment', () => {
    it('applies the right alignment class to header and cells', () => {
      const alignedColumns: TableColumn<Person>[] = [{ key: 'name', header: 'Name', align: 'right' }];
      render(<Table columns={alignedColumns} data={PEOPLE} />);
      expect(screen.getByRole('columnheader', { name: 'Name' }).className).toContain('right');
      expect(screen.getAllByRole('cell')[0].className).toContain('right');
    });
  });

  describe('Styling', () => {
    it('applies a custom className to the table element', () => {
      render(<Table columns={columns} data={PEOPLE} className="my-table" />);
      expect(screen.getByRole('table')).toHaveClass('my-table');
    });
  });
});
