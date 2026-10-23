import { useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Icon } from '../Icon';
import styles from './Table.module.css';

export type SortDirection = 'asc' | 'desc';
export type TableColumnAlign = 'left' | 'center' | 'right';

export interface TableColumn<T> {
  /** Unique key identifying the column; used as the sort key and, with no `render`, to read the cell value */
  key: keyof T & string;
  /** Column header content */
  header: ReactNode;
  /** Enables click-to-sort on this column's header. Default `false` */
  sortable?: boolean;
  /** Renders a cell's content. Defaults to `String(row[key])` */
  render?: (row: T, rowIndex: number) => ReactNode;
  /** Text alignment for the header and its cells. Default `'left'` */
  align?: TableColumnAlign;
}

export interface TableProps<T> {
  /** Column definitions, in display order */
  columns: TableColumn<T>[];
  /** Rows to render. Table is presentational only — sort the array yourself in response to `onSort` */
  data: T[];
  /** Derives a stable React key for a row. Defaults to the row's index */
  getRowKey?: (row: T, index: number) => string | number;
  /** Controlled: the currently sorted column's key */
  sortKey?: string;
  /** Controlled: the currently sorted column's direction */
  sortDirection?: SortDirection;
  /** Uncontrolled: initial sorted column's key */
  defaultSortKey?: string;
  /** Uncontrolled: initial sorted column's direction. Default `'asc'` */
  defaultSortDirection?: SortDirection;
  /** Called when a sortable header is activated, with the column key and the direction it should now sort by */
  onSort?: (key: string, direction: SortDirection) => void;
  /** Optional caption describing the table, rendered as a native `<caption>` */
  caption?: ReactNode;
  /** Additional class applied to the `<table>` element */
  className?: string;
}

/**
 * Presentational data table with optional click-to-sort column headers.
 * Table never sorts `data` itself — sortable headers toggle an ascending/
 * descending indicator and call `onSort(key, direction)`; the caller re-sorts
 * `data` and passes it back down (controlled), or omits `sortKey`/
 * `sortDirection` to let Table track the indicator itself (uncontrolled).
 * Has no built-in pagination — compose with {@link Pagination} if needed.
 *
 * @example
 * ```tsx
 * <Table
 *   columns={[
 *     { key: 'name', header: 'Name', sortable: true },
 *     { key: 'role', header: 'Role' },
 *   ]}
 *   data={people}
 *   onSort={(key, direction) => setPeople(sortPeople(people, key, direction))}
 * />
 * ```
 */
export function Table<T>({
  columns,
  data,
  getRowKey,
  sortKey,
  sortDirection,
  defaultSortKey,
  defaultSortDirection = 'asc',
  onSort,
  caption,
  className,
}: TableProps<T>) {
  const isControlled = sortKey !== undefined;
  const [internalSortKey, setInternalSortKey] = useState(defaultSortKey);
  const [internalSortDirection, setInternalSortDirection] = useState(defaultSortDirection);

  const activeSortKey = isControlled ? sortKey : internalSortKey;
  const activeSortDirection = isControlled ? (sortDirection ?? 'asc') : internalSortDirection;

  const handleSort = (columnKey: string) => {
    const nextDirection: SortDirection =
      columnKey === activeSortKey && activeSortDirection === 'asc' ? 'desc' : 'asc';

    if (!isControlled) {
      setInternalSortKey(columnKey);
      setInternalSortDirection(nextDirection);
    }
    onSort?.(columnKey, nextDirection);
  };

  return (
    <table className={[styles.table, className].filter(Boolean).join(' ')}>
      {caption && <caption className={styles.caption}>{caption}</caption>}
      <thead>
        <tr>
          {columns.map((column) => {
            const align = column.align ?? 'left';
            const isSorted = column.sortable && column.key === activeSortKey;

            return (
              <th
                key={column.key}
                scope="col"
                className={[styles.th, styles[align]].join(' ')}
                aria-sort={
                  !column.sortable
                    ? undefined
                    : isSorted
                      ? activeSortDirection === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                }
              >
                {column.sortable ? (
                  <button
                    type="button"
                    className={styles.sortButton}
                    onClick={() => handleSort(column.key)}
                  >
                    {column.header}
                    <Icon
                      as={
                        !isSorted
                          ? ChevronsUpDown
                          : activeSortDirection === 'desc'
                            ? ChevronDown
                            : ChevronUp
                      }
                      size="xs"
                      className={[styles.sortIcon, isSorted ? styles.sortIconActive : '']
                        .filter(Boolean)
                        .join(' ')}
                    />
                  </button>
                ) : (
                  column.header
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={getRowKey ? getRowKey(row, rowIndex) : rowIndex} className={styles.tr}>
            {columns.map((column) => (
              <td key={column.key} className={[styles.td, styles[column.align ?? 'left']].join(' ')}>
                {column.render ? column.render(row, rowIndex) : String(row[column.key] ?? '')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
