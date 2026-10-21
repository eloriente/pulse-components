import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Icon } from '../Icon';
import styles from './Pagination.module.css';

export interface PaginationProps {
  /** Current page, 1-indexed */
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Page numbers shown immediately adjacent to the current page on each side. Default `1` */
  siblingCount?: number;
  /** Shows buttons that jump straight to the first/last page. Default `false` */
  showFirstLast?: boolean;
  /** Additional CSS classes */
  className?: string;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Computes which page numbers and ellipses to render for a given page/total,
 * always keeping the first and last page visible. Exported for direct unit
 * testing of the (fiddly) gap/ellipsis logic, independent of rendering.
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): (number | 'ellipsis')[] {
  const totalPageNumbers = siblingCount * 2 + 5; // first + last + current + 2 ellipses worth of slack

  if (totalPageNumbers >= totalPages) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftEllipsis = leftSiblingIndex > 2;
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const leftRange = range(1, 3 + 2 * siblingCount);
    return [...leftRange, 'ellipsis', totalPages];
  }

  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    const rightRange = range(totalPages - (3 + 2 * siblingCount) + 1, totalPages);
    return [1, 'ellipsis', ...rightRange];
  }

  return [1, 'ellipsis', ...range(leftSiblingIndex, rightSiblingIndex), 'ellipsis', totalPages];
}

/**
 * Accessible pagination: `nav[aria-label="Pagination"]` with Previous/Next
 * buttons and page number buttons, collapsing distant pages into an ellipsis
 * while always keeping the first and last page visible.
 *
 * @example
 * ```tsx
 * <Pagination currentPage={page} totalPages={12} onPageChange={setPage} />
 * ```
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = false,
  className,
}: PaginationProps) {
  const pages = getPaginationRange(currentPage, totalPages, siblingCount);

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <nav
      aria-label="Pagination"
      className={[styles.pagination, className].filter(Boolean).join(' ')}
    >
      <ul className={styles.list}>
        {showFirstLast && (
          <li>
            <button
              type="button"
              className={styles.navButton}
              aria-label="First page"
              disabled={currentPage <= 1}
              onClick={() => goTo(1)}
            >
              <Icon as={ChevronsLeft} size="sm" />
            </button>
          </li>
        )}
        <li>
          <button
            type="button"
            className={styles.navButton}
            aria-label="Previous page"
            disabled={currentPage <= 1}
            onClick={() => goTo(currentPage - 1)}
          >
            <Icon as={ChevronLeft} size="sm" />
          </button>
        </li>
        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <li key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={page}>
              <button
                type="button"
                aria-current={page === currentPage ? 'page' : undefined}
                aria-label={`Page ${page}`}
                className={[styles.pageButton, page === currentPage ? styles.current : '']
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => goTo(page)}
              >
                {page}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            className={styles.navButton}
            aria-label="Next page"
            disabled={currentPage >= totalPages}
            onClick={() => goTo(currentPage + 1)}
          >
            <Icon as={ChevronRight} size="sm" />
          </button>
        </li>
        {showFirstLast && (
          <li>
            <button
              type="button"
              className={styles.navButton}
              aria-label="Last page"
              disabled={currentPage >= totalPages}
              onClick={() => goTo(totalPages)}
            >
              <Icon as={ChevronsRight} size="sm" />
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
