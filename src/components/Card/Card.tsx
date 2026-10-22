import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import styles from './Card.module.css';

export type CardVariant = 'elevated' | 'outlined' | 'filled';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

/**
 * Props for the {@link Card} component.
 *
 * `interactive` renders the card as a `<div>` with `role="button"`,
 * `tabIndex={0}` and Enter/Space key handling instead of swapping the root
 * element to a native `<button>`. A plain `<div>` keeps the header/footer
 * slots free of button content-model restrictions (e.g. nested interactive
 * elements or block-level layout), while the added role, tabIndex and key
 * handling still give it the same keyboard and screen-reader affordances
 * as a real button.
 */
export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Visual style of the card */
  variant?: CardVariant;
  /** Padding applied to the body (header/footer use the same scale) */
  padding?: CardPadding;
  /** Makes the card hoverable/focusable, for use as a clickable card */
  interactive?: boolean;
  /** Content rendered above the body, separated by a border */
  header?: ReactNode;
  /** Content rendered below the body, separated by a border */
  footer?: ReactNode;
  /** Main body content */
  children?: ReactNode;
}

/**
 * Container for grouping related content, with optional header/footer slots.
 *
 * @example
 * ```tsx
 * <Card variant="outlined" padding="lg">
 *   <Text>Plain content</Text>
 * </Card>
 *
 * <Card
 *   header={<Heading level={3}>Title</Heading>}
 *   footer={<Button label="Confirm" />}
 *   interactive
 *   onClick={() => console.log('clicked')}
 * >
 *   Card body content
 * </Card>
 * ```
 */
export function Card({
  variant = 'elevated',
  padding = 'md',
  interactive = false,
  header,
  footer,
  children,
  className,
  onClick,
  onKeyDown,
  ...props
}: CardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (!interactive) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  const classes = [
    styles.card,
    styles[variant],
    interactive ? styles.interactive : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    >
      {header && <div className={[styles.header, styles[`padding-${padding}`]].join(' ')}>{header}</div>}
      <div className={styles[`padding-${padding}`]}>{children}</div>
      {footer && <div className={[styles.footer, styles[`padding-${padding}`]].join(' ')}>{footer}</div>}
    </div>
  );
}
