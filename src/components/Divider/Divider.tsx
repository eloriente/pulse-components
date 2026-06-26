import type { HTMLAttributes } from 'react';
import styles from './Divider.module.css';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';

export interface DividerProps extends HTMLAttributes<HTMLHRElement | HTMLSpanElement> {
  orientation?: DividerOrientation;
  variant?: DividerVariant;
  /** Optional label centered within the divider */
  label?: string;
  className?: string;
}

/**
 * Visual separator — horizontal or vertical.
 *
 * @example
 * ```tsx
 * <Divider />
 * <Divider orientation="vertical" />
 * <Divider label="OR" />
 * ```
 */
export function Divider({
  orientation = 'horizontal',
  variant = 'solid',
  label,
  className,
  ...props
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <span
        role="separator"
        aria-orientation="vertical"
        className={[styles.divider, styles.vertical, styles[variant], className]
          .filter(Boolean)
          .join(' ')}
        {...(props as HTMLAttributes<HTMLSpanElement>)}
      />
    );
  }

  if (label) {
    return (
      <div
        className={[styles.withLabel, styles[variant], className].filter(Boolean).join(' ')}
        role="separator"
      >
        <span className={styles.line} aria-hidden="true" />
        <span className={styles.labelText}>{label}</span>
        <span className={styles.line} aria-hidden="true" />
      </div>
    );
  }

  return (
    <hr
      className={[styles.divider, styles.horizontal, styles[variant], className]
        .filter(Boolean)
        .join(' ')}
      {...(props as HTMLAttributes<HTMLHRElement>)}
    />
  );
}
