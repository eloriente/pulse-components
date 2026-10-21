import type { CSSProperties, ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { Icon } from '../Icon';
import styles from './Breadcrumb.module.css';

export interface BreadcrumbItem {
  label: ReactNode;
  /** Link target. Ignored for the last item, which always renders as the current page */
  href?: string;
}

export interface BreadcrumbProps {
  /** Items in order, from the root down to the current page (the last item) */
  items: BreadcrumbItem[];
  /** Rendered between items. Default a chevron icon */
  separator?: ReactNode;
  /** Space, in px, around each separator. Defaults to the `--pulse-space-2` token (8px) */
  gap?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Accessible breadcrumb trail: `nav[aria-label="Breadcrumb"]` wrapping an
 * ordered list. The last item always renders as the current page
 * (`aria-current="page"`, not a link) regardless of whether it has an `href`.
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Settings', href: '/settings' },
 *     { label: 'Billing' },
 *   ]}
 * />
 * ```
 */
export function Breadcrumb({ items, separator, gap, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={[styles.breadcrumb, className].filter(Boolean).join(' ')}
      style={gap !== undefined ? ({ '--pulse-breadcrumb-gap': `${gap}px` } as CSSProperties) : undefined}
    >
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className={styles.item}>
              {isLast ? (
                <span aria-current="page" className={styles.current}>
                  {item.label}
                </span>
              ) : item.href ? (
                <a href={item.href} className={styles.link}>
                  {item.label}
                </a>
              ) : (
                <span className={styles.link}>{item.label}</span>
              )}
              {!isLast && (
                <span className={styles.separator} aria-hidden="true">
                  {separator ?? <Icon as={ChevronRight} size="xs" />}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
